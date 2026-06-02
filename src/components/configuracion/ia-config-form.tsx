"use client";

import * as React from "react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, CheckCircle2, Trash2, KeyRound } from "lucide-react";
import {
  guardarApiKeyIA,
  borrarApiKeyIA,
  type IaConfigState,
} from "@/lib/actions/configuracion";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const MODELOS = [
  { value: "claude-opus-4-8", label: "Claude Opus 4.8 — máxima capacidad" },
  { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6 — equilibrio" },
  { value: "claude-haiku-4-5", label: "Claude Haiku 4.5 — rápido y económico" },
];

function GuardarBtn({ configurada }: { configurada: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner /> : <KeyRound className="size-4" />}
      {configurada ? "Actualizar API key" : "Guardar API key"}
    </Button>
  );
}

export function IaConfigForm({
  configurada,
  modelo,
}: {
  configurada: boolean;
  modelo: string;
}) {
  const router = useRouter();
  const [modeloSel, setModeloSel] = React.useState(modelo);
  const [borrando, startBorrar] = React.useTransition();
  const [state, action] = useActionState<IaConfigState, FormData>(guardarApiKeyIA, null);
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message ?? "Guardado");
      router.refresh();
    }
  }, [state, router]);

  function borrar() {
    startBorrar(async () => {
      const r = await borrarApiKeyIA();
      if (r.ok) {
        toast.success(r.message ?? "Eliminada");
        router.refresh();
      } else {
        toast.error(r.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {configurada ? (
          <Badge tone="success">
            <CheckCircle2 className="size-3.5" /> IA configurada
          </Badge>
        ) : (
          <Badge tone="muted">
            <Sparkles className="size-3.5" /> IA no configurada
          </Badge>
        )}
        {configurada && <span className="text-xs text-muted-foreground">Modelo: {modelo}</span>}
      </div>

      <form action={action} className="space-y-4">
        {state && !state.ok && <FormError>{state.error}</FormError>}
        <Field
          label="API key de Anthropic"
          htmlFor="apiKey"
          error={fieldErrors?.apiKey}
          hint="Se guarda cifrada (Supabase Vault). Nunca se vuelve a mostrar. Obtenela en console.anthropic.com."
        >
          <Input
            id="apiKey"
            name="apiKey"
            type="password"
            autoComplete="off"
            placeholder={configurada ? "•••••••••••••• (cargada) — pegá una nueva para reemplazar" : "sk-ant-..."}
          />
        </Field>
        <Field label="Modelo" htmlFor="modelo" hint="Modelo de Claude que usará el estudio.">
          <input type="hidden" name="modelo" value={modeloSel} />
          <Select value={modeloSel} onValueChange={setModeloSel}>
            <SelectTrigger id="modelo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELOS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <div className="flex items-center gap-2">
          <GuardarBtn configurada={configurada} />
          {configurada && (
            <Button type="button" variant="ghost" onClick={borrar} disabled={borrando}>
              {borrando ? <Spinner /> : <Trash2 className="size-4" />}
              Quitar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

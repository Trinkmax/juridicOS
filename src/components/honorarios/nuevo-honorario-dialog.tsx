"use client";

import * as React from "react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { crearHonorario } from "@/lib/actions/honorarios";
import { BASES_HONORARIO } from "./opciones";
import type { ClienteOption, ExpedienteOption } from "./opciones";
import type { BaseHonorario } from "@/lib/validations/honorarios";
import type { ActionResult } from "@/lib/actions/_base";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

const SIN_CLIENTE = "__sin_cliente__";
const SIN_EXPEDIENTE = "__sin_exp__";

function GuardarBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner /> : <Plus className="size-4" />}
      Registrar honorario
    </Button>
  );
}

export function NuevoHonorarioDialog({
  clientes,
  expedientes,
  valorJus,
}: {
  clientes: ClienteOption[];
  expedientes: ExpedienteOption[];
  valorJus: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState<ActionResult | null, FormData>(
    crearHonorario,
    null,
  );

  const [base, setBase] = useState<BaseHonorario>("jus");
  const [cliente, setCliente] = useState(SIN_CLIENTE);
  const [expediente, setExpediente] = useState(SIN_EXPEDIENTE);
  const [jusCantidad, setJusCantidad] = useState("");

  const fieldError = (campo: string) =>
    state && !state.ok ? state.fieldErrors?.[campo] : undefined;

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message ?? "Honorario registrado.");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  // Reset al cerrar.
  useEffect(() => {
    if (!open) {
      setBase("jus");
      setCliente(SIN_CLIENTE);
      setExpediente(SIN_EXPEDIENTE);
      setJusCantidad("");
    }
  }, [open]);

  const previewJus = (Number(jusCantidad) || 0) * valorJus;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Nuevo honorario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo honorario</DialogTitle>
          <DialogDescription>
            Registrá un honorario y su forma de cálculo. El monto se calcula en
            el servidor.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-5">
          <input type="hidden" name="base" value={base} />
          <input
            type="hidden"
            name="cliente_id"
            value={cliente === SIN_CLIENTE ? "" : cliente}
          />
          <input
            type="hidden"
            name="expediente_id"
            value={expediente === SIN_EXPEDIENTE ? "" : expediente}
          />

          {state && !state.ok && <FormError>{state.error}</FormError>}

          <Field label="Concepto" htmlFor="concepto" error={fieldError("concepto")} required>
            <Input
              id="concepto"
              name="concepto"
              placeholder="Ej.: Honorarios por demanda de daños"
              required
              autoFocus
            />
          </Field>

          <Field label="Base de cálculo" hint={BASES_HONORARIO.find((b) => b.value === base)?.hint}>
            <Select value={base} onValueChange={(v) => setBase(v as BaseHonorario)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BASES_HONORARIO.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {base === "jus" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Cantidad de JUS" htmlFor="jus_cantidad" error={fieldError("jus_cantidad")}>
                <Input
                  id="jus_cantidad"
                  name="jus_cantidad"
                  type="number"
                  min={0}
                  step="0.01"
                  value={jusCantidad}
                  onChange={(e) => setJusCantidad(e.target.value)}
                  placeholder="Ej.: 20"
                />
              </Field>
              <Field label="Valor del JUS" hint="Configurado en el estudio.">
                {/* jus_valor enviado oculto; se muestra read-only */}
                <input type="hidden" name="jus_valor" value={valorJus} />
                <Input value={formatMoney(valorJus)} readOnly disabled />
              </Field>
              <div className="sm:col-span-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm">
                <span className="text-muted-foreground">Monto estimado: </span>
                <span className="font-semibold tabular-nums">{formatMoney(previewJus)}</span>
                <span className="text-muted-foreground"> ({jusCantidad || 0} JUS × {formatMoney(valorJus)})</span>
              </div>
            </div>
          )}

          {base === "pacto_cuota_litis" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Porcentaje (%)" htmlFor="porcentaje" error={fieldError("porcentaje")}>
                <Input
                  id="porcentaje"
                  name="porcentaje"
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  placeholder="Ej.: 20"
                />
              </Field>
              <Field label="Monto estimado (opcional)" htmlFor="monto" error={fieldError("monto")} hint="Si ya se conoce el resultado.">
                <Input id="monto" name="monto" type="number" min={0} step="0.01" placeholder="0" />
              </Field>
            </div>
          )}

          {(base === "monto" || base === "tiempo") && (
            <Field label="Monto (ARS)" htmlFor="monto" error={fieldError("monto")} required>
              <Input id="monto" name="monto" type="number" min={0} step="0.01" placeholder="0" required />
            </Field>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cliente">
              <Select value={cliente} onValueChange={setCliente}>
                <SelectTrigger>
                  <SelectValue placeholder="Sin cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SIN_CLIENTE}>Sin cliente</SelectItem>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Expediente">
              <Select value={expediente} onValueChange={setExpediente}>
                <SelectTrigger>
                  <SelectValue placeholder="Sin expediente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SIN_EXPEDIENTE}>Sin expediente</SelectItem>
                  {expedientes.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.caratula}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Notas" htmlFor="notas" error={fieldError("notas")}>
            <Textarea id="notas" name="notas" rows={2} placeholder="Observaciones (opcional)" />
          </Field>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <GuardarBtn />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

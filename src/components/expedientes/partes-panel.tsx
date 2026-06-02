"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, Loader2, Trash2, Users, ShieldCheck } from "lucide-react";
import { crearParte, eliminarParte } from "@/lib/actions/partes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptionBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TIPOS_PARTE, TIPO_PARTE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/lib/actions/_base";
import type { Parte } from "@/lib/types/domain";

function GuardarParte() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <UserPlus />}
      Agregar parte
    </Button>
  );
}

function AgregarParteDialog({ expedienteId }: { expedienteId: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, action] = useActionState<ActionResult | null, FormData>(crearParte, null);
  const [tipo, setTipo] = React.useState<string>("actor");
  const [esPropio, setEsPropio] = React.useState(false);

  React.useEffect(() => {
    if (state?.ok) {
      toast.success("Parte agregada.");
      setOpen(false);
      setTipo("actor");
      setEsPropio(false);
      router.refresh();
    }
  }, [state, router]);

  const fieldError = (campo: string) =>
    state && !state.ok ? state.fieldErrors?.[campo] : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus />
          Agregar parte
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar parte</DialogTitle>
          <DialogDescription>Sumá un litigante o interviniente a la causa.</DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <input type="hidden" name="expediente_id" value={expedienteId} />
          <input type="hidden" name="tipo" value={tipo} />
          <input type="hidden" name="es_propio" value={esPropio ? "true" : "false"} />
          <FormError>{state && !state.ok ? state.error : undefined}</FormError>

          <Field label="Nombre" htmlFor="parte-nombre" required error={fieldError("nombre")}>
            <Input id="parte-nombre" name="nombre" placeholder="Nombre y apellido / Razón social" autoFocus />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo de parte" htmlFor="parte-tipo" required error={fieldError("tipo")}>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger id="parte-tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_PARTE.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Documento" htmlFor="parte-documento" error={fieldError("documento")}>
              <Input id="parte-documento" name="documento" placeholder="DNI / CUIT" />
            </Field>

            <Field label="Carácter" htmlFor="parte-caracter" error={fieldError("caracter")}>
              <Input id="parte-caracter" name="caracter" placeholder="Ej.: por derecho propio" />
            </Field>

            <Field label="Patrocinante" htmlFor="parte-patrocinante" error={fieldError("patrocinante")}>
              <Input id="parte-patrocinante" name="patrocinante" placeholder="Letrado/a" />
            </Field>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 text-sm">
            <Checkbox
              checked={esPropio}
              onCheckedChange={(c) => setEsPropio(c === true)}
            />
            <span className="font-medium">Es la parte que patrocina el estudio</span>
          </label>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <GuardarParte />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ParteItem({ parte }: { parte: Parte }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  function onEliminar() {
    startTransition(async () => {
      const res = await eliminarParte(parte.id);
      if (res.ok) {
        toast.success("Parte eliminada.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-card p-4 transition-all hover:shadow-sm">
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{parte.nombre}</span>
          <OptionBadge option={TIPO_PARTE[parte.tipo]} />
          {parte.es_propio && (
            <Badge tone="primary" className="gap-1">
              <ShieldCheck className="size-3" />
              Patrocinado
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
          {parte.documento && <span>Doc.: {parte.documento}</span>}
          {parte.caracter && <span>Carácter: {parte.caracter}</span>}
          {parte.patrocinante && <span>Patrocina: {parte.patrocinante}</span>}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            aria-label={`Eliminar a ${parte.nombre}`}
          >
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar parte</DialogTitle>
            <DialogDescription>
              ¿Eliminar a <span className="font-medium text-foreground">{parte.nombre}</span> de
              este expediente? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={pending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={onEliminar} disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function PartesPanel({
  expedienteId,
  partes,
}: {
  expedienteId: string;
  partes: Parte[];
}) {
  return (
    <Card className={cn("p-5 space-y-4")}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">Partes</h3>
          <p className="text-sm text-muted-foreground">
            {partes.length} {partes.length === 1 ? "parte" : "partes"} en la causa
          </p>
        </div>
        <AgregarParteDialog expedienteId={expedienteId} />
      </div>

      {partes.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin partes cargadas"
          description="Agregá a los actores, demandados y demás intervinientes de la causa."
          action={<AgregarParteDialog expedienteId={expedienteId} />}
        />
      ) : (
        <div className="space-y-2.5">
          {partes.map((p) => (
            <ParteItem key={p.id} parte={p} />
          ))}
        </div>
      )}
    </Card>
  );
}

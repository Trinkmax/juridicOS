"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2, History } from "lucide-react";
import { crearMovimiento } from "@/lib/actions/movimientos";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { formatFecha, capitalizar } from "@/lib/format";
import type { ActionResult } from "@/lib/actions/_base";
import type { Movimiento } from "@/lib/types/domain";

function GuardarMovimiento() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Plus />}
      Registrar movimiento
    </Button>
  );
}

function NuevoMovimientoDialog({ expedienteId }: { expedienteId: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, action] = useActionState<ActionResult | null, FormData>(
    crearMovimiento,
    null,
  );

  const hoy = new Date().toISOString().slice(0, 10);

  React.useEffect(() => {
    if (state?.ok) {
      toast.success("Movimiento registrado.");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  const fieldError = (campo: string) =>
    state && !state.ok ? state.fieldErrors?.[campo] : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          Nuevo movimiento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo movimiento</DialogTitle>
          <DialogDescription>Registrá una actuación en la cronología de la causa.</DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <input type="hidden" name="expediente_id" value={expedienteId} />
          <FormError>{state && !state.ok ? state.error : undefined}</FormError>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fecha" htmlFor="mov-fecha" required error={fieldError("fecha")}>
              <Input id="mov-fecha" name="fecha" type="date" defaultValue={hoy} />
            </Field>
            <Field label="Tipo" htmlFor="mov-tipo" error={fieldError("tipo")} hint="Ej.: Decreto, Escrito.">
              <Input id="mov-tipo" name="tipo" placeholder="Tipo de actuación" />
            </Field>
          </div>

          <Field label="Título" htmlFor="mov-titulo" required error={fieldError("titulo")}>
            <Input id="mov-titulo" name="titulo" placeholder="Ej.: Se presenta contestación de demanda" autoFocus />
          </Field>

          <Field label="Descripción" htmlFor="mov-descripcion" error={fieldError("descripcion")}>
            <Textarea id="mov-descripcion" name="descripcion" placeholder="Detalle de la actuación…" />
          </Field>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <GuardarMovimiento />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MovimientosPanel({
  expedienteId,
  movimientos,
}: {
  expedienteId: string;
  movimientos: Movimiento[];
}) {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-semibold">Cronología</h3>
          <p className="text-sm text-muted-foreground">
            {movimientos.length}{" "}
            {movimientos.length === 1 ? "movimiento registrado" : "movimientos registrados"}
          </p>
        </div>
        <NuevoMovimientoDialog expedienteId={expedienteId} />
      </div>

      {movimientos.length === 0 ? (
        <EmptyState
          icon={History}
          title="Sin movimientos"
          description="Registrá la primera actuación para empezar a construir la cronología."
          action={<NuevoMovimientoDialog expedienteId={expedienteId} />}
        />
      ) : (
        <ol className="relative space-y-6 pl-6">
          {/* Línea vertical */}
          <span
            aria-hidden
            className="absolute left-[5px] top-2 bottom-2 w-px bg-border"
          />
          {movimientos.map((m) => (
            <li key={m.id} className="relative">
              {/* Punto */}
              <span
                aria-hidden
                className="absolute -left-[1.4rem] top-1 size-2.5 rounded-full border-2 border-card bg-primary ring-2 ring-primary/20"
              />
              <div className="flex flex-wrap items-center gap-2">
                <time className="text-data text-xs font-medium text-muted-foreground">
                  {capitalizar(formatFecha(m.fecha))}
                </time>
                {m.tipo && (
                  <Badge tone="muted" className="text-[0.7rem]">
                    {m.tipo}
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 font-medium leading-snug">{m.titulo}</p>
              {m.descripcion && (
                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                  {m.descripcion}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

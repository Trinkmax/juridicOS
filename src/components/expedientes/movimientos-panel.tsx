"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  History,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento,
} from "@/lib/actions/movimientos";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { formatFecha, capitalizar } from "@/lib/format";
import type { ActionResult } from "@/lib/actions/_base";
import type { Movimiento } from "@/lib/types/domain";

function Guardar({ editando }: { editando: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Plus />}
      {editando ? "Guardar cambios" : "Registrar movimiento"}
    </Button>
  );
}

/** Diálogo de movimiento: crea (sin `movimiento`) o edita (con `movimiento`). */
function MovimientoFormDialog({
  expedienteId,
  movimiento,
  open,
  onOpenChange,
}: {
  expedienteId: string;
  movimiento?: Movimiento;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const editando = Boolean(movimiento);
  const accion = React.useMemo(
    () => (movimiento ? actualizarMovimiento.bind(null, movimiento.id) : crearMovimiento),
    [movimiento],
  );
  const [state, action] = useActionState<ActionResult | null, FormData>(accion, null);

  const hoy = new Date().toISOString().slice(0, 10);

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(state.message ?? (editando ? "Movimiento actualizado." : "Movimiento registrado."));
      onOpenChange(false);
      router.refresh();
    }
  }, [state, editando, onOpenChange, router]);

  const fieldError = (campo: string) =>
    state && !state.ok ? state.fieldErrors?.[campo] : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar movimiento" : "Nuevo movimiento"}</DialogTitle>
          <DialogDescription>
            {editando
              ? "Actualizá esta actuación de la causa."
              : "Registrá una actuación en la cronología de la causa."}
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <input type="hidden" name="expediente_id" value={expedienteId} />
          <FormError>{state && !state.ok ? state.error : undefined}</FormError>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fecha" htmlFor="mov-fecha" required error={fieldError("fecha")}>
              <Input
                id="mov-fecha"
                name="fecha"
                type="date"
                defaultValue={movimiento?.fecha ?? hoy}
              />
            </Field>
            <Field label="Tipo" htmlFor="mov-tipo" error={fieldError("tipo")} hint="Ej.: Decreto, Escrito.">
              <Input
                id="mov-tipo"
                name="tipo"
                placeholder="Tipo de actuación"
                defaultValue={movimiento?.tipo ?? ""}
              />
            </Field>
          </div>

          <Field label="Título" htmlFor="mov-titulo" required error={fieldError("titulo")}>
            <Input
              id="mov-titulo"
              name="titulo"
              placeholder="Ej.: Se presenta contestación de demanda"
              defaultValue={movimiento?.titulo ?? ""}
              autoFocus
            />
          </Field>

          <Field label="Descripción" htmlFor="mov-descripcion" error={fieldError("descripcion")}>
            <Textarea
              id="mov-descripcion"
              name="descripcion"
              placeholder="Detalle de la actuación…"
              defaultValue={movimiento?.descripcion ?? ""}
            />
          </Field>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Guardar editando={editando} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MovimientoAcciones({
  movimiento,
  onEditar,
}: {
  movimiento: Movimiento;
  onEditar: (m: Movimiento) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [borrarOpen, setBorrarOpen] = React.useState(false);

  function onEliminar() {
    startTransition(async () => {
      const res = await eliminarMovimiento(movimiento.id);
      if (res.ok) {
        toast.success(res.message ?? "Movimiento eliminado.");
        setBorrarOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground"
            aria-label="Acciones del movimiento"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onEditar(movimiento)}>
            <Pencil className="size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setBorrarOpen(true)}
            className="text-destructive focus:bg-destructive-soft focus:text-destructive [&_svg]:text-destructive"
          >
            <Trash2 className="size-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={borrarOpen} onOpenChange={setBorrarOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar movimiento</DialogTitle>
            <DialogDescription>
              ¿Eliminar <span className="font-medium text-foreground">{movimiento.titulo}</span> de
              la cronología? Esta acción no se puede deshacer.
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
    </>
  );
}

export function MovimientosPanel({
  expedienteId,
  movimientos,
}: {
  expedienteId: string;
  movimientos: Movimiento[];
}) {
  const [nuevoOpen, setNuevoOpen] = React.useState(false);
  const [editando, setEditando] = React.useState<Movimiento | null>(null);

  return (
    <Card className="p-6 space-y-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="font-display text-base font-semibold">Cronología</h3>
          <p className="text-sm text-muted-foreground">
            {movimientos.length}{" "}
            {movimientos.length === 1 ? "movimiento registrado" : "movimientos registrados"}
          </p>
        </div>
        <Button size="sm" onClick={() => setNuevoOpen(true)}>
          <Plus />
          Nuevo movimiento
        </Button>
      </div>

      {movimientos.length === 0 ? (
        <EmptyState
          icon={History}
          title="Sin movimientos"
          description="Registrá la primera actuación para empezar a construir la cronología."
          action={
            <Button onClick={() => setNuevoOpen(true)}>
              <Plus />
              Nuevo movimiento
            </Button>
          }
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
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
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
                </div>
                <MovimientoAcciones movimiento={m} onEditar={setEditando} />
              </div>
            </li>
          ))}
        </ol>
      )}

      <MovimientoFormDialog
        expedienteId={expedienteId}
        open={nuevoOpen}
        onOpenChange={setNuevoOpen}
      />
      {editando && (
        <MovimientoFormDialog
          key={editando.id}
          expedienteId={expedienteId}
          movimiento={editando}
          open
          onOpenChange={(o) => {
            if (!o) setEditando(null);
          }}
        />
      )}
    </Card>
  );
}

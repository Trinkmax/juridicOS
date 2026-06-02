"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Tarea } from "@/lib/types/domain";
import type { EstadoTarea } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  TareaForm,
  type MiembroOption,
  type ExpedienteOption,
} from "./tarea-form";

export function NuevaTareaDialog({
  miembros,
  expedientes,
  tarea,
  estadoInicial,
  trigger,
  open: openProp,
  onOpenChange,
}: {
  miembros: MiembroOption[];
  expedientes: ExpedienteOption[];
  /** Si viene, el diálogo edita esa tarea. */
  tarea?: Tarea;
  estadoInicial?: EstadoTarea;
  /** Trigger custom. Si no se pasa y es controlado, no se renderiza ninguno. */
  trigger?: React.ReactNode;
  /** Modo controlado (para abrir desde un DropdownMenu). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [openInner, setOpenInner] = useState(false);
  const controlado = openProp !== undefined;
  const open = controlado ? openProp : openInner;
  const setOpen = controlado ? (onOpenChange ?? (() => {})) : setOpenInner;

  const esEdicion = !!tarea;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : !controlado ? (
        <DialogTrigger asChild>
          <Button>
            <Plus className="size-4" />
            Nueva tarea
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{esEdicion ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
          <DialogDescription>
            {esEdicion
              ? "Actualizá los datos de la tarea."
              : "Sumá una tarea al tablero y asignala al equipo."}
          </DialogDescription>
        </DialogHeader>
        <TareaForm
          tarea={tarea}
          miembros={miembros}
          expedientes={expedientes}
          estadoInicial={estadoInicial}
          onSuccess={() => setOpen(false)}
          cancel={
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
          }
        />
      </DialogContent>
    </Dialog>
  );
}

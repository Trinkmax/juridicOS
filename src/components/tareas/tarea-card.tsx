"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  CalendarClock,
  FileText,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ESTADOS_TAREA,
  PRIORIDAD,
  type EstadoTarea,
} from "@/lib/constants";
import { cambiarEstadoTarea, eliminarTarea } from "@/lib/actions/tareas";
import { formatFechaCorta, etiquetaVencimiento, diasRestantes } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { OptionBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { TareaConRelaciones } from "./kanban-board";
import { NuevaTareaDialog } from "./nueva-tarea-dialog";
import type { MiembroOption, ExpedienteOption } from "./tarea-form";

export function TareaCard({
  tarea,
  miembros,
  expedientes,
  onMover,
  dragging,
}: {
  tarea: TareaConRelaciones;
  miembros: MiembroOption[];
  expedientes: ExpedienteOption[];
  /** Optimistic update local desde el menú "Mover a…". */
  onMover: (id: string, estado: EstadoTarea) => void;
  /** Si es el overlay arrastrado, desactivamos listeners. */
  dragging?: boolean;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tarea.id,
    disabled: dragging,
  });

  const prioridad = PRIORIDAD[tarea.prioridad as keyof typeof PRIORIDAD];
  const asignado = tarea.asignado;
  const dias = diasRestantes(tarea.vencimiento);
  const vencido =
    tarea.vencimiento != null &&
    tarea.estado !== "completada" &&
    dias !== null &&
    dias < 0;

  function mover(estado: EstadoTarea) {
    if (estado === tarea.estado) return;
    onMover(tarea.id, estado);
    startTransition(async () => {
      const res = await cambiarEstadoTarea(tarea.id, estado);
      if (!res.ok) {
        toast.error(res.error);
        router.refresh();
      } else {
        toast.success(`Movida a “${ESTADOS_TAREA.find((e) => e.value === estado)?.label}”`);
      }
    });
  }

  function borrar() {
    startTransition(async () => {
      const res = await eliminarTarea(tarea.id);
      if (!res.ok) toast.error(res.error);
      else {
        toast.success("Tarea eliminada");
        router.refresh();
      }
    });
  }

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging && !dragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "group rounded-lg border border-border bg-card p-3 transition-colors",
        "hover:border-foreground/20 hover:bg-accent/60",
        dragging ? "cursor-grabbing shadow-lg" : "cursor-grab",
      )}
    >
      <div className="flex items-start gap-2">
        <span
          aria-hidden
          className="mt-0.5 text-muted-foreground/40 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
        >
          <GripVertical className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug text-foreground">
            {tarea.titulo}
          </p>

          {tarea.descripcion && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {tarea.descripcion}
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {prioridad && <OptionBadge option={prioridad} dot />}

            {tarea.vencimiento && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-data text-xs",
                      vencido ? "text-destructive font-medium" : "text-muted-foreground",
                    )}
                  >
                    <CalendarClock className="size-3" />
                    {formatFechaCorta(tarea.vencimiento)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{etiquetaVencimiento(tarea.vencimiento)}</TooltipContent>
              </Tooltip>
            )}
          </div>

          {tarea.expediente?.caratula && (
            <Link
              href={`/expedientes/${tarea.expediente_id}`}
              onPointerDown={(e) => e.stopPropagation()}
              className="mt-2 inline-flex max-w-full items-center gap-1 text-xs text-primary hover:underline"
            >
              <FileText className="size-3 shrink-0" />
              <span className="truncate">{tarea.expediente.caratula}</span>
            </Link>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-100 transition-opacity data-[state=open]:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Acciones de la tarea"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Pencil className="size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Mover a…</DropdownMenuLabel>
              {ESTADOS_TAREA.filter((e) => e.value !== "cancelada").map((e) => (
                <DropdownMenuItem
                  key={e.value}
                  disabled={e.value === tarea.estado}
                  onSelect={() => mover(e.value)}
                >
                  <ArrowRight className="size-4" />
                  {e.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={borrar}
                className="text-destructive focus:bg-destructive-soft focus:text-destructive [&_svg]:text-destructive"
              >
                <Trash2 className="size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {asignado && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Avatar
                    name={asignado.nombre_completo}
                    src={asignado.avatar_url}
                    size="xs"
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent>{asignado.nombre_completo ?? "Responsable"}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <NuevaTareaDialog
        tarea={tarea}
        miembros={miembros}
        expedientes={expedientes}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}

"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ESTADOS_TAREA,
  ESTADO_TAREA,
  type EstadoTarea,
} from "@/lib/constants";
import type { Tarea } from "@/lib/types/domain";
import { cambiarEstadoTarea } from "@/lib/actions/tareas";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TareaCard } from "./tarea-card";
import type { MiembroOption, ExpedienteOption } from "./tarea-form";

/** Tarea con los embeds que trae la página (joins to-one). */
export type TareaConRelaciones = Tarea & {
  expediente: { caratula: string | null } | null;
  asignado: { nombre_completo: string | null; avatar_url: string | null } | null;
};

/** Columnas del tablero (todos los estados menos "cancelada"). */
const COLUMNAS = ESTADOS_TAREA.filter(
  (e) => e.value !== "cancelada",
) as { value: EstadoTarea; label: string }[];

function Columna({
  estado,
  label,
  tareas,
  miembros,
  expedientes,
  onMover,
  isActiveOver,
}: {
  estado: EstadoTarea;
  label: string;
  tareas: TareaConRelaciones[];
  miembros: MiembroOption[];
  expedientes: ExpedienteOption[];
  onMover: (id: string, estado: EstadoTarea) => void;
  isActiveOver: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: estado });
  const tono = ESTADO_TAREA[estado]?.tone ?? "muted";
  const activo = isOver || isActiveOver;

  return (
    <div className="flex w-72 shrink-0 flex-col sm:w-80">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-2 rounded-full",
              tono === "muted" && "bg-muted-foreground/40",
              tono === "info" && "bg-info",
              tono === "warning" && "bg-warning",
              tono === "success" && "bg-success",
            )}
          />
          <h2 className="font-display text-sm font-semibold text-foreground">{label}</h2>
          <Badge tone="muted" className="text-data">
            {tareas.length}
          </Badge>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-32 flex-1 flex-col gap-2.5 rounded-lg border border-dashed border-transparent p-2 transition-colors",
          activo && "border-primary/40 bg-primary-soft/40",
        )}
      >
        {tareas.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-md py-8 text-center text-xs text-muted-foreground/70">
            {activo ? "Soltá acá" : "Sin tareas"}
          </div>
        ) : (
          tareas.map((t) => (
            <TareaCard
              key={t.id}
              tarea={t}
              miembros={miembros}
              expedientes={expedientes}
              onMover={onMover}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({
  tareasIniciales,
  miembros,
  expedientes,
}: {
  tareasIniciales: TareaConRelaciones[];
  miembros: MiembroOption[];
  expedientes: ExpedienteOption[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [tareas, setTareas] = useState<TareaConRelaciones[]>(tareasIniciales);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overEstado, setOverEstado] = useState<EstadoTarea | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const porEstado = useMemo(() => {
    const map = new Map<EstadoTarea, TareaConRelaciones[]>();
    for (const c of COLUMNAS) map.set(c.value, []);
    for (const t of tareas) {
      const arr = map.get(t.estado as EstadoTarea);
      if (arr) arr.push(t);
    }
    return map;
  }, [tareas]);

  const activeTarea = activeId ? tareas.find((t) => t.id === activeId) ?? null : null;

  /** Optimistic local + persistencia. Compartido por DnD y "Mover a…". */
  function aplicarMovimiento(id: string, estado: EstadoTarea) {
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado } : t)),
    );
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverEstado(null);
    if (!over) return;

    const id = String(active.id);
    const destino = String(over.id) as EstadoTarea;
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea || !COLUMNAS.some((c) => c.value === destino)) return;
    if (tarea.estado === destino) return;

    const anterior = tarea.estado as EstadoTarea;
    aplicarMovimiento(id, destino);

    startTransition(async () => {
      const res = await cambiarEstadoTarea(id, destino);
      if (!res.ok) {
        toast.error(res.error);
        aplicarMovimiento(id, anterior); // rollback
        router.refresh();
      } else {
        toast.success(
          `Movida a “${COLUMNAS.find((c) => c.value === destino)?.label}”`,
        );
      }
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveId(null);
        setOverEstado(null);
      }}
      onDragOver={(e) => {
        const over = e.over ? (String(e.over.id) as EstadoTarea) : null;
        setOverEstado(over && COLUMNAS.some((c) => c.value === over) ? over : null);
      }}
    >
      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-4">
        {COLUMNAS.map((c) => (
          <Columna
            key={c.value}
            estado={c.value}
            label={c.label}
            tareas={porEstado.get(c.value) ?? []}
            miembros={miembros}
            expedientes={expedientes}
            onMover={aplicarMovimiento}
            isActiveOver={overEstado === c.value}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTarea ? (
          <TareaCard
            tarea={activeTarea}
            miembros={miembros}
            expedientes={expedientes}
            onMover={aplicarMovimiento}
            dragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

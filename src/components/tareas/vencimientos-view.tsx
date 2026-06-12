"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarClock,
  Check,
  CheckCircle2,
  FileText,
  ListTodo,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { PRIORIDAD, type Tone } from "@/lib/constants";
import { cambiarEstadoTarea, eliminarTarea } from "@/lib/actions/tareas";
import {
  diasRestantes,
  etiquetaVencimiento,
  formatFechaCorta,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OptionBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { TareaConRelaciones } from "./kanban-board";
import { NuevaTareaDialog } from "./nueva-tarea-dialog";
import type { MiembroOption, ExpedienteOption } from "./tarea-form";

/* ── Grupos por vencimiento ──────────────────────────────────────────── */

type GrupoId =
  | "vencidas"
  | "hoy"
  | "semana"
  | "adelante"
  | "sin_fecha"
  | "completadas";

type GrupoDef = {
  id: GrupoId;
  label: string;
  /** Tono del encabezado/contador. */
  tone: Tone;
  /** Color del punto del encabezado. */
  dot: string;
};

const GRUPOS: GrupoDef[] = [
  { id: "vencidas", label: "Vencidas", tone: "destructive", dot: "bg-destructive" },
  { id: "hoy", label: "Hoy", tone: "destructive", dot: "bg-destructive" },
  { id: "semana", label: "Esta semana", tone: "warning", dot: "bg-warning" },
  { id: "adelante", label: "Más adelante", tone: "muted", dot: "bg-muted-foreground/40" },
  { id: "sin_fecha", label: "Sin fecha", tone: "muted", dot: "bg-muted-foreground/30" },
  { id: "completadas", label: "Completadas", tone: "muted", dot: "bg-foreground/55" },
];

/** Asigna una tarea (no cancelada) a su grupo según vencimiento/estado. */
function grupoDeTarea(t: TareaConRelaciones): GrupoId {
  if (t.estado === "completada") return "completadas";
  if (t.vencimiento == null) return "sin_fecha";
  const dias = diasRestantes(t.vencimiento);
  if (dias === null) return "sin_fecha";
  if (dias < 0) return "vencidas";
  if (dias === 0) return "hoy";
  if (dias >= 1 && dias <= 7) return "semana";
  return "adelante";
}

/* ── Fila presentacional (sin dnd) ───────────────────────────────────── */

function TareaFila({
  tarea,
  miembros,
  expedientes,
}: {
  tarea: TareaConRelaciones;
  miembros: MiembroOption[];
  expedientes: ExpedienteOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

  const prioridad = PRIORIDAD[tarea.prioridad as keyof typeof PRIORIDAD];
  const asignado = tarea.asignado;
  const completada = tarea.estado === "completada";
  const dias = diasRestantes(tarea.vencimiento);
  const vencido =
    tarea.vencimiento != null && !completada && dias !== null && dias < 0;

  function completar() {
    startTransition(async () => {
      const res = await cambiarEstadoTarea(tarea.id, "completada");
      if (!res.ok) toast.error(res.error);
      else {
        toast.success(`Tarea completada: “${tarea.titulo}”`);
        router.refresh();
      }
    });
  }

  function reabrir() {
    startTransition(async () => {
      const res = await cambiarEstadoTarea(tarea.id, "pendiente");
      if (!res.ok) toast.error(res.error);
      else {
        toast.success("Tarea reabierta");
        router.refresh();
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

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-3 shadow-xs transition-colors",
        "hover:border-foreground/20 hover:bg-accent/50",
        pending && "opacity-60",
      )}
    >
      {/* Completar / reabrir rápido */}
      {completada ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={reabrir}
              disabled={pending}
              aria-label="Reabrir tarea"
              className="grid size-7 shrink-0 place-items-center rounded-full border border-foreground/70 bg-foreground/80 text-background transition-colors hover:border-border hover:bg-transparent hover:text-foreground sm:size-5"
            >
              <Check className="size-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Reabrir</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={completar}
              disabled={pending}
              aria-label={`Completar tarea: ${tarea.titulo}`}
              className="grid size-7 shrink-0 place-items-center rounded-full border border-border text-transparent transition-colors hover:border-foreground hover:bg-accent hover:text-foreground focus-visible:border-foreground focus-visible:text-foreground sm:size-5"
            >
              <Check className="size-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Completar</TooltipContent>
        </Tooltip>
      )}

      {/* Título + expediente */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium leading-snug text-foreground",
            completada && "text-muted-foreground line-through",
          )}
        >
          {tarea.titulo}
        </p>
        {tarea.expediente?.caratula && tarea.expediente_id && (
          <Link
            href={`/expedientes/${tarea.expediente_id}`}
            className="mt-0.5 inline-flex max-w-full items-center gap-1 text-xs text-primary hover:underline"
          >
            <FileText className="size-3 shrink-0" />
            <span className="truncate">{tarea.expediente.caratula}</span>
          </Link>
        )}
      </div>

      {/* Prioridad */}
      {prioridad && (
        <div className="hidden shrink-0 sm:block">
          <OptionBadge option={prioridad} dot />
        </div>
      )}

      {/* Vencimiento con color de urgencia */}
      {tarea.vencimiento && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 text-data text-xs",
                vencido
                  ? "font-medium text-destructive"
                  : "text-muted-foreground",
              )}
            >
              <CalendarClock className="size-3" />
              <span className="hidden md:inline">
                {etiquetaVencimiento(tarea.vencimiento)}
              </span>
              <span className="md:hidden">
                {formatFechaCorta(tarea.vencimiento)}
              </span>
            </span>
          </TooltipTrigger>
          <TooltipContent>{formatFechaCorta(tarea.vencimiento)}</TooltipContent>
        </Tooltip>
      )}

      {/* Asignado */}
      {asignado && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="shrink-0">
              <Avatar
                name={asignado.nombre_completo}
                src={asignado.avatar_url}
                size="xs"
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {asignado.nombre_completo ?? "Responsable"}
          </TooltipContent>
        </Tooltip>
      )}

      {/* Menú de acciones */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 opacity-100 transition-opacity focus-visible:opacity-100 data-[state=open]:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Acciones de la tarea"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {completada ? (
            <DropdownMenuItem onSelect={reabrir}>
              <CalendarClock className="size-4" />
              Reabrir
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={completar}>
              <CheckCircle2 className="size-4" />
              Completar
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Editar
          </DropdownMenuItem>
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

/* ── Vista por vencimiento ───────────────────────────────────────────── */

export function VencimientosView({
  tareas,
  miembros,
  expedientes,
}: {
  tareas: TareaConRelaciones[];
  miembros: MiembroOption[];
  expedientes: ExpedienteOption[];
}) {
  const grupos = useMemo(() => {
    const map = new Map<GrupoId, TareaConRelaciones[]>();
    for (const g of GRUPOS) map.set(g.id, []);
    for (const t of tareas) {
      if (t.estado === "cancelada") continue;
      map.get(grupoDeTarea(t))?.push(t);
    }
    // Orden interno: por vencimiento ascendente; sin fecha al final del grupo.
    for (const arr of map.values()) {
      arr.sort((a, b) => {
        if (a.vencimiento == null && b.vencimiento == null) return 0;
        if (a.vencimiento == null) return 1;
        if (b.vencimiento == null) return -1;
        return a.vencimiento.localeCompare(b.vencimiento);
      });
    }
    return map;
  }, [tareas]);

  const hayTareas = tareas.some((t) => t.estado !== "cancelada");
  if (!hayTareas) {
    return (
      <EmptyState
        icon={ListTodo}
        title="No hay tareas todavía"
        description="Creá la primera tarea del estudio y aparecerá acá, agrupada por vencimiento."
      />
    );
  }

  return (
    <div className="space-y-8">
      {GRUPOS.map((g) => {
        const items = grupos.get(g.id) ?? [];
        if (items.length === 0) return null;
        const completadas = g.id === "completadas";

        return (
          <section
            key={g.id}
            aria-label={g.label}
            className={cn(completadas && "opacity-70")}
          >
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className={cn("size-2 shrink-0 rounded-full", g.dot)} />
              <h2 className="font-display text-sm font-semibold text-foreground">
                {g.label}
              </h2>
              <Badge tone={g.tone} className="text-data">
                {items.length}
              </Badge>
            </div>

            <div className="space-y-2.5">
              {items.map((t) => (
                <TareaFila
                  key={t.id}
                  tarea={t}
                  miembros={miembros}
                  expedientes={expedientes}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { parseISO, format, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  List,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { capitalizar } from "@/lib/format";
import { AgendaCalendario } from "./agenda-calendario";
import { AgendaLista } from "./agenda-lista";
import { EventoDetalle } from "./evento-detalle";
import { AudienciaForm } from "./audiencia-form";
import { EditarPlazoForm } from "@/components/plazos/editar-plazo-dialog";
import { eliminarAudiencia } from "@/lib/actions/audiencias";
import { eliminarPlazo } from "@/lib/actions/plazos";
import { type AgendaItem } from "./tipos";

const LEYENDA: { dot: string; label: string }[] = [
  { dot: "bg-info", label: "Audiencia" },
  // El plazo toma color de su urgencia (ámbar/rojo); en reposo es tinta sobria.
  { dot: "bg-foreground/55", label: "Plazo" },
  { dot: "bg-primary", label: "Evento" },
];

type Modo = "detalle" | "editar" | "borrar";

export function AgendaVista({
  items,
  mes,
  vista,
}: {
  items: AgendaItem[];
  mes: string; // YYYY-MM
  vista: "mes" | "lista";
}) {
  const router = useRouter();
  const [sel, setSel] = React.useState<AgendaItem | null>(null);
  const [modo, setModo] = React.useState<Modo>("detalle");
  const [pending, startTransition] = React.useTransition();

  const anchor = parseISO(`${mes}-01`);
  const prevMes = format(addMonths(anchor, -1), "yyyy-MM");
  const nextMes = format(addMonths(anchor, 1), "yyyy-MM");
  const hoyMes = format(new Date(), "yyyy-MM");
  const titulo = capitalizar(format(anchor, "MMMM yyyy", { locale: es }));
  const href = (m: string, v: string) => `/agenda?mes=${m}&vista=${v}`;

  function abrir(item: AgendaItem) {
    setSel(item);
    setModo("detalle");
  }
  function cerrar() {
    setSel(null);
    setModo("detalle");
  }

  const editable = sel?.tipo === "audiencia" || sel?.tipo === "plazo";

  const audienciaEdit =
    sel && sel.tipo === "audiencia"
      ? {
          id: sel.id,
          expediente_id: sel.expedienteId ?? "",
          titulo: sel.titulo,
          tipo: sel.audienciaTipo ?? null,
          fecha_hora: sel.hora ?? sel.fecha,
          duracion_min: sel.duracionMin ?? null,
          modalidad: sel.modalidadAud ?? "presencial",
          lugar: sel.lugar ?? null,
          juzgado: sel.juzgado ?? null,
          enlace: sel.enlace ?? null,
        }
      : null;

  const plazoEdit =
    sel && sel.tipo === "plazo"
      ? {
          id: sel.id,
          expediente_id: sel.expedienteId ?? null,
          acto_procesal: sel.titulo,
          dias: sel.dias ?? null,
          modalidad: sel.modalidadPlazo ?? null,
          fecha_inicio_computo: sel.fechaInicioComputo ?? null,
          jurisdiccion: sel.jurisdiccion ?? null,
          prioridad: sel.prioridad ?? null,
          descripcion: sel.descripcion ?? null,
        }
      : null;

  function onEliminar() {
    if (!sel) return;
    startTransition(async () => {
      const res =
        sel.tipo === "audiencia"
          ? await eliminarAudiencia(sel.id)
          : await eliminarPlazo(sel.id);
      if (res.ok) {
        toast.success(sel.tipo === "audiencia" ? "Audiencia eliminada." : "Plazo eliminado.");
        cerrar();
        router.refresh();
      } else {
        toast.error(res.error || "No se pudo eliminar.");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="min-w-[8.5rem] font-display text-xl font-semibold capitalize">
            {titulo}
          </h2>
          <div className="flex items-center gap-1">
            <Button asChild variant="outline" size="icon-sm">
              <Link href={href(prevMes, vista)} aria-label="Mes anterior" scroll={false}>
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon-sm">
              <Link href={href(nextMes, vista)} aria-label="Mes siguiente" scroll={false}>
                <ChevronRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(mes === hoyMes && "text-primary")}
            >
              <Link href={href(hoyMes, vista)} scroll={false}>
                Hoy
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="hidden items-center gap-4 md:flex">
            {LEYENDA.map((l) => (
              <span
                key={l.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span className={cn("size-1.5 rounded-full", l.dot)} />
                {l.label}
              </span>
            ))}
          </div>
          <div className="flex items-center rounded-md border border-border bg-card p-0.5 shadow-xs">
            <Link
              href={href(mes, "mes")}
              scroll={false}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm transition-colors sm:py-1.5",
                vista === "mes"
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <CalendarDays className="size-4" />
              Mes
            </Link>
            <Link
              href={href(mes, "lista")}
              scroll={false}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm transition-colors sm:py-1.5",
                vista === "lista"
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List className="size-4" />
              Agenda
            </Link>
          </div>
        </div>
      </div>

      {vista === "mes" ? (
        <AgendaCalendario items={items} mes={mes} onSelect={abrir} />
      ) : (
        <AgendaLista items={items} onSelect={abrir} />
      )}

      <Dialog
        open={!!sel}
        onOpenChange={(o) => {
          if (!o) cerrar();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {sel && modo === "detalle" && (
            <EventoDetalle
              item={sel}
              onEditar={editable ? () => setModo("editar") : undefined}
              onEliminar={editable ? () => setModo("borrar") : undefined}
            />
          )}

          {sel && modo === "editar" && audienciaEdit && (
            <>
              <DialogHeader>
                <DialogTitle>Editar audiencia</DialogTitle>
                <DialogDescription>Actualizá los datos de la audiencia.</DialogDescription>
              </DialogHeader>
              <AudienciaForm
                audiencia={audienciaEdit}
                expedientes={[
                  { id: sel.expedienteId ?? "", caratula: sel.expediente ?? "Expediente" },
                ]}
                onSuccess={cerrar}
              />
            </>
          )}

          {sel && modo === "editar" && plazoEdit && (
            <>
              <DialogHeader>
                <DialogTitle>Editar plazo</DialogTitle>
                <DialogDescription>
                  Si cambiás los días o la fecha de cómputo, el vencimiento se recalcula solo.
                </DialogDescription>
              </DialogHeader>
              <EditarPlazoForm plazo={plazoEdit} onSuccess={cerrar} />
            </>
          )}

          {sel && modo === "borrar" && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {sel.tipo === "audiencia" ? "Eliminar audiencia" : "Eliminar plazo"}
                </DialogTitle>
                <DialogDescription>
                  ¿Eliminar <span className="font-medium text-foreground">{sel.titulo}</span>? Esta
                  acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setModo("detalle")}
                  disabled={pending}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onEliminar}
                  disabled={pending}
                >
                  {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
                  Eliminar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

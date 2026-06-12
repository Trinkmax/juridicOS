"use client";

import * as React from "react";
import Link from "next/link";
import {
  History,
  Gavel,
  CalendarClock,
  CalendarDays,
  Tag,
  AlignLeft,
  Inbox,
  ArrowRight,
  Folder,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { plazoTono } from "@/components/shared/plazo-badge";
import { TONE_DOT } from "@/components/agenda/tipos";
import type { AgendaItem } from "@/components/agenda/tipos";
import { EventoDetalle } from "@/components/agenda/evento-detalle";
import { type Tone } from "@/lib/constants";
import { formatFecha, capitalizar } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Movimiento, Audiencia, PlazoDetalle } from "@/lib/types/domain";

/* ── Tipo unificado de la línea de tiempo del cliente ────────────────── */
type TimelineKind = "movimiento" | "audiencia" | "plazo";

type TimelineItem = {
  kind: TimelineKind;
  id: string;
  fecha: string; // ISO. movimiento=fecha · audiencia=fecha_hora · plazo=fecha_vencimiento
  titulo: string;
  expedienteId: string;
  caratula: string;
  movimiento?: Movimiento;
  agendaItem?: AgendaItem; // audiencia/plazo mapeados a AgendaItem (para EventoDetalle)
  plazo?: PlazoDetalle;
};

const KIND_LABEL: Record<TimelineKind, string> = {
  movimiento: "Movimiento",
  audiencia: "Audiencia",
  plazo: "Plazo",
};

/** Tono base del kind. Para plazos el tono real depende de la urgencia. */
const KIND_TONE: Record<TimelineKind, Tone> = {
  movimiento: "muted",
  audiencia: "info",
  plazo: "destructive",
};

const KIND_ICON: Record<TimelineKind, LucideIcon> = {
  movimiento: History,
  audiencia: Gavel,
  plazo: CalendarClock,
};

/** Anillo suave del dot por tono (clases estáticas para Tailwind v4). */
const TONE_RING: Record<Tone, string> = {
  default: "ring-muted-foreground/20",
  primary: "ring-primary/20",
  muted: "ring-muted-foreground/20",
  info: "ring-info/20",
  success: "ring-success/20",
  warning: "ring-warning/20",
  destructive: "ring-destructive/20",
};

const ORIGEN_LABEL: Record<string, string> = {
  manual: "Carga manual",
  sac: "SAC (sincronizado)",
  sistema: "Generado por el sistema",
};

/** Tono efectivo del ítem (los plazos reflejan urgencia, el corazón del producto). */
function itemTone(item: TimelineItem): Tone {
  if (item.kind === "plazo" && item.plazo) {
    return plazoTono(item.plazo.dias_restantes, item.plazo.estado ?? "pendiente");
  }
  return KIND_TONE[item.kind];
}

/* ── Fila de detalle (icono · label · valor), igual que la agenda ───── */
function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
        <dd className="mt-1 text-sm text-foreground">{children}</dd>
      </div>
    </div>
  );
}

/* ── Detalle inline de un movimiento (+ ir al expediente) ───────────── */
function DetalleMovimiento({
  mov,
  expedienteId,
  caratula,
}: {
  mov: Movimiento;
  expedienteId: string;
  caratula: string;
}) {
  return (
    <>
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={KIND_TONE.movimiento} dot>
            <History className="size-3" />
            {KIND_LABEL.movimiento}
          </Badge>
        </div>
        <DialogTitle className="text-xl">{mov.titulo}</DialogTitle>
      </DialogHeader>

      <dl className="space-y-3.5 py-1">
        <Row icon={CalendarDays} label="Fecha">
          {capitalizar(formatFecha(mov.fecha, "EEEE d 'de' MMMM, yyyy"))}
        </Row>
        {mov.tipo && (
          <Row icon={Tag} label="Tipo">
            {capitalizar(mov.tipo)}
          </Row>
        )}
        {mov.descripcion && (
          <Row icon={AlignLeft} label="Descripción">
            <span className="whitespace-pre-wrap">{mov.descripcion}</span>
          </Row>
        )}
        <Row icon={Inbox} label="Origen">
          {ORIGEN_LABEL[mov.origen] ?? capitalizar(mov.origen)}
        </Row>
        <Row icon={Folder} label="Expediente">
          {caratula}
        </Row>
      </dl>

      <DialogFooter className="gap-2 sm:justify-between">
        <DialogClose asChild>
          <Button variant="ghost" type="button">
            Cerrar
          </Button>
        </DialogClose>
        <Button asChild>
          <Link href={`/expedientes/${expedienteId}`}>
            Ir al expediente
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </DialogFooter>
    </>
  );
}

export function ClienteActividad({
  movimientos,
  audiencias,
  plazos,
  caratulaPorExpediente,
}: {
  movimientos: Movimiento[];
  audiencias: Audiencia[];
  plazos: PlazoDetalle[];
  /** Mapa expediente_id → carátula, para mostrar la causa en cada hito. */
  caratulaPorExpediente: Record<string, string>;
}) {
  const items = React.useMemo<TimelineItem[]>(() => {
    const lista: TimelineItem[] = [];
    const caratulaDe = (id?: string | null) =>
      (id && caratulaPorExpediente[id]) || "Causa";

    for (const m of movimientos) {
      lista.push({
        kind: "movimiento",
        id: `mov-${m.id}`,
        fecha: m.fecha,
        titulo: m.titulo,
        expedienteId: m.expediente_id,
        caratula: caratulaDe(m.expediente_id),
        movimiento: m,
      });
    }

    for (const a of audiencias) {
      const caratula = caratulaDe(a.expediente_id);
      const agendaItem: AgendaItem = {
        id: `aud-${a.id}`,
        fecha: a.fecha_hora,
        hora: a.fecha_hora,
        tipo: "audiencia",
        titulo: a.titulo,
        expedienteId: a.expediente_id,
        expediente: caratula,
        modalidadAud: a.modalidad,
        lugar: a.lugar,
        juzgado: a.juzgado,
        enlace: a.enlace,
        duracionMin: a.duracion_min,
      };
      lista.push({
        kind: "audiencia",
        id: agendaItem.id,
        fecha: a.fecha_hora,
        titulo: a.titulo,
        expedienteId: a.expediente_id,
        caratula,
        agendaItem,
      });
    }

    for (const p of plazos) {
      if (!p.fecha_vencimiento || !p.expediente_id) continue;
      const caratula = caratulaDe(p.expediente_id);
      const titulo = p.acto_procesal ?? "Plazo procesal";
      const agendaItem: AgendaItem = {
        id: `plz-${p.id ?? p.acto_procesal ?? p.fecha_vencimiento}`,
        fecha: p.fecha_vencimiento,
        tipo: "plazo",
        titulo,
        expedienteId: p.expediente_id,
        expediente: caratula,
        descripcion: p.descripcion,
        diasRestantes: p.dias_restantes,
        prioridad: p.prioridad,
        modalidadPlazo: p.modalidad,
        fuero: p.fuero,
      };
      lista.push({
        kind: "plazo",
        id: agendaItem.id,
        fecha: p.fecha_vencimiento,
        titulo,
        expedienteId: p.expediente_id,
        caratula,
        agendaItem,
        plazo: p,
      });
    }

    // Más reciente / futuro arriba.
    lista.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );
    return lista;
  }, [movimientos, audiencias, plazos, caratulaPorExpediente]);

  const [seleccionado, setSeleccionado] = React.useState<TimelineItem | null>(
    null,
  );

  if (items.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Sin actividad reciente"
        description="A medida que se carguen movimientos, audiencias y plazos en las causas de este cliente, vas a verlos acá en una sola línea de tiempo."
      />
    );
  }

  return (
    <>
      <ol className="relative space-y-1.5 pl-6">
        {/* Línea vertical */}
        <span
          aria-hidden
          className="absolute left-[5px] top-2 bottom-2 w-px bg-border"
        />
        {items.map((item) => {
          const tono = itemTone(item);
          const KindIcon = KIND_ICON[item.kind];
          return (
            <li key={item.id} className="relative">
              {/* Punto coloreado por kind/urgencia */}
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[1.4rem] top-2 size-2.5 rounded-full border-2 border-card ring-2",
                  TONE_DOT[tono],
                  TONE_RING[tono],
                )}
              />
              <button
                type="button"
                onClick={() => setSeleccionado(item)}
                className="block w-full rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <time className="text-data text-xs font-medium text-muted-foreground">
                    {capitalizar(formatFecha(item.fecha, "d MMM yyyy"))}
                  </time>
                  <Badge tone={tono}>
                    <KindIcon className="size-3" />
                    {KIND_LABEL[item.kind]}
                  </Badge>
                </div>
                <p className="mt-1 font-medium leading-snug">{item.titulo}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                  {item.caratula}
                </p>
              </button>
            </li>
          );
        })}
      </ol>

      <Dialog
        open={seleccionado !== null}
        onOpenChange={(open) => {
          if (!open) setSeleccionado(null);
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          {seleccionado &&
            (seleccionado.kind === "movimiento" && seleccionado.movimiento ? (
              <DetalleMovimiento
                mov={seleccionado.movimiento}
                expedienteId={seleccionado.expedienteId}
                caratula={seleccionado.caratula}
              />
            ) : seleccionado.agendaItem ? (
              <EventoDetalle item={seleccionado.agendaItem} />
            ) : null)}
        </DialogContent>
      </Dialog>
    </>
  );
}

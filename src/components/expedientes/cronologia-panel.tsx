"use client";

import * as React from "react";
import {
  History,
  Gavel,
  CalendarClock,
  CalendarDays,
  Clock,
  MapPin,
  Video,
  Users,
  Scale,
  AlignLeft,
  Tag,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptionBadge } from "@/components/ui/status-badge";
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
import { PlazoUrgenciaBadge, plazoTono } from "@/components/shared/plazo-badge";
import { TONE_DOT } from "@/components/agenda/tipos";
import {
  MODALIDAD_PLAZO,
  PRIORIDAD,
  type Tone,
  type Option,
} from "@/lib/constants";
import { formatFecha, formatHora, capitalizar } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Movimiento, Audiencia, PlazoDetalle } from "@/lib/types/domain";

/* ── Tipo unificado de la línea de tiempo ───────────────────────────── */
type TimelineKind = "movimiento" | "audiencia" | "plazo";

type TimelineItem = {
  kind: TimelineKind;
  id: string;
  fecha: string; // ISO. movimiento=fecha · audiencia=fecha_hora · plazo=fecha_vencimiento
  titulo: string;
  movimiento?: Movimiento;
  audiencia?: Audiencia;
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

const MODALIDAD_AUD_ICON: Record<string, LucideIcon> = {
  virtual: Video,
  remota: Video,
  videollamada: Video,
  online: Video,
  presencial: MapPin,
  hibrida: Users,
};

const ESTADO_AUDIENCIA: Record<string, { label: string; tone: Tone }> = {
  programada: { label: "Programada", tone: "info" },
  confirmada: { label: "Confirmada", tone: "primary" },
  realizada: { label: "Realizada", tone: "success" },
  suspendida: { label: "Suspendida", tone: "warning" },
  cancelada: { label: "Cancelada", tone: "muted" },
};

function opt<T extends Record<string, Option>>(
  map: T,
  key?: string | null,
): Option | null {
  if (!key) return null;
  return (map as Record<string, Option>)[key] ?? null;
}

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
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm text-foreground">{children}</dd>
      </div>
    </div>
  );
}

/* ── Popover de detalle según kind ──────────────────────────────────── */
function CronologiaDetalle({ item }: { item: TimelineItem }) {
  const KindIcon = KIND_ICON[item.kind];

  return (
    <>
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={KIND_TONE[item.kind]} dot>
            <KindIcon className="size-3" />
            {KIND_LABEL[item.kind]}
          </Badge>
          {item.kind === "plazo" && item.plazo && (
            <>
              <PlazoUrgenciaBadge
                diasRestantes={item.plazo.dias_restantes}
                estado={item.plazo.estado ?? "pendiente"}
                fechaVencimiento={item.plazo.fecha_vencimiento}
              />
              <OptionBadge option={opt(PRIORIDAD, item.plazo.prioridad)} />
            </>
          )}
          {item.kind === "audiencia" &&
            item.audiencia &&
            (() => {
              const est =
                ESTADO_AUDIENCIA[item.audiencia.estado] ?? {
                  label: capitalizar(item.audiencia.estado),
                  tone: "default" as Tone,
                };
              return <Badge tone={est.tone}>{est.label}</Badge>;
            })()}
        </div>
        <DialogTitle className="text-xl">{item.titulo}</DialogTitle>
      </DialogHeader>

      <dl className="space-y-3.5 py-1">
        {item.kind === "movimiento" && item.movimiento && (
          <DetalleMovimiento mov={item.movimiento} />
        )}
        {item.kind === "audiencia" && item.audiencia && (
          <DetalleAudiencia aud={item.audiencia} />
        )}
        {item.kind === "plazo" && item.plazo && (
          <DetallePlazo plazo={item.plazo} />
        )}
      </dl>

      <DialogFooter className="gap-2 sm:justify-between">
        <DialogClose asChild>
          <Button variant="ghost" type="button">
            Cerrar
          </Button>
        </DialogClose>
        {item.kind === "audiencia" && item.audiencia?.enlace && (
          <Button asChild variant="outline">
            <a href={item.audiencia.enlace} target="_blank" rel="noreferrer">
              <Video className="size-4" />
              Unirse
            </a>
          </Button>
        )}
      </DialogFooter>
    </>
  );
}

const ORIGEN_LABEL: Record<string, string> = {
  manual: "Carga manual",
  sac: "SAC (sincronizado)",
  sistema: "Generado por el sistema",
};

function DetalleMovimiento({ mov }: { mov: Movimiento }) {
  return (
    <>
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
    </>
  );
}

function DetalleAudiencia({ aud }: { aud: Audiencia }) {
  const modKey = aud.modalidad?.toLowerCase() ?? "";
  const ModIcon = MODALIDAD_AUD_ICON[modKey] ?? MapPin;
  return (
    <>
      <Row icon={CalendarDays} label="Fecha">
        {capitalizar(formatFecha(aud.fecha_hora, "EEEE d 'de' MMMM, yyyy"))}
      </Row>
      <Row icon={Clock} label="Hora">
        <span className="font-mono text-data">{formatHora(aud.fecha_hora)}</span>
        {aud.duracion_min ? (
          <span className="text-muted-foreground"> · {aud.duracion_min} min</span>
        ) : null}
      </Row>
      {aud.tipo && (
        <Row icon={Tag} label="Tipo">
          {capitalizar(aud.tipo)}
        </Row>
      )}
      {aud.modalidad && (
        <Row icon={ModIcon} label="Modalidad">
          {capitalizar(aud.modalidad)}
        </Row>
      )}
      {aud.lugar && (
        <Row icon={MapPin} label="Lugar">
          {aud.lugar}
        </Row>
      )}
      {aud.juzgado && (
        <Row icon={Scale} label="Juzgado">
          {aud.juzgado}
        </Row>
      )}
    </>
  );
}

function DetallePlazo({ plazo }: { plazo: PlazoDetalle }) {
  const modalidad = opt(MODALIDAD_PLAZO, plazo.modalidad);
  const prioridad = opt(PRIORIDAD, plazo.prioridad);
  return (
    <>
      <Row icon={CalendarClock} label="Vencimiento">
        {capitalizar(formatFecha(plazo.fecha_vencimiento, "EEEE d 'de' MMMM, yyyy"))}
      </Row>
      {modalidad && (
        <Row icon={CalendarClock} label="Cómputo">
          {plazo.dias != null
            ? `${plazo.dias} · ${modalidad.label.toLowerCase()}`
            : modalidad.label}
        </Row>
      )}
      {prioridad && (
        <Row icon={Tag} label="Prioridad">
          {prioridad.label}
        </Row>
      )}
      {plazo.descripcion && (
        <Row icon={AlignLeft} label="Descripción">
          <span className="whitespace-pre-wrap">{plazo.descripcion}</span>
        </Row>
      )}
    </>
  );
}

/* ── Meta de una línea (debajo del título, según kind) ──────────────── */
function lineaMeta(item: TimelineItem): string | null {
  if (item.kind === "movimiento" && item.movimiento) {
    return item.movimiento.descripcion ?? null;
  }
  if (item.kind === "audiencia" && item.audiencia) {
    const a = item.audiencia;
    const partes = [formatHora(a.fecha_hora), capitalizar(a.modalidad)];
    if (a.lugar) partes.push(a.lugar);
    return partes.filter(Boolean).join(" · ");
  }
  if (item.kind === "plazo" && item.plazo) {
    const p = item.plazo;
    const modalidad = opt(MODALIDAD_PLAZO, p.modalidad);
    if (p.dias != null && modalidad) {
      return `${p.dias} ${modalidad.label.toLowerCase()}`;
    }
    return p.descripcion ?? null;
  }
  return null;
}

/* ── Clave de mes para separadores sticky ───────────────────────────── */
function mesKey(iso: string): string {
  return formatFecha(iso, "yyyy-MM");
}

export function CronologiaPanel({
  movimientos,
  audiencias,
  plazos,
}: {
  movimientos: Movimiento[];
  audiencias: Audiencia[];
  plazos: PlazoDetalle[];
  /** Disponible para futuras acciones; hoy no se usa (ya estamos dentro del expediente). */
  expedienteId: string;
}) {
  const items = React.useMemo<TimelineItem[]>(() => {
    const lista: TimelineItem[] = [];

    for (const m of movimientos) {
      lista.push({
        kind: "movimiento",
        id: `mov-${m.id}`,
        fecha: m.fecha,
        titulo: m.titulo,
        movimiento: m,
      });
    }
    for (const a of audiencias) {
      lista.push({
        kind: "audiencia",
        id: `aud-${a.id}`,
        fecha: a.fecha_hora,
        titulo: a.titulo,
        audiencia: a,
      });
    }
    for (const p of plazos) {
      if (!p.fecha_vencimiento) continue;
      lista.push({
        kind: "plazo",
        id: `plz-${p.id ?? p.acto_procesal ?? p.fecha_vencimiento}`,
        fecha: p.fecha_vencimiento,
        titulo: p.acto_procesal ?? "Plazo procesal",
        plazo: p,
      });
    }

    // Más reciente / futuro arriba.
    lista.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );
    return lista;
  }, [movimientos, audiencias, plazos]);

  const [seleccionado, setSeleccionado] = React.useState<TimelineItem | null>(
    null,
  );

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-semibold">Cronología</h3>
          <p className="text-sm text-muted-foreground">
            {items.length}{" "}
            {items.length === 1 ? "evento en la causa" : "eventos en la causa"}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={History}
          title="Sin actividad"
          description="A medida que cargues movimientos, audiencias y plazos, vas a verlos acá en una sola línea de tiempo."
        />
      ) : (
        <ol className="relative space-y-1 pl-6">
          {/* Línea vertical */}
          <span
            aria-hidden
            className="absolute left-[5px] top-2 bottom-2 w-px bg-border"
          />
          {items.map((item, i) => {
            const tono = itemTone(item);
            const KindIcon = KIND_ICON[item.kind];
            const meta = lineaMeta(item);
            const nuevoMes = i === 0 || mesKey(item.fecha) !== mesKey(items[i - 1].fecha);
            return (
              <React.Fragment key={item.id}>
                {nuevoMes && (
                  <li
                    aria-hidden
                    className="sticky top-0 z-10 -ml-6 bg-card/95 pb-1 pt-1 backdrop-blur-sm"
                  >
                    <span className="font-display text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {capitalizar(formatFecha(item.fecha, "MMMM yyyy"))}
                    </span>
                  </li>
                )}
                <li className="relative">
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
                    className="block w-full rounded-md px-2 py-2 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <time className="text-data text-xs font-medium text-muted-foreground">
                        {capitalizar(formatFecha(item.fecha, "d MMM yyyy"))}
                      </time>
                      <Badge tone={tono} className="text-[0.7rem]">
                        <KindIcon className="size-3" />
                        {KIND_LABEL[item.kind]}
                      </Badge>
                    </div>
                    <p className="mt-0.5 font-medium leading-snug">{item.titulo}</p>
                    {meta && (
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                        {meta}
                      </p>
                    )}
                  </button>
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      )}

      <Dialog
        open={seleccionado !== null}
        onOpenChange={(open) => {
          if (!open) setSeleccionado(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          {seleccionado && <CronologiaDetalle item={seleccionado} />}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

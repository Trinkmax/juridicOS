"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { CalendarDays, List, Copy, Check, Gavel, Clock, Smartphone, Rss } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { MediaSlot } from "@/components/landing/foja";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/lib/landing/config";
import { fechaLarga, fechaCorta, capitalizar, type FueroKey } from "@/lib/landing/data";

const EASE = [0.22, 1, 0.36, 1] as const;

const FEED_URL = "https://juridicos.app/api/calendar/tu-token.ics";

type Vista = "mes" | "lista";
type TipoEvento = "audiencia" | "plazo";

type EventoDemo = {
  iso: string;
  tipo: TipoEvento;
  /** Solo para plazos: urgencia ⇒ ámbar (próximo) o tinta (con holgura). */
  proximo: boolean;
  /** Único acento rojo opcional: vence hoy. */
  hoy?: boolean;
  titulo: string;
  caratula: string;
  fuero: FueroKey;
};

/* Eventos ficticios de ejemplo (junio 2026). Carátulas inventadas para la demo. */
const EVENTOS_RAW: EventoDemo[] = [
  {
    iso: "2026-06-11",
    tipo: "plazo",
    proximo: true,
    hoy: true,
    titulo: "Vence hoy: oponer excepciones",
    caratula: "Suárez c/ Banco de Córdoba — Ejecutivo",
    fuero: "civil_comercial",
  },
  {
    iso: "2026-06-12",
    tipo: "plazo",
    proximo: true,
    hoy: false,
    titulo: "Vence: contestar demanda",
    caratula: "García c/ EPEC — Daños y perjuicios",
    fuero: "civil_comercial",
  },
  {
    iso: "2026-06-16",
    tipo: "audiencia",
    proximo: false,
    titulo: "Audiencia testimonial",
    caratula: "Pérez c/ Sancor Seguros",
    fuero: "civil_comercial",
  },
  {
    iso: "2026-06-19",
    tipo: "plazo",
    proximo: true,
    titulo: "Vence: expresar agravios",
    caratula: "Ledesma c/ Provincia ART — Laboral",
    fuero: "laboral",
  },
  {
    iso: "2026-06-25",
    tipo: "audiencia",
    proximo: false,
    titulo: "Audiencia de conciliación",
    caratula: "Romero — Alimentos",
    fuero: "familia",
  },
];

const EVENTOS: EventoDemo[] = [...EVENTOS_RAW].sort((a, b) => a.iso.localeCompare(b.iso));

const EVENTOS_POR_DIA = new Map<number, EventoDemo[]>();
for (const ev of EVENTOS) {
  const dia = Number(ev.iso.slice(8, 10));
  const arr = EVENTOS_POR_DIA.get(dia);
  if (arr) arr.push(ev);
  else EVENTOS_POR_DIA.set(dia, [ev]);
}

const DOW_HEADERS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"] as const;

/* Junio 2026: empieza lunes 1, 30 días. Semana arranca en lunes ⇒ offset 0. */
const JUNIO_DIAS = 30;
const JUNIO_OFFSET = 0; // 2026-06-01 es lunes
const HOY_DIA = 11;

/* Celdas de la grilla: nulls de relleno + días 1..30. */
const CELDAS: (number | null)[] = [
  ...Array.from({ length: JUNIO_OFFSET }, () => null),
  ...Array.from({ length: JUNIO_DIAS }, (_, i) => i + 1),
];

function leyendaUrgencia(ev: EventoDemo): React.ReactNode {
  if (ev.tipo === "audiencia") {
    return (
      <Badge tone="primary" className="font-mono text-[10px]">
        <Gavel className="size-2.5" />
        Audiencia
      </Badge>
    );
  }
  if (ev.hoy) {
    return (
      <Badge tone="destructive" className="animate-pulse-ring font-mono text-[10px]">
        <Clock className="size-2.5" />
        Vence hoy
      </Badge>
    );
  }
  if (ev.proximo) {
    return (
      <Badge tone="warning" className="font-mono text-[10px]">
        <Clock className="size-2.5" />
        Plazo próximo
      </Badge>
    );
  }
  return (
    <Badge tone="muted" className="font-mono text-[10px]">
      <Clock className="size-2.5" />
      Plazo
    </Badge>
  );
}

/** Punto/chip que marca el evento dentro de la celda del calendario. */
function PuntoEvento({ ev }: { ev: EventoDemo }) {
  const cls =
    ev.tipo === "audiencia"
      ? "bg-primary"
      : ev.hoy
        ? "bg-destructive"
        : ev.proximo
          ? "bg-warning"
          : "bg-foreground/40";
  return <span className={cn("size-1.5 rounded-full", cls)} aria-hidden />;
}

export function AgendaIcsPreview() {
  const reduce = useReducedMotion();
  const [vista, setVista] = React.useState<Vista>("mes");
  const [copiado, setCopiado] = React.useState(false);

  const copiar = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(FEED_URL);
      setCopiado(true);
      toast.success("Enlace de calendario copiado");
      window.setTimeout(() => setCopiado(false), 1800);
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      {/* ── Columna principal: agenda ─────────────────────────────────────── */}
      <div className="w-full overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm">
        {/* Cabecera tipo agenda */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Agenda del estudio · ejemplo
          </span>
          <Tabs value={vista} onValueChange={(v) => setVista(v as Vista)}>
            <TabsList className="h-8 p-0.5">
              <TabsTrigger value="mes" className="px-2.5 py-1 text-[0.8125rem]">
                <CalendarDays className="size-3.5" />
                Mes
              </TabsTrigger>
              <TabsTrigger value="lista" className="px-2.5 py-1 text-[0.8125rem]">
                <List className="size-3.5" />
                Lista
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-4 sm:p-5">
          <AnimatePresence mode="wait" initial={false}>
            {vista === "mes" ? (
              <motion.div
                key="mes"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="font-display text-lg font-semibold tracking-tight">Junio 2026</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Córdoba
                  </span>
                </div>

                {/* Encabezados de día */}
                <div className="grid grid-cols-7 gap-1">
                  {DOW_HEADERS.map((d) => (
                    <span
                      key={d}
                      className="py-1 text-center font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                {/* Grilla de días */}
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {CELDAS.map((dia, i) => {
                    if (dia === null) return <span key={`v-${i}`} aria-hidden />;
                    const evs = EVENTOS_POR_DIA.get(dia);
                    const esHoy = dia === HOY_DIA;
                    const iso = `2026-06-${String(dia).padStart(2, "0")}`;
                    const label = evs
                      ? `${fechaCorta(iso)}: ${evs.map((e) => e.titulo).join("; ")}`
                      : fechaCorta(iso);
                    return (
                      <div
                        key={dia}
                        title={label}
                        role={evs ? "img" : undefined}
                        aria-label={evs ? label : undefined}
                        className={cn(
                          "flex aspect-square flex-col items-center justify-start rounded-md border p-1",
                          esHoy
                            ? "border-primary/40 bg-primary-soft/50"
                            : evs
                              ? "border-border bg-muted/30"
                              : "border-transparent",
                        )}
                      >
                        <span
                          className={cn(
                            "text-data text-[11px] font-medium tabular-nums",
                            esHoy ? "text-primary" : "text-foreground/80",
                          )}
                        >
                          {dia}
                        </span>
                        {evs && (
                          <span className="mt-auto flex items-center gap-0.5">
                            {evs.map((ev, j) => (
                              <PuntoEvento key={j} ev={ev} />
                            ))}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Próximos eventos resumidos bajo el mes */}
                <ul className="mt-4 space-y-1.5 border-t border-border pt-3">
                  {EVENTOS.map((ev) => (
                    <li key={ev.iso} className="flex items-center gap-2 text-[11px]">
                      <PuntoEvento ev={ev} />
                      <span className="text-data w-14 shrink-0 font-mono tabular-nums text-muted-foreground">
                        {fechaCorta(ev.iso)}
                      </span>
                      <span className="truncate text-foreground/80">{ev.titulo}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.ul
                key="lista"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="divide-y divide-border"
              >
                {EVENTOS.map((ev) => (
                  <li key={ev.iso} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                    <div className="flex w-16 shrink-0 flex-col items-center rounded-md border border-border bg-muted/30 px-1 py-1">
                      <span className="text-data font-display text-lg font-bold leading-none tabular-nums">
                        {Number(ev.iso.slice(8, 10))}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                        jun
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium leading-tight">{ev.titulo}</span>
                        {leyendaUrgencia(ev)}
                      </div>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                        {ev.caratula}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                        {capitalizar(fechaLarga(ev.iso))}
                      </p>
                    </div>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* ── Bloque de suscripción ICS ─────────────────────────────────── */}
          <div className="mt-5 space-y-3 border-t border-border pt-4">
            <div className="flex items-center gap-1.5">
              <Rss className="size-3.5 text-primary" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Suscribite por ICS
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={FEED_URL}
                readOnly
                aria-label="Enlace de calendario para suscribirte"
                onFocus={(e) => e.currentTarget.select()}
                className="h-9 w-full flex-1 rounded-md border border-input bg-muted/40 px-3 font-mono text-[11px] text-muted-foreground shadow-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/25"
              />
              <button
                type="button"
                onClick={copiar}
                aria-label="Copiar enlace de calendario"
                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-input bg-card px-3 text-[0.8125rem] font-medium shadow-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                {copiado ? (
                  <Check className="size-3.5 text-foreground/70" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copiado ? "Copiado" : "Copiar"}
                <Kbd>⌘C</Kbd>
              </button>
            </div>

            {/* Logos monocromos + promesa read-only */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span className="text-foreground/70">Apple Calendar</span>
              <span className="text-border">·</span>
              <span className="text-foreground/70">Google Calendar</span>
              <span className="text-border">·</span>
              <span className="text-foreground/70">Outlook</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Feed <span className="font-medium text-foreground/80">read-only</span>: tu calendario
              lee la agenda, sin ceder tus datos ni dar permisos de escritura.
            </p>
          </div>
        </div>
      </div>

      {/* ── Columna lateral: el teléfono ──────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[14rem] lg:mx-0">
        <div className="rounded-[1.75rem] border border-border bg-card p-2 shadow-sm">
          <div className="overflow-hidden rounded-[1.25rem]">
            <MediaSlot
              src={ASSETS.agendaTelefonoSrc}
              type="imagen"
              aspect="aspect-[9/16]"
              caption="CAPTURA REAL · AGENDA EN TU TELÉFONO (LO CARGÁS VOS)"
            />
          </div>
        </div>
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <Smartphone className="size-3" />
          Suscripto una vez, vivo en tu bolsillo
        </p>
      </div>
    </div>
  );
}

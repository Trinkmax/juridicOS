"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Stamp, Clock, Info, ArrowRight } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import { PlazoUrgenciaBadge } from "@/components/shared/plazo-badge";
import { cn } from "@/lib/utils";
import {
  ACTOS,
  computarPlazoDemo,
  fechaLargaConAnio,
  fechaLarga,
  fechaCorta,
  diaNumero,
  capitalizar,
  diasRestantesDemo,
  etiquetaModalidad,
  type ActoPlazo,
} from "@/lib/landing/data";

const EASE = [0.22, 1, 0.36, 1] as const;
const FUERO_LABEL: Record<ActoPlazo["fuero"], string> = {
  civil_comercial: "Civil y Comercial",
  penal: "Penal",
  laboral: "Laboral",
  familia: "Familia",
};

// Subconjunto curado: actos frecuentes y de plazo corto, para una timeline elegante.
const ACTOS_CEDULA: ActoPlazo[] = [
  ACTOS.find((a) => a.acto === "Contestar demanda — juicio ordinario")!,
  ACTOS.find((a) => a.acto === "Apelar sentencia")!,
  ACTOS.find((a) => a.acto === "Oponer excepciones — juicio ejecutivo (citación de remate)")!,
  ACTOS.find((a) => a.acto === "Expresar agravios — apelación ordinaria")!,
  ACTOS.find((a) => a.acto === "Recurso de apelación" && a.fuero === "penal")!,
  ACTOS.find((a) => a.acto === "Recurso de casación" && a.fuero === "penal")!,
  ACTOS.find((a) => a.acto === "Ofrecer prueba para el debate")!,
  ACTOS.find((a) => a.acto === "Interponer recurso (apelación / casación) — fundado")!,
  ACTOS.find((a) => a.acto === "Comparecer y contestar demanda (audiencia de conciliación)")!,
  ACTOS.find((a) => a.acto === "Interponer y fundar recurso de apelación" && a.fuero === "familia")!,
].filter(Boolean);

const OPTIONS: ComboboxOption[] = ACTOS_CEDULA.map((a, i) => ({
  value: String(i),
  label: a.acto,
  group: FUERO_LABEL[a.fuero],
  hint: `${a.baseLegal} · ${etiquetaModalidad(a.dias, a.modalidad)}`,
}));

// "Hoy" congelado del demo (la base real para días restantes), alineado a la
// fecha de notificación por defecto y al calendario 2026 embebido.
const HOY_DEMO = "2026-06-11";

function useCountUp(target: number, reduce: boolean | null, dur = 650) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduce, dur]);
  return reduce ? target : v;
}

export function CedulaQueCalculaSola() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = React.useState(0);
  const [fecha, setFecha] = React.useState("2026-06-12");

  const acto = ACTOS_CEDULA[idx];
  const res = React.useMemo(
    () => computarPlazoDemo(fecha, acto.dias, acto.modalidad),
    [fecha, acto],
  );

  // Urgencia anclada a un "hoy" congelado del demo: así el default cae "a tiempo"
  // y el rojo+pulse-ring solo aparece si el visitante elige a mano una fecha vencida.
  const dr = diasRestantesDemo(res.vencimientoISO, HOY_DEMO);
  const vencido = dr < 0;
  const dias = useCountUp(acto.dias, reduce);

  // Clave para re-disparar animaciones del resultado en cada cambio.
  const animKey = `${idx}-${fecha}`;

  const timeline = res.timeline.slice(0, 28);
  const truncado = res.timeline.length > 28;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm">
      {/* Cabecera tipo cédula */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Cédula de notificación
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/70">EXPTE. N° 2026 · DEMO</span>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {/* Entradas: el visitante pone dos datos */}
        <div className="space-y-3">
          <label htmlFor="cedula-acto" className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Acto procesal</span>
            <Combobox
              id="cedula-acto"
              options={OPTIONS}
              value={String(idx)}
              onValueChange={(v) => v !== "" && setIdx(Number(v))}
              clearable={false}
              placeholder="Elegí un acto"
              searchPlaceholder="Buscar acto o fuero…"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Fecha de notificación</span>
            <input
              type="date"
              value={fecha}
              min="2026-01-01"
              max="2026-11-30"
              onChange={(e) => e.target.value && setFecha(e.target.value)}
              className="text-data h-10 w-full rounded-md border border-input bg-card px-3 text-sm shadow-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/25"
            />
          </label>
        </div>

        {/* Artículo del acto elegido, como sello-dato */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="muted" className="font-mono text-[10.5px]">
            {acto.baseLegal}
          </Badge>
          <Badge tone="primary" className="font-mono text-[10.5px]">
            {etiquetaModalidad(acto.dias, acto.modalidad)}
          </Badge>
        </div>

        {res.notificacionEnFeria && (
          <div className="flex items-start gap-1.5 rounded-md border border-warning/40 bg-warning-soft/50 px-2.5 py-1.5 text-[11px] text-warning-foreground dark:text-foreground">
            <Info className="mt-px size-3 shrink-0" />
            Notificación en día inhábil: el plazo arranca el primer día hábil siguiente.
          </div>
        )}

        {/* Resultado del cómputo */}
        <div
          className={cn(
            "relative rounded-lg border bg-muted/30 p-4",
            vencido ? "border-destructive/30" : "border-border",
          )}
        >
          {/* Sello de cargo (hora de gracia) */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`sello-${animKey}`}
              initial={reduce ? false : { opacity: 0, scale: 0.7, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: -4 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="absolute right-3 top-3 hidden -rotate-4 items-center gap-1 rounded-sm border border-foreground/25 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-foreground/60 sm:inline-flex"
            >
              <Stamp className="size-2.5" />
              Gracia 08–10h
            </motion.div>
          </AnimatePresence>

          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Vence el término
          </span>

          <div className="mt-1 flex items-end gap-3">
            <motion.span
              key={`venc-${animKey}`}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={cn(
                "font-display text-2xl font-semibold leading-tight tracking-tight sm:text-[1.7rem]",
                vencido && "text-destructive",
              )}
            >
              {capitalizar(fechaLargaConAnio(res.vencimientoISO))}
            </motion.span>
          </div>

          {/* Días + urgencia */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-baseline gap-1 rounded-md border border-border bg-card px-2 py-1",
                vencido && "animate-pulse-ring border-destructive/40",
              )}
            >
              <span className="text-data font-display text-lg font-bold leading-none tabular-nums">
                {dias}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {acto.modalidad === "corridos" ? "corridos" : "hábiles"}
              </span>
            </span>
            <PlazoUrgenciaBadge
              diasRestantes={dr}
              estado="pendiente"
              fechaVencimiento={res.vencimientoISO}
            />
            {res.diasInhabilesSalteados > 0 && (
              <Badge tone="muted" className="font-mono text-[10px]">
                {res.diasInhabilesSalteados} inhábiles salteados
              </Badge>
            )}
          </div>

          {/* Plazo de gracia */}
          <div className="mt-3 flex items-center gap-2 rounded-md border border-warning/40 bg-warning-soft/40 px-2.5 py-2 text-[11px] text-warning-foreground dark:text-foreground">
            <Clock className="size-3.5 shrink-0" />
            <span>
              Gracia: hasta las <span className="font-semibold">10:00 hs</span> del{" "}
              <span className="font-semibold">{capitalizar(fechaLarga(res.graciaISO))}</span>
            </span>
          </div>

          {/* Mini-timeline: prueba que el calendario está adentro */}
          <div className="mt-3.5">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Desglose · gris = no se cuenta
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {timeline.map((d, i) => (
                <span
                  key={`${animKey}-${i}`}
                  title={`${fechaCorta(d.iso)}${d.motivo ? ` — ${d.motivo}` : ""}`}
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-sm border px-1 font-mono text-[9px] tabular-nums transition-colors",
                    d.contado
                      ? "border-primary/25 bg-primary-soft text-primary"
                      : "border-transparent bg-secondary text-muted-foreground/50 line-through",
                  )}
                >
                  {diaNumero(d.iso)}
                </span>
              ))}
              {truncado && (
                <span className="flex h-5 items-center px-1 font-mono text-[9px] text-muted-foreground">
                  …
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
          <ArrowRight className="mt-0.5 size-3 shrink-0 text-primary" />
          Vos pusiste dos datos. El vencimiento, los días hábiles y el plazo de gracia los puso el
          sistema.
        </p>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { AuditBar } from "@/components/landing/foja";
import { cn } from "@/lib/utils";
import {
  ACTOS,
  FUEROS_META,
  etiquetaModalidad,
  type ActoPlazo,
  type FueroMeta,
} from "@/lib/landing/data";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Mapa rápido fuero → meta, para resolver borde-izquierdo por ficha. */
const META_POR_FUERO = new Map<FueroMeta["key"], FueroMeta>(
  FUEROS_META.map((m) => [m.key, m]),
);

export function MuroDePlazos() {
  const reduce = useReducedMotion();
  const [activo, setActivo] = React.useState<FueroMeta["key"]>("todos");

  const lista = React.useMemo<ActoPlazo[]>(
    () => (activo === "todos" ? ACTOS : ACTOS.filter((a) => a.fuero === activo)),
    [activo],
  );

  return (
    <div className="w-full space-y-4">
      {/* Pestañas por fuero — toggle con el look del foro */}
      <div
        role="group"
        aria-label="Filtrar plazos por fuero"
        className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/40 p-1"
      >
        {FUEROS_META.map((f) => {
          const seleccionado = activo === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={seleccionado}
              onClick={() => setActivo(f.key)}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:min-h-0 sm:py-1.5",
                seleccionado
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>{f.label}</span>
              <span
                className={cn(
                  "text-data font-mono text-[11px] tabular-nums",
                  seleccionado ? "text-foreground/60" : "text-muted-foreground/70",
                )}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Norma del fuero activo, como pie de índice */}
      <p className="px-0.5 font-mono text-[11px] text-muted-foreground">
        {META_POR_FUERO.get(activo)?.norma}
        <span className="text-border"> · </span>
        <span className="text-data tabular-nums">{lista.length}</span> actos en el índice
      </p>

      {/* Grilla hairline de fichas */}
      <div
        className={cn(
          "max-h-[28rem] overflow-y-auto rounded-lg border border-border bg-card no-scrollbar",
          "mask-fade-y",
        )}
      >
        <AnimatePresence mode="wait">
          <motion.ul
            key={activo}
            initial={reduce ? false : "hidden"}
            animate="show"
            exit={reduce ? undefined : { opacity: 0 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.018 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2"
          >
            {lista.map((acto) => {
              const meta = META_POR_FUERO.get(acto.fuero);
              return (
                <motion.li
                  key={`${acto.fuero}-${acto.acto}`}
                  variants={
                    reduce
                      ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                      : {
                          hidden: { opacity: 0, y: 6 },
                          show: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.28, ease: EASE },
                          },
                        }
                  }
                  className={cn(
                    "group flex flex-col gap-2 border-b border-r border-border p-3.5",
                    "border-l-2",
                    meta?.borderClass ?? "border-l-border",
                    "transition-shadow hover:z-10 hover:border-border hover:bg-muted/20 hover:shadow-sm",
                    // En 2 columnas, la última de cada fila no debe duplicar el borde derecho
                    "[&:nth-child(odd):last-child]:sm:col-span-1",
                  )}
                >
                  <p className="text-sm font-medium leading-snug text-foreground">
                    {acto.acto}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="default" className="font-mono text-[10px]">
                      {etiquetaModalidad(acto.dias, acto.modalidad)}
                    </Badge>
                    <Badge tone="muted" className="font-mono text-[10px]">
                      {acto.baseLegal}
                    </Badge>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
      </div>

      <AuditBar
        items={[
          "46/46 plazos con su artículo",
          "62 fechas del calendario judicial 2026",
          "feria · feriados · plazo de gracia 8–10 hs",
          "catálogo a validar con un profesional matriculado",
        ]}
      />
    </div>
  );
}

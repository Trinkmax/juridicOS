"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Pila de fojas grises desalineadas: al entrar al viewport se enderezan. */
type FojaApilada = {
  /** Rotación de reposo (desordenada) en grados. */
  rotate: number;
  /** Desplazamiento horizontal de reposo en px. */
  x: number;
  /** Etiqueta-dato mono (folio simulado, sin inventar nada legal). */
  folio: string;
};

const PILA: FojaApilada[] = [
  { rotate: -3, x: -6, folio: "Fs. 142" },
  { rotate: 2, x: 5, folio: "Fs. 188" },
  { rotate: -1, x: -3, folio: "Fs. 207" },
  { rotate: 3, x: 7, folio: "Fs. 231" },
  { rotate: -2, x: -5, folio: "Fs. 264" },
];

export function Considerandos() {
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-14">
      {/* ── Columna izquierda: la cita seca + kicker ───────────────────── */}
      <div className="flex flex-col gap-6">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Vistos y considerando:
        </span>
        <blockquote className="text-balance font-display text-2xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-3xl">
          El cargo cierra a las 10. La feria te corrió la cuenta. La cédula
          entró un viernes.
        </blockquote>

        {/* Pila de fojas: motivo visual del desorden que se ordena */}
        <div
          className="relative mt-2 hidden h-44 md:block"
          aria-hidden="true"
        >
          {PILA.map((f, i) => (
            <motion.div
              key={f.folio}
              initial={
                reduce
                  ? false
                  : { opacity: 0, rotate: f.rotate, x: f.x, y: 8 }
              }
              whileInView={{ opacity: 1, rotate: 0, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                ease: EASE,
                delay: reduce ? 0 : 0.12 + i * 0.07,
              }}
              style={{ top: i * 14 }}
              className={cn(
                "absolute left-0 flex h-24 w-52 flex-col justify-between rounded-md border border-border bg-card p-3 shadow-xs",
                i === PILA.length - 1 && "shadow-sm",
              )}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/70">
                Expte. · {f.folio}
              </span>
              <div className="space-y-1.5">
                <span className="block h-px w-3/4 bg-border" />
                <span className="block h-px w-full bg-border" />
                <span className="block h-px w-2/3 bg-border" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Columna derecha: el costo real, en tinta seca ──────────────── */}
      <div className="flex flex-col justify-center gap-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <p>
          Un plazo perdido no es un olvido: es perención de instancia, un
          recurso que entra tarde, un cliente que ya no vuelve. El plazo de
          gracia mal contado se paga igual.
        </p>
        <p>
          Y después está lo que no se dice en voz alta: la responsabilidad
          frente al Tribunal de Disciplina cuando el término se vence con tu
          firma adentro.
        </p>
        <p>
          Mientras tanto el estudio funciona con la memoria del titular, un
          Excel compartido que nadie actualiza igual y la esperanza de que el
          viernes no entre nada.
        </p>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView, useReducedMotion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRECIO_ARS, PRECIO_USD, LINKS } from "@/lib/landing/config";

const EASE = [0.22, 1, 0.36, 1] as const;
const arsFmt = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

const INCLUIDOS = [
  "Motor de 46 plazos procesales, cada uno con su artículo",
  "Calendario judicial de Córdoba: feria de verano e invierno, feriados y plazo de gracia 8–10 hs",
  "Redacción con Claude: generar, mejorar y completar borradores + revisión formal",
  "18 plantillas forenses con mail-merge y PDF con membrete",
  "Agenda de audiencias y plazos + feed ICS (Apple · Google · Outlook)",
  "Secreto profesional por diseño: Row-Level Security en PostgreSQL",
  "Usuarios del estudio incluidos, sin límite",
];

export function MinutaHonorarios({ session = false }: { session?: boolean }) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [moneda, setMoneda] = React.useState<"ARS" | "USD">("ARS");
  const [valor, setValor] = React.useState(0);

  React.useEffect(() => {
    if (moneda !== "ARS" || reduce || !inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValor(Math.round(PRECIO_ARS * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, moneda]);

  return (
    <div
      ref={ref}
      className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Plan único — todo incluido
        </span>
        {/* Toggle ARS / USD */}
        <div className="flex items-center gap-0.5 rounded-md border border-border bg-secondary p-0.5">
          {(["ARS", "USD"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMoneda(m)}
              className={cn(
                "rounded px-2 py-0.5 font-mono text-[10px] font-medium transition-colors",
                moneda === m
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Monto protagonista */}
        <div className="flex items-end gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={moneda}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.14, ease: EASE }}
              className="flex items-end gap-2"
            >
              <span className="pb-1.5 font-display text-2xl font-medium text-muted-foreground">$</span>
              <span className="text-data font-display text-5xl font-semibold leading-none tracking-tight tabular-nums sm:text-6xl">
                {moneda === "ARS" ? arsFmt.format(reduce ? PRECIO_ARS : valor) : PRECIO_USD}
              </span>
              <span className="pb-2 text-base font-medium text-muted-foreground">/ mes</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          {moneda === "ARS"
            ? `Plan de USD ${PRECIO_USD}/mes · en pesos al cambio de hoy`
            : `≈ $${arsFmt.format(PRECIO_ARS)} ARS al cambio de hoy`}
        </p>

        {/* Reanclaje de valor */}
        <p className="mt-4 border-l-2 border-border pl-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
          Menos que una cédula mal diligenciada. Mucho menos que un plazo perdido.
        </p>

        {/* Artículos del convenio */}
        <ul className="mt-6 space-y-2.5">
          {INCLUIDOS.map((it, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-foreground/55" strokeWidth={2.5} />
              <span className="text-foreground/90">{it}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-7 space-y-3">
          <Button asChild size="lg" className="w-full font-semibold">
            <Link href={session ? LINKS.panel : LINKS.registro}>
              {session ? "Ir a mi estudio" : "Abrir mi estudio"}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            <Link href={LINKS.demo} className="font-medium text-primary hover:underline">
              Entrar a la demo primero
            </Link>
          </p>
        </div>

        <p className="mt-6 border-t border-border pt-4 text-center font-mono text-[10px] leading-relaxed text-muted-foreground">
          Un arancel claro, como debe ser. Sin tiers, sin letra chica, sin sorpresas a fin de mes.
        </p>
      </div>
    </div>
  );
}

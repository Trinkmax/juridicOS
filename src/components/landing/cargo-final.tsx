"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sello } from "@/components/landing/foja";
import { LINKS } from "@/lib/landing/config";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CargoFinal({ session }: { session: boolean }) {
  const reduce = useReducedMotion();
  const [estampado, setEstampado] = React.useState(false);

  const ctaHref = session ? LINKS.panel : LINKS.registro;
  const ctaLabel = session ? "Ir a mi estudio" : "Abrir mi estudio";

  return (
    <section className="relative overflow-hidden border-t border-border bg-background">
      {/* Fondo de papel: grilla sutil que se desvanece en los bordes */}
      <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-edges opacity-60" />

      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center"
        >
          {/* Marco-carátula: el "0" descomunal en tinta */}
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-12">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Plazos que se te pasan
            </span>
            <div
              aria-label="Cero plazos perdidos"
              className="select-none font-display text-[7rem] font-semibold leading-none tracking-tight text-foreground sm:text-[10rem]"
            >
              0
            </div>
            <p className="mx-auto max-w-[34ch] text-balance font-mono text-[10px] leading-relaxed text-muted-foreground/80">
              así trabaja un estudio que no pierde vencimientos — demostración, no historial de uso
            </p>
          </div>

          {/* Headline editorial */}
          <h2 className="mt-10 max-w-2xl text-balance font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
            Abrí tu estudio. Que el sistema cuente los plazos.
          </h2>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <div
              className="relative"
              onMouseEnter={() => setEstampado(true)}
              onMouseLeave={() => setEstampado(false)}
              onFocus={() => setEstampado(true)}
              onBlur={() => setEstampado(false)}
            >
              <Button asChild variant="primary" size="lg">
                <Link href={ctaHref}>
                  {ctaLabel}
                  <ArrowRight />
                </Link>
              </Button>

              {/* Sello "PRESENTADO" que estampa al hover/focus del CTA primary */}
              <AnimatePresence>
                {estampado && !reduce && (
                  <motion.div
                    key="sello-presentado"
                    initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
                    animate={{ opacity: 1, scale: 1, rotate: -8 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: -12 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="pointer-events-none absolute -right-3 -top-5 z-10 sm:-right-6"
                  >
                    <Sello animate={false} className="bg-card shadow-xs">
                      Presentado
                    </Sello>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button asChild variant="outline" size="lg">
              <Link href={LINKS.demo}>Entrar a la demo</Link>
            </Button>
          </div>

          {/* Pie de foja */}
          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
            FOJA 10 · fin del expediente
          </p>
        </motion.div>
      </div>
    </section>
  );
}

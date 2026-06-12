"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type FaqItem = { q: string; a: string };

// Objeciones reales del foro de Córdoba, ancladas en hechos del producto.
const ITEMS: FaqItem[] = [
  {
    q: "¿De dónde salen los plazos y los artículos?",
    a: "Del catálogo precargado: 46 actos procesales de Córdoba, cada uno con su base legal citada (CPCC Ley 8465, CPP Ley 8123, LPT Ley 7987 y Ley 10305 de Familia). Elegís el acto y la fecha de notificación; el sistema hace el cómputo. El catálogo se valida con un abogado del foro.",
  },
  {
    q: "¿Contempla la feria y los feriados de Córdoba?",
    a: "Sí. El calendario judicial de Córdoba está cargado: la feria de enero y la de invierno, los feriados nacionales y los asuetos que decreta el TSJ, más el plazo de gracia de las 2 primeras horas hábiles (08:00 a 10:00). El cómputo saltea los días inhábiles automáticamente.",
  },
  {
    q: "¿Me reemplaza el criterio?",
    a: "No, y nunca fue la idea. La herramienta calcula, ordena y avisa; la decisión y la firma son tuyas. Todo escrito que sugiere Claude lo revisás y aprobás vos. La IA asiste, el abogado decide.",
  },
  {
    q: "¿Mis datos están aislados de otros estudios?",
    a: "Por arquitectura. Cada estudio vive aislado con Row-Level Security en PostgreSQL: ningún otro estudio puede leer ni tocar tus expedientes, ni siquiera ante un error de la aplicación. El secreto profesional está en el diseño de la base, no en una cláusula.",
  },
  {
    q: "¿Funciona en el celular?",
    a: "Sí. Entrás desde el navegador del teléfono, y además podés suscribir tu agenda de plazos y audiencias al calendario del celular por feed ICS (Apple, Google u Outlook), de solo lectura.",
  },
];

export function FaqForo() {
  const reduce = useReducedMotion();
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  const toggle = (idx: number) =>
    setOpenIdx((prev) => (prev === idx ? null : idx));

  return (
    <div className="mx-auto w-full max-w-3xl space-y-3 text-left">
      {ITEMS.map((item, idx) => {
        const isOpen = openIdx === idx;
        const panelId = `faq-foro-panel-${idx}`;
        const btnId = `faq-foro-btn-${idx}`;
        return (
          <div
            key={item.q}
            className={cn(
              "overflow-hidden rounded-lg border bg-card shadow-xs transition-colors",
              isOpen ? "border-border" : "border-border/80",
            )}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <span
                  className={cn(
                    "font-display text-[15px] font-semibold leading-snug tracking-tight transition-colors sm:text-base",
                    isOpen ? "text-foreground" : "text-foreground/90",
                  )}
                >
                  {item.q}
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180 text-foreground/70",
                  )}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.26, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="border-t border-border/50 px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

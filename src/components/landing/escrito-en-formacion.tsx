"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, CircleDashed, FileSignature, Sparkles, ScanText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/lib/landing/config";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Expediente DEMO claramente ficticio (mail-merge) ───────────────────────
 * Datos de ejemplo, NO reales. Sirven para mostrar cómo el sistema completa
 * los tokens del escrito en formación con los datos del expediente.          */
const EXPEDIENTE_DEMO = {
  parte: "Juan C. García",
  caratula: "García c/ EPEC s/ ordinario",
  juzgado: "Civil y Comercial de 12ª Nom. — Córdoba",
  sac: "2026-XXXX",
} as const;

type TokenKey = "PARTE" | "CARÁTULA" | "JUZGADO" | "N° SAC";

const TOKENS: { key: TokenKey; valor: string; mono?: boolean }[] = [
  { key: "PARTE", valor: EXPEDIENTE_DEMO.parte },
  { key: "CARÁTULA", valor: EXPEDIENTE_DEMO.caratula, mono: true },
  { key: "JUZGADO", valor: EXPEDIENTE_DEMO.juzgado },
  { key: "N° SAC", valor: EXPEDIENTE_DEMO.sac, mono: true },
];

/* ── Las 18 plantillas forenses (mostramos un subconjunto representativo) ─── */
const PLANTILLAS = [
  "Demanda ordinaria — Daños y perjuicios",
  "Contestación de demanda",
  "Interpone recurso de apelación",
  "Ofrece prueba",
  "Carta documento — intimación laboral",
  "Demanda laboral — Ordinario (LPT)",
  "Solicita embargo preventivo",
] as const;

/* ── Checklist de revisión formal (guionado, sin IA real) ───────────────── */
type RevisionEstado = "ok" | "revisar" | "manual";
const REVISION: { texto: string; estado: RevisionEstado }[] = [
  { texto: "Carátula y autos", estado: "ok" },
  { texto: "Fundamentos de derecho", estado: "ok" },
  { texto: "Petitorio", estado: "ok" },
  { texto: "Cita jurisprudencial — foja referenciada", estado: "revisar" },
  { texto: "Firma del letrado — la ponés vos", estado: "manual" },
];

/* ── Token sin completar: resaltado sutil tipo campo de mail-merge ──────── */
function Token({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-sm border border-dashed border-border bg-muted/60 px-1 py-px text-foreground/70",
        mono && "font-mono text-[0.92em]",
      )}
    >
      {children}
    </span>
  );
}

/* ── Valor recién completado: highlight bg-primary-soft que se apaga ─────── */
function ValorCompletado({
  valor,
  mono,
  reduce,
}: {
  valor: string;
  mono?: boolean;
  reduce: boolean | null;
}) {
  return (
    <motion.span
      initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
      animate={
        reduce
          ? { backgroundColor: "rgba(0,0,0,0)" }
          : {
              opacity: 1,
              filter: "blur(0px)",
              // Highlight azul que se desvanece a transparente en ~1s.
              backgroundColor: [
                "var(--color-primary-soft)",
                "var(--color-primary-soft)",
                "rgba(0,0,0,0)",
              ],
            }
      }
      transition={
        reduce
          ? { duration: 0 }
          : {
              opacity: { duration: 0.3, ease: EASE },
              filter: { duration: 0.3, ease: EASE },
              backgroundColor: { duration: 1, times: [0, 0.2, 1], ease: EASE },
            }
      }
      className={cn(
        "rounded-sm px-1 py-px font-medium text-foreground",
        mono && "font-mono text-[0.92em]",
      )}
    >
      {valor}
    </motion.span>
  );
}

export function EscritoEnFormacion() {
  const reduce = useReducedMotion();
  const [completado, setCompletado] = React.useState(false);
  const [revisionAbierta, setRevisionAbierta] = React.useState(false);

  const valor = React.useMemo(
    () => Object.fromEntries(TOKENS.map((t) => [t.key, t] as const)) as Record<
      TokenKey,
      (typeof TOKENS)[number]
    >,
    [],
  );

  // Render de un campo: token sin completar → valor con highlight.
  const campo = (key: TokenKey) => {
    const t = valor[key];
    if (!completado) return <Token mono={t.mono}>[{key}]</Token>;
    return <ValorCompletado valor={t.valor} mono={t.mono} reduce={reduce} />;
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      {/* ── Pieza central: el escrito en formación ─────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Cabecera tipo barra de documento */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <FileSignature className="size-3" />
            Escrito en formación
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/70">PDF · Ac. 1582/2019</span>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          {/* Membrete del estudio (real si existe, ejemplo si no) */}
          {ASSETS.membreteSrc ? (
            <div className="relative h-12 w-full">
              <Image
                src={ASSETS.membreteSrc}
                alt="Membrete del estudio"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-contain object-left"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
              <div className="space-y-0.5">
                <p className="font-display text-base font-semibold leading-none tracking-tight text-foreground/80">
                  Estudio Jurídico
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Abogados · Córdoba
                </p>
              </div>
              <span className="rounded-sm border border-dashed border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
                ejemplo
              </span>
            </div>
          )}

          {/* Encabezado armado por mail-merge */}
          <div className="space-y-3 font-serif text-[0.9375rem] leading-relaxed text-foreground">
            <p className="text-center text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-foreground/80">
              Se presenta. Contesta traslado.
            </p>

            <p>
              <span className="uppercase tracking-wide">Excmo. Tribunal:</span> {campo("PARTE")}, por
              derecho propio, con el patrocinio letrado que suscribe, en los autos caratulados{" "}
              <span className="italic">«{campo("CARÁTULA")}»</span>, en trámite por ante el Juzgado{" "}
              {campo("JUZGADO")}, Expte. {campo("N° SAC")}, a V.S. respetuosamente digo:
            </p>

            <p className="text-foreground/70">
              I. Que vengo en tiempo y forma a contestar el traslado conferido, conforme los
              fundamentos de hecho y de derecho que a continuación se exponen.
            </p>
          </div>

          {/* Acciones del escrito */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setCompletado(true)}
              disabled={completado}
            >
              <Sparkles className="size-3.5" />
              {completado ? "Pendientes completados" : "Completar pendientes"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRevisionAbierta((v) => !v)}
              aria-expanded={revisionAbierta}
            >
              <ScanText className="size-3.5" />
              Revisión formal
            </Button>
            {completado && (
              <Badge tone="muted" className="font-mono text-[10px]">
                Expediente demo (ficticio)
              </Badge>
            )}
          </div>

          {/* Checklist de revisión formal */}
          <AnimatePresence initial={false}>
            {revisionAbierta && (
              <motion.div
                key="revision"
                initial={reduce ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={reduce ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.32, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5 rounded-lg border border-border bg-muted/30 p-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    Revisión formal · no sustituye al criterio del letrado
                  </span>
                  <ul className="space-y-1.5">
                    {REVISION.map((r) => {
                      const ok = r.estado === "ok";
                      return (
                        <li
                          key={r.texto}
                          className="flex items-start gap-2 text-[0.8125rem] leading-snug"
                        >
                          {ok ? (
                            <Check className="mt-0.5 size-3.5 shrink-0 text-foreground/55" />
                          ) : (
                            <CircleDashed className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                          )}
                          <span className={cn(ok ? "text-foreground" : "text-muted-foreground")}>
                            {r.texto}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Columna lateral: plantillas + caveat ───────────────────────── */}
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            18 plantillas forenses
          </span>
          <div className="mask-fade-edges mt-2 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {PLANTILLAS.map((p) => (
              <Badge key={p} tone="muted" className="shrink-0 font-mono text-[10px]">
                {p}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
          El sistema arma el encabezado con los datos del expediente y revisa la forma. El fondo,
          siempre, lo escribís vos.
        </p>

        {/* Caveat de oro — siempre visible */}
        <p className="rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
          La IA asiste; el abogado decide. Todo escrito lo revisás vos.
        </p>
      </div>
    </div>
  );
}

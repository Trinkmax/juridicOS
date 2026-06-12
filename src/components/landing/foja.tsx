"use client";

import * as React from "react";
import Image from "next/image";
import { Play, ImageIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Encabezado de foja: kicker mono foliado ────────────────────────────── */
export function FojaTag({
  n,
  children,
  className,
}: {
  n: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      <span className="text-foreground/70">FOJA {n}</span>
      <span className="text-border">·</span>
      <span>{children}</span>
    </span>
  );
}

/* ── Sección "foja": wrapper editorial con margen reglamentario ─────────── */
export function Foja({
  id,
  n,
  kicker,
  title,
  intro,
  children,
  className,
  alt = false,
  innerClassName,
}: {
  id?: string;
  n: string;
  kicker: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  alt?: boolean;
  innerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 border-t border-border",
        alt ? "bg-muted/25" : "bg-background",
        className,
      )}
    >
      <div className={cn("relative mx-auto max-w-5xl px-6 py-20 sm:py-24", innerClassName)}>
        {/* Filete de margen reglamentario (alineado al borde de la columna) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-border/60 lg:block" />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="space-y-3"
        >
          <FojaTag n={n}>{kicker}</FojaTag>
          {title && (
            <h2 className="max-w-3xl text-balance font-display text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl">
              {title}
            </h2>
          )}
          {intro && (
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              {intro}
            </p>
          )}
        </motion.div>
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}

/* ── Marco-ventana: superficie enmarcada con slot honesto en la esquina ─── */
export function MarcoVentana({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border bg-card shadow-xl",
        className,
      )}
    >
      {label && (
        <span className="absolute -top-2.5 right-4 z-10 inline-flex items-center gap-1.5 rounded-sm border border-border bg-card px-2 py-0.5 font-mono text-[10px] text-muted-foreground shadow-xs">
          <Play className="size-2.5 fill-current" />
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

/* ── MediaSlot: si hay archivo lo muestra; si no, placeholder honesto ───── */
export function MediaSlot({
  src,
  type = "imagen",
  caption,
  aspect = "aspect-video",
  className,
  poster,
}: {
  src?: string | null;
  type?: "imagen" | "video";
  caption: string;
  aspect?: string;
  className?: string;
  poster?: string | null;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-muted/30",
        src ? "border-border" : "border-dashed border-border/80",
        aspect,
        className,
      )}
    >
      {src ? (
        type === "video" ? (
          <video
            src={src}
            poster={poster ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            className="size-full object-cover"
          />
        ) : (
          <Image src={src} alt={caption} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        )
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-dots p-4 text-center">
          <span className="flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
            {type === "video" ? <Play className="size-4" /> : <ImageIcon className="size-4" />}
          </span>
          <span className="max-w-[28ch] font-mono text-[10px] uppercase leading-relaxed tracking-wide text-muted-foreground">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Sello de cargo: estampa mono que aparece con scale-in ──────────────── */
export function Sello({
  children,
  className,
  animate = true,
}: {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}) {
  const content = (
    <span
      className={cn(
        "inline-flex -rotate-3 items-center gap-1.5 rounded-sm border border-foreground/30 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/70",
        className,
      )}
    >
      {children}
    </span>
  );
  if (!animate) return content;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
      viewport={{ once: true }}
      transition={{ duration: 0.18, ease: EASE }}
      className="inline-block"
    >
      {content}
    </motion.div>
  );
}

/* ── Barra de auditoría: credenciales-dato en mono separadas por · ──────── */
export function AuditBar({ items, className }: { items: string[]; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-border bg-card px-4 py-3 font-mono text-[11px] text-muted-foreground",
        className,
      )}
    >
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-border">·</span>}
          <span>{it}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

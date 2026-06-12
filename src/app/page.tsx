import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock, Server, Scale } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { FadeIn } from "@/components/motion/fade-in";
import { getSessionContext } from "@/lib/session";

import { Foja, FojaTag, MarcoVentana, MediaSlot, Sello } from "@/components/landing/foja";
import { CedulaQueCalculaSola } from "@/components/landing/cedula-calcula-sola";
import { Considerandos } from "@/components/landing/considerandos";
import { MuroDePlazos } from "@/components/landing/muro-plazos";
import { EscritoEnFormacion } from "@/components/landing/escrito-en-formacion";
import { AgendaIcsPreview } from "@/components/landing/agenda-ics-preview";
import { MinutaHonorarios } from "@/components/landing/minuta-honorarios";
import { FaqForo } from "@/components/landing/faq-foro";
import { CargoFinal } from "@/components/landing/cargo-final";
import { AtajoDemo } from "@/components/landing/atajo-demo";

import { LINKS, FUNDADOR, ASSETS } from "@/lib/landing/config";

const NAV = [
  { href: "#plazos", label: "Plazos" },
  { href: "#redaccion", label: "Redacción" },
  { href: "#agenda", label: "Agenda" },
  { href: "#seguridad", label: "Seguridad" },
  { href: "#precio", label: "Precio" },
];

const GLOSARIO = ["SAC", "traslado", "cédula", "feria", "asueto del TSJ", "plazo de gracia"];

export default async function LandingPage() {
  const session = await getSessionContext();
  const logueado = Boolean(session);

  const ctaPrincipal = logueado ? "Ir a mi estudio" : "Abrir mi estudio";
  const ctaHref = logueado ? LINKS.panel : LINKS.registro;

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground font-sans selection:bg-primary/10">
      {!logueado && <AtajoDemo />}
      {/* Decoración ambiental */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-b opacity-[0.30] dark:opacity-[0.18]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-primary/6 blur-[130px] dark:bg-primary/4 dark:blur-[150px]" />

      {/* ── Header flotante (cajetín) ─────────────────────────────────────── */}
      <header className="sticky top-4 z-50 mx-auto w-full max-w-5xl px-4">
        <div className="glass flex items-center justify-between rounded-xl border border-border/80 px-4 py-2.5 shadow-xs md:px-5">
          <Logo priority className="h-6" />

          <nav className="hidden items-center gap-5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="transition-colors hover:text-foreground">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!logueado && (
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href={LINKS.demo}>Entrar a la demo</Link>
              </Button>
            )}
            <Button asChild size="sm">
              <Link href={ctaHref} className="gap-1.5">
                {ctaPrincipal}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── FOJA 01 — Hero ─────────────────────────────────────────────── */}
        <section className="relative mx-auto max-w-5xl px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
            {/* Columna editorial */}
            <div className="relative min-w-0">
              {/* Filete de margen reglamentario */}
              <div className="pointer-events-none absolute -left-4 top-1 hidden h-full w-px bg-border/70 sm:block" />

              <FadeIn>
                <FojaTag n="01" className="text-[10px]">
                  EXPTE. N° 2026 · juridicOS · Córdoba, Capital
                </FojaTag>
              </FadeIn>

              <FadeIn delay={0.06}>
                <h1 className="mt-4 text-balance font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-5xl md:text-[3.6rem]">
                  Que no se te pase{" "}
                  <span className="text-primary">nunca más</span> un plazo.
                </h1>
              </FadeIn>

              <FadeIn delay={0.14}>
                <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  El sistema operativo de tu estudio jurídico.{" "}
                  <span className="font-medium text-foreground">
                    Vos elegís el acto y la fecha de notificación; el vencimiento y el plazo de gracia
                    los calcula el sistema
                  </span>
                  , con el calendario judicial de Córdoba adentro. 46 plazos procesales precargados,
                  cada uno con su artículo — y Claude para redactar los escritos.
                </p>
              </FadeIn>

              <FadeIn delay={0.22}>
                <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Button asChild size="lg" className="font-semibold shadow-sm">
                    <Link href={ctaHref} className="gap-2">
                      {ctaPrincipal}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="font-semibold">
                    <Link href={LINKS.demo} className="gap-2">
                      Entrar a la demo
                      <Kbd className="ml-0.5">D</Kbd>
                    </Link>
                  </Button>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-muted-foreground/90">
                  {["46 plazos", "4 fueros", "CPP 8123", "CPCC 8465", "LPT 7987", "Ley 10305"].map(
                    (t, i) => (
                      <span key={t} className="flex items-center gap-2.5">
                        {i > 0 && <span className="text-border">·</span>}
                        {t}
                      </span>
                    ),
                  )}
                </div>
              </FadeIn>
            </div>

            {/* Columna demo viva */}
            <FadeIn delay={0.4} className="w-full min-w-0">
              <div className="relative">
                <Badge
                  tone="primary"
                  className="absolute -top-3 left-4 z-10 font-mono text-[10px] shadow-xs"
                >
                  <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                  Demo en vivo · probá vos
                </Badge>
                <MarcoVentana className="p-2 sm:p-2.5">
                  {ASSETS.heroVideoSrc ? (
                    <MediaSlot
                      src={ASSETS.heroVideoSrc}
                      type="video"
                      poster={ASSETS.heroVideoPoster}
                      caption="Screencast del motor de plazos"
                    />
                  ) : (
                    <CedulaQueCalculaSola />
                  )}
                </MarcoVentana>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── FOJA 02 — El expediente que se te traspapela ───────────────── */}
        <Foja n="02" kicker="El expediente que se te traspapela" alt>
          <Considerandos />
        </Foja>

        {/* ── FOJA 03 — Motor de plazos · el muro de 46 ──────────────────── */}
        <Foja
          id="plazos"
          n="03"
          kicker="El motor de plazos"
          title="Los 46 plazos ya están adentro. Cada uno con su artículo."
          intro="Penal (25 · CPP Ley 8123) · Civil y Comercial (15 · CPCC Ley 8465) · Laboral (4 · LPT Ley 7987) · Familia (2 · Ley 10305). El motor conoce el calendario de Córdoba; vos no tenés que."
        >
          <MuroDePlazos />
        </Foja>

        {/* ── FOJA 04 — Redacción con Claude ─────────────────────────────── */}
        <Foja
          id="redaccion"
          n="04"
          kicker="Redacción con Claude"
          title="Del plazo al escrito, sin cambiar de pestaña."
          intro="Claude redacta sobre los datos de tu expediente: completa el mail-merge con el estudio y la contraparte, sugiere fundamentos y hace una revisión formal. Vos editás, firmás y presentás."
          alt
        >
          <EscritoEnFormacion />
        </Foja>

        {/* ── FOJA 05 — Agenda + feed ICS ────────────────────────────────── */}
        <Foja
          id="agenda"
          n="05"
          kicker="Agenda + calendario"
          title="Plazos y audiencias, una sola agenda. También en tu teléfono."
          intro="Todo lo que vence, en una vista de mes o lista. Y si querés, lo suscribís al calendario de tu celular por feed ICS de solo lectura, sin ceder tus datos."
        >
          <AgendaIcsPreview />
        </Foja>

        {/* ── FOJA 06 — Secreto profesional por diseño ───────────────────── */}
        <Foja
          id="seguridad"
          n="06"
          kicker="Secreto profesional"
          title="Tu expediente es tuyo. Por arquitectura, no por promesa."
          intro="Cada estudio vive aislado con Row-Level Security en PostgreSQL: ningún otro estudio puede leer ni tocar tus causas, ni siquiera ante un error de la aplicación. El secreto profesional está en el diseño de la base, no en una cláusula de términos."
          alt
        >
          <FadeIn>
            <div className="flex flex-col items-start gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground/70">
                  <ShieldCheck className="size-5" />
                </span>
                <div className="space-y-2.5">
                  <p className="max-w-md text-sm text-muted-foreground">
                    Aislamiento total entre estudios, cifrado en tránsito y en reposo, y políticas RLS
                    activas a nivel de base de datos.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Server className="size-3 text-foreground/60" /> RLS activo en PostgreSQL
                    </span>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1.5">
                      <Lock className="size-3 text-foreground/60" /> Aislamiento por estudio
                    </span>
                  </div>
                </div>
              </div>
              <Sello className="shrink-0">Secreto profesional</Sello>
            </div>
          </FadeIn>
        </Foja>

        {/* ── FOJA 07 — Hecho en Córdoba, para el foro ───────────────────── */}
        <Foja n="07" kicker="Hecho en Córdoba, para el foro">
          <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <FadeIn className="space-y-5">
              <blockquote className="text-balance font-display text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-[1.7rem]">
                “Soy abogado del foro, recibido en la UNC. Cansado de contar plazos a mano y de que la
                feria me corriera la cuenta, hice la herramienta que yo quería usar.”
              </blockquote>
              <div className="text-sm">
                {FUNDADOR.nombre !== "—" && (
                  <p className="font-semibold text-foreground">{FUNDADOR.nombre}</p>
                )}
                <p className="text-muted-foreground">{FUNDADOR.titulo}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
                <span className="text-foreground/50">Habla tu idioma:</span>
                {GLOSARIO.map((g, i) => (
                  <span key={g} className="flex items-center gap-2">
                    {i > 0 && <span className="text-border">·</span>}
                    {g}
                  </span>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <MediaSlot
                src={FUNDADOR.fotoSrc}
                type="imagen"
                aspect="aspect-[4/5]"
                caption="Retrato del fundador — lo cargás vos (4:5, b/n)"
                className="mx-auto max-w-[18rem] grayscale"
              />
            </FadeIn>
          </div>
        </Foja>

        {/* ── FOJA 08 — Minuta de honorarios (precio) ────────────────────── */}
        <Foja
          id="precio"
          n="08"
          kicker="Minuta de honorarios"
          title="Un solo arancel. Todo el expediente adentro."
          intro="Sin tiers ni comparativas. Todo lo que ves, en un solo plan."
          alt
        >
          <MinutaHonorarios session={logueado} />
        </Foja>

        {/* ── FOJA 09 — Preguntas del foro (FAQ) ─────────────────────────── */}
        <Foja n="09" kicker="Preguntas del foro" title="Lo que el foro siempre pregunta.">
          <FaqForo />
        </Foja>

        {/* ── FOJA 10 — Cargo final · el sello cero (sección propia) ─────── */}
        <CargoFinal session={logueado} />
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-muted/40 py-9">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-2">
            <Logo className="h-5" />
            <p className="flex items-center gap-1.5">
              <Scale className="size-3" /> © 2026 juridicOS · Córdoba, Argentina
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-medium">
              <a href="#plazos" className="transition-colors hover:text-foreground">Plazos</a>
              <a href="#precio" className="transition-colors hover:text-foreground">Precio</a>
              <Link href={LINKS.terminos} className="transition-colors hover:text-foreground">Términos</Link>
              <Link href={LINKS.privacidad} className="transition-colors hover:text-foreground">Privacidad</Link>
              <Link href={LINKS.contacto} className="transition-colors hover:text-foreground">Contacto</Link>
            </div>
            <p className="max-w-sm text-pretty font-mono text-[10px] leading-relaxed text-muted-foreground/80 sm:text-right">
              Los plazos del catálogo deben validarse con un profesional matriculado. La IA asiste; el
              abogado decide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  CalendarDays,
  FileText,
  Clock,
  Users,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { FadeIn } from "@/components/motion/fade-in";
import { getSessionContext } from "@/lib/session";
import {
  HeroDashboardPreview,
  CordobaCalculator,
  AiRedactionSimulator,
  ExpedientesVivosSimulator,
  EscalatedAlertsSimulator,
  TeamWorkloadSimulator,
  SecurityRlsSimulator,
  FaqAccordion,
} from "@/components/landing/interactive-sections";

export default async function LandingPage() {
  const session = await getSessionContext();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground font-sans selection:bg-primary/10">
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-b opacity-[0.35] dark:opacity-[0.2]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/6 blur-[130px] dark:bg-primary/4 dark:blur-[150px]" />

      {/* Floating Header */}
      <header className="sticky top-4 z-50 mx-auto w-full max-w-5xl px-4">
        <div className="glass flex items-center justify-between rounded-xl border border-border/80 px-4 py-3 shadow-xs md:px-6">
          <div className="flex items-center gap-3">
            <Logo priority className="h-6" />
          </div>
          
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#caracteristicas" className="transition-colors hover:text-foreground">
              Características
            </a>
            <a href="#calculador" className="transition-colors hover:text-foreground">
              Simulador de Plazos
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              Preguntas Frecuentes
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <Button asChild size="sm">
                <Link href="/dashboard" className="gap-1.5">
                  Ir al panel <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link href="/login">Ingresar</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/registro">Crear estudio</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-16 pb-20 text-center sm:pt-24 sm:pb-28">
          <FadeIn>
            <Badge tone="primary" className="mb-6 px-3 py-1 font-mono text-[11px] font-bold tracking-wide uppercase">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Pensado para estudios de Córdoba
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.08}>
            <h1 className="mx-auto max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl">
              El sistema operativo de tu{" "}
              <span className="text-primary">estudio jurídico</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Calculá plazos bajo la justicia de Córdoba, redactá escritos con IA y coordiná a todo el estudio —{" "}
              <span className="font-medium text-foreground">sin perder un solo vencimiento</span>, en una sola pantalla.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.24}>
            <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button asChild size="lg" className="w-full shadow-sm font-semibold sm:w-auto">
                <Link href={session ? "/dashboard" : "/registro"} className="gap-2">
                  {session ? "Ir a mi Panel de Control" : "Empezar gratis"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full font-semibold sm:w-auto">
                <Link href="/login">Ver demostración</Link>
              </Button>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.32}>
            <p className="mt-4 font-mono text-[11px] text-muted-foreground/80 tracking-wide">
              La mitad del tiempo de redacción · Cero plazos vencidos · Todo tu estudio coordinado
            </p>
          </FadeIn>

          {/* Interactive Hero Preview Component */}
          <FadeIn delay={0.42} className="mt-14 w-full flex justify-center">
            <HeroDashboardPreview />
          </FadeIn>
        </section>

        {/* BENTO GRID FEATURES SECTION */}
        <section id="caracteristicas" className="border-t border-border bg-muted/20 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
                El sistema operativo completo para el abogado moderno
              </h2>
              <p className="mt-4 text-muted-foreground text-sm sm:text-base text-pretty">
                Diseñado exclusivamente para responder a las exigencias procesales, automatizar tareas mecánicas y blindar el secreto profesional.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              
              {/* Tarjeta 1: Calculadora de Plazos Córdoba (Span 2) */}
              <div id="calculador" className="lg:col-span-2 rounded-lg border border-border bg-card p-6 flex flex-col justify-between hover:border-foreground/15 transition-all duration-300 shadow-xs">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-md bg-primary-soft text-primary">
                      <CalendarDays className="size-4" />
                    </div>
                    <Badge tone="primary" className="text-[10px] font-semibold">Región: Córdoba</Badge>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Motor de plazos procesales inteligente
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    Calculá plazos procesales automáticamente según la justicia de Córdoba: feria, asuetos de TSJ y el plazo de gracia nativo. Probá cambiar los valores abajo:
                  </p>
                </div>
                
                {/* Calculador interactivo */}
                <div className="mt-4 pt-2">
                  <CordobaCalculator />
                </div>
              </div>

              {/* Tarjeta 2: Redacción con IA */}
              <div className="rounded-lg border border-border bg-card p-6 flex flex-col justify-between hover:border-foreground/15 transition-all duration-300 shadow-xs">
                <div className="mb-4">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary-soft text-primary mb-3">
                    <Sparkles className="size-4" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Redacción asistida con IA
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    Generá borradores y contestaciones fundadas en doctrina, jurisprudencia y los autos cargados en el expediente. El abogado edita, firma y aprueba.
                  </p>
                </div>
                
                {/* Redactor interactivo */}
                <div className="mt-2 pt-1">
                  <AiRedactionSimulator />
                </div>
              </div>

              {/* Tarjeta 3: Sincronización de Expedientes */}
              <div className="rounded-lg border border-border bg-card p-6 flex flex-col justify-between hover:border-foreground/15 transition-all duration-300 shadow-xs">
                <div className="mb-4">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary-soft text-primary mb-3">
                    <FileText className="size-4" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Expedientes actualizados
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    Mantené sincronizadas las carátulas, juzgados, juzgadores y últimos decretos. Buscá o filtrá tu base de expedientes simulada abajo:
                  </p>
                </div>
                
                {/* Buscador de expedientes interactivo */}
                <div className="mt-2 pt-1">
                  <ExpedientesVivosSimulator />
                </div>
              </div>

              {/* Tarjeta 4: Alertas Escalonadas */}
              <div className="rounded-lg border border-border bg-card p-6 flex flex-col justify-between hover:border-foreground/15 transition-all duration-300 shadow-xs">
                <div className="mb-4">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary-soft text-primary mb-3">
                    <Clock className="size-4" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Recordatorios escalonados
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    El estudio entero recibe notificaciones críticas en tiempo real por WhatsApp, push en móvil y correo antes del vencimiento. Navegá por los hitos abajo:
                  </p>
                </div>
                
                {/* Notificaciones interactivo */}
                <div className="mt-2 pt-1">
                  <EscalatedAlertsSimulator />
                </div>
              </div>

              {/* Tarjeta 5: Coordinación de Equipo */}
              <div className="rounded-lg border border-border bg-card p-6 flex flex-col justify-between hover:border-foreground/15 transition-all duration-300 shadow-xs">
                <div className="mb-4">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary-soft text-primary mb-3">
                    <Users className="size-4" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Carga coordinada del estudio
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    Visualizá los expedientes asignados a cada integrante y equilibrá las responsabilidades del estudio. Hacé clic en (+) para simular asignación:
                  </p>
                </div>
                
                {/* Equipo interactivo */}
                <div className="mt-2 pt-1">
                  <TeamWorkloadSimulator />
                </div>
              </div>

              {/* Tarjeta 6: Seguro por Diseño (RLS) - Span completo en móvil/col en lg */}
              <div className="lg:col-span-3 rounded-lg border border-border bg-card p-6 flex flex-col lg:flex-row gap-6 justify-between hover:border-foreground/15 transition-all duration-300 shadow-xs">
                <div className="flex-1 space-y-3">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary-soft text-primary">
                    <ShieldCheck className="size-4" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Aislamiento y Secreto Profesional Seguro por Diseño
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    juridicOS cuenta con cifrado extremo y políticas Row-Level Security (RLS) en PostgreSQL, garantizando aislamiento total. Ningún estudio jurídico ajeno puede acceder bajo ninguna circunstancia a tus datos, logrando un hermetismo inquebrantable a nivel de base de datos.
                  </p>
                  <div className="flex gap-4 pt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono text-[10px]"><Zap className="size-3 text-primary" /> Cifrado SSL/TLS</span>
                    <span className="flex items-center gap-1 font-mono text-[10px]"><Lock className="size-3 text-primary" /> Políticas RLS Activas</span>
                  </div>
                </div>

                <div className="flex-1 border-t lg:border-t-0 lg:border-l border-border/70 pt-6 lg:pt-0 lg:pl-6">
                  <SecurityRlsSimulator />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* METRICS / STATS SECTION */}
        <section className="border-t border-border bg-background py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-8 sm:grid-cols-3 text-center">
              <div className="space-y-1">
                <span className="block font-display text-5xl font-bold tracking-tight text-primary sm:text-6xl">
                  0
                </span>
                <span className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                  Plazos Vencidos
                </span>
                <p className="text-xs text-muted-foreground/80 max-w-xs mx-auto">
                  Automatización total del calendario de plazos del Poder Judicial de Córdoba.
                </p>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 sm:border-x border-border/80 pt-6 sm:pt-0">
                <span className="block font-display text-5xl font-bold tracking-tight text-primary sm:text-6xl">
                  -50%
                </span>
                <span className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                  Tiempo de Redacción
                </span>
                <p className="text-xs text-muted-foreground/80 max-w-xs mx-auto">
                  Escritos y traslados generados sobre los hechos reales de tu expediente.
                </p>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 pt-6 sm:pt-0">
                <span className="block font-display text-5xl font-bold tracking-tight text-primary sm:text-6xl">
                  100%
                </span>
                <span className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                  Seguro y Aislado
                </span>
                <p className="text-xs text-muted-foreground/80 max-w-xs mx-auto">
                  Políticas Row-Level Security que garantizan blindaje de la información.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="border-t border-border bg-muted/20 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Preguntas Frecuentes
              </h2>
              <p className="mt-3 text-muted-foreground text-sm">
                Resolvé tus dudas sobre la integración, plazos procesales y la seguridad del sistema.
              </p>
            </div>
            
            <FaqAccordion />
          </div>
        </section>

        {/* CALL TO ACTION (CTA) */}
        <section className="relative border-t border-border bg-card overflow-hidden py-24 sm:py-32">
          {/* Subtle background grids */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.25] dark:opacity-[0.1]" />
          <div className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px] dark:bg-primary/4" />
          
          <div className="mx-auto max-w-3xl px-6 text-center space-y-8">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl text-balance leading-none">
              Modernizá la práctica de tu estudio jurídico hoy
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground text-sm sm:text-base leading-relaxed text-pretty">
              Automatizá el cálculo de vencimientos en Córdoba, reducí a la mitad el tiempo de redacción y coordiná a tu equipo en un entorno seguro y profesional.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto font-semibold">
                <Link href={session ? "/dashboard" : "/registro"}>
                  {session ? "Volver al panel" : "Crear mi estudio gratis"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto font-semibold">
                <Link href="/login">Acceder a la demo</Link>
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              Sin costo inicial · Sincronización SAC inmediata · Cancele cuando quiera
            </p>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-muted/40 py-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-6 px-6 sm:flex-row text-xs text-muted-foreground">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <Logo className="h-5" />
            <p className="mt-1">© {new Date().getFullYear()} juridicOS. Todos los derechos reservados.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-medium">
            <a href="#caracteristicas" className="hover:text-foreground transition-colors">Características</a>
            <a href="#calculador" className="hover:text-foreground transition-colors">Simulador de Plazos</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <span className="text-border">|</span>
            <span className="font-mono text-muted-foreground/80">Córdoba, Argentina</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

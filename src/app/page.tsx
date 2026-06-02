import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Sparkles,
  ShieldCheck,
  Users,
  FileText,
  Bell,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { FadeIn } from "@/components/motion/fade-in";
import { getSessionContext } from "@/lib/session";

const features = [
  {
    icon: CalendarClock,
    title: "Motor de plazos inteligente",
    desc: "Calcula vencimientos con el calendario judicial de Córdoba: feria, asuetos, días hábiles y plazo de gracia. Nunca más un plazo vencido.",
  },
  {
    icon: Sparkles,
    title: "Redacción con IA",
    desc: "Generá y mejorá escritos sobre los datos reales del expediente. La mitad del tiempo de redacción; el abogado siempre revisa y aprueba.",
  },
  {
    icon: Users,
    title: "Todo el estudio, una pantalla",
    desc: "Expedientes, clientes, agenda y equipo coordinados. Roles y permisos por perfil, visibilidad de la carga de trabajo y reportes.",
  },
  {
    icon: FileText,
    title: "Expedientes vivos",
    desc: "Carátula, partes, movimientos, audiencias y documentos vinculados. Buscá y filtrá por fuero, juzgado, abogado o estado.",
  },
  {
    icon: Bell,
    title: "Recordatorios escalonados",
    desc: "Avisos T-5 / T-2 / día del vencimiento por in-app, email y push. El estudio entero alineado sobre lo que vence.",
  },
  {
    icon: ShieldCheck,
    title: "Seguro por diseño",
    desc: "Aislamiento por estudio con Row Level Security, cifrado y registro de auditoría. El secreto profesional, protegido.",
  },
];

export default async function LandingPage() {
  const session = await getSessionContext();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-b opacity-[0.4]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      {/* Nav */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Logo priority />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <Button asChild size="sm">
              <Link href="/dashboard">
                Ir al panel <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">Ingresar</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/registro">Crear mi estudio</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
        <section className="flex flex-col items-center pt-16 pb-20 text-center sm:pt-24">
          <FadeIn>
            <Badge tone="primary" className="mb-6 px-3 py-1">
              <span className="size-1.5 rounded-full bg-primary" />
              Pensado para estudios de Córdoba
            </Badge>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Nunca más un <span className="text-gradient">plazo vencido</span>.
            </h1>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
              juridicOS es el sistema operativo del estudio jurídico moderno: plazos
              procesales automáticos, expedientes, agenda, redacción con IA y portal del
              cliente — todo en la nube, en una sola pantalla.
            </p>
          </FadeIn>
          <FadeIn delay={0.18}>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={session ? "/dashboard" : "/registro"}>
                  {session ? "Ir al panel" : "Empezar gratis"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Ver demo</Link>
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.24}>
            <p className="mt-4 text-xs text-muted-foreground">
              La mitad del tiempo de redacción · Cero plazos vencidos · Todo tu estudio
              coordinado
            </p>
          </FadeIn>
        </section>

        {/* Features */}
        <section className="grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={0.05 * i}>
              <div className="group h-full rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform group-hover:scale-105">
                  <f.icon className="size-5" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground sm:flex-row">
          <Logo className="h-5" />
          <p>© {new Date().getFullYear()} juridicOS · Córdoba, Argentina</p>
        </div>
      </footer>
    </div>
  );
}

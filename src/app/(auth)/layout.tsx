import Link from "next/link";
import { CalendarClock, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/app/theme-toggle";

const puntos = [
  { icon: CalendarClock, text: "Plazos procesales calculados automáticamente" },
  { icon: Sparkles, text: "Redacción de escritos asistida con IA" },
  { icon: ShieldCheck, text: "Datos aislados por estudio y cifrados" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-foreground p-12 text-background lg:flex dark:bg-card">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-[0.08]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-[480px] rounded-full bg-primary/30 blur-[120px]" />
        <Link href="/" className="relative z-10">
          <Logo forceWhite priority className="h-8" />
        </Link>
        <div className="relative z-10 space-y-8">
          <p className="max-w-md text-2xl font-medium leading-snug tracking-tight">
            “El estudio entero coordinado, los plazos bajo control y la redacción a la
            mitad de tiempo.”
          </p>
          <ul className="space-y-3">
            {puntos.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-background/80 dark:text-muted-foreground">
                <span className="flex size-8 items-center justify-center rounded-lg bg-background/10 text-primary dark:bg-primary-soft">
                  <p.icon className="size-4" />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-xs text-background/50 dark:text-muted-foreground">
          © {new Date().getFullYear()} juridicOS · Córdoba, Argentina
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col items-center justify-center px-6 py-12">
        <div className="absolute right-5 top-5 flex items-center gap-2">
          <ThemeToggle />
        </div>
        <div className="lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="mt-10 w-full max-w-sm lg:mt-0">{children}</div>
      </div>
    </div>
  );
}

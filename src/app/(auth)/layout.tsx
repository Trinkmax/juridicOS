import Link from "next/link";
import { Scale } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/app/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel — isla siempre oscura. `dark` fuerza que los tokens
          resuelvan claro-sobre-oscuro sin importar el tema de la app. */}
      <div
        className="dark relative hidden flex-col justify-between overflow-hidden p-16 lg:flex"
        style={{
          background: `
            radial-gradient(circle at 100% 0%, oklch(0.55 0.15 262 / 0.28) 0%, transparent 55%),
            radial-gradient(circle at 0% 100%, oklch(0.50 0.07 262 / 0.20) 0%, transparent 62%),
            oklch(0.165 0.012 262)
          `,
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05]" />

        {/* Top Tag */}
        <div className="relative z-10 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <Scale className="size-3.5 text-primary" />
          <span className="text-foreground/90">juridicOS</span>
          <span className="text-muted-foreground/40">·</span>
          <span>Panel interno</span>
        </div>

        {/* Center Content: Logo + Pitch */}
        <div className="relative z-10 space-y-7">
          <Link
            href="/"
            className="inline-block transition-transform duration-300 hover:scale-[1.02]"
          >
            <Logo forceWhite priority className="h-16 w-auto select-none object-contain sm:h-20" />
          </Link>

          <p className="max-w-md font-display text-xl leading-relaxed text-foreground/85">
            El sistema operativo de tu estudio jurídico.{" "}
            <span className="font-semibold text-primary underline decoration-primary/40 underline-offset-4">
              Plazos procesales
            </span>
            , expedientes, agenda y{" "}
            <span className="font-semibold text-primary underline decoration-primary/40 underline-offset-4">
              redacción con IA
            </span>{" "}
            — todo en una sola pantalla.
          </p>

          <div className="flex items-center gap-2.5 pt-2">
            <div className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Calculado para la justicia de Córdoba
            </span>
          </div>
        </div>

        {/* Bottom Footer */}
        <p className="relative z-10 font-mono text-[10px] tracking-wider text-muted-foreground/60">
          © {new Date().getFullYear()} juridicOS · Córdoba, Argentina
        </p>
      </div>

      {/* Form panel (Right Column, stays as is) */}
      <div className="relative flex flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="absolute right-5 top-5 flex items-center gap-2">
          <ThemeToggle />
        </div>
        <div className="lg:hidden mb-6">
          <Link href="/">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}

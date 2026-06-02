import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/app/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel (Left Column, styled after SHARP panel) */}
      <div
        className="relative hidden flex-col justify-between p-16 text-background lg:flex overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 100% 0%, oklch(0.455 0.155 260 / 0.25) 0%, transparent 60%),
            radial-gradient(circle at 0% 100%, oklch(0.760 0.135 75 / 0.18) 0%, transparent 65%),
            oklch(0.145 0.008 260)
          `,
        }}
      >
        {/* Top Tag */}
        <div className="relative z-10 flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-warning-foreground/90 uppercase">
          <span>⚖️</span>
          <span>juridicOS</span>
          <span className="opacity-40">·</span>
          <span className="text-muted-foreground/80">Panel Interno</span>
        </div>

        {/* Center Content: Giant Logo + Pitch */}
        <div className="relative z-10 space-y-7">
          <Link href="/" className="inline-block transition-transform duration-300 hover:scale-102">
            <Logo forceWhite priority className="h-16 sm:h-20 w-auto select-none object-contain" />
          </Link>
          
          <p className="max-w-md font-display text-xl leading-relaxed text-foreground/90">
            El sistema operativo de juridicOS.{" "}
            <span className="font-semibold text-warning-foreground underline underline-offset-4 decoration-warning-foreground/30">
              Plazos procesales
            </span>
            , expedientes, agenda y{" "}
            <span className="font-semibold text-warning-foreground underline underline-offset-4 decoration-warning-foreground/30">
              redacción con IA
            </span>{" "}
            — todo en la nube, en una sola pantalla.
          </p>

          <div className="flex items-center gap-2.5 pt-2">
            <div className="h-px w-8 bg-warning-foreground/40" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-warning-foreground/80 uppercase">
              Poder Judicial de Córdoba
            </span>
          </div>
        </div>

        {/* Bottom Footer */}
        <p className="relative z-10 font-mono text-[10px] text-muted-foreground/60 tracking-wider">
          ✨ Hecho con jurisprudencia — © {new Date().getFullYear()}
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

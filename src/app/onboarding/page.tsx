import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { logoutAction } from "@/lib/actions/auth";
import { requireSession } from "@/lib/session";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Configurá tu estudio" };

export default async function OnboardingPage() {
  const ctx = await requireSession();
  if (ctx.activeEstudio) redirect("/dashboard");

  const nombre = ctx.profile?.nombre ?? "";

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-b opacity-[0.25]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[480px] -translate-x-1/2 rounded-full bg-foreground/5 blur-[120px]" />

      <div className="absolute right-5 top-5 flex items-center gap-2">
        <ThemeToggle />
        <form action={logoutAction}>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Salir
          </button>
        </form>
      </div>

      <div className="w-full max-w-md animate-in-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="mb-6 h-8" />
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {nombre ? `Hola, ${nombre}` : "Casi listo"} 👋
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Creá tu estudio para empezar a cargar causas y controlar tus plazos.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}

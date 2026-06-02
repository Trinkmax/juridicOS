import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { requireSession } from "@/lib/session";
import { logoutAction } from "@/lib/actions/auth";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await requireSession();
  if (ctx.rol !== "cliente") redirect("/dashboard");

  const nombreEstudio = ctx.activeEstudio?.nombre;

  return (
    <div className="relative min-h-dvh bg-background bg-grid">
      {/* Velo suave para atenuar la grilla y dar aire premium */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background"
      />

      <div className="relative flex min-h-dvh flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between gap-3 px-4 sm:px-6">
            <Link
              href="/portal"
              className="flex min-w-0 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <Logo priority className="h-6" />
              {nombreEstudio && (
                <>
                  <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
                  <span className="truncate text-sm font-medium text-muted-foreground">
                    {nombreEstudio}
                  </span>
                </>
              )}
            </Link>

            <div className="flex shrink-0 items-center gap-1">
              <ThemeToggle />
              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <LogOut />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </form>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </main>

        <footer className="border-t border-border py-6">
          <div className="mx-auto w-full max-w-4xl px-4 text-center text-xs text-muted-foreground sm:px-6">
            {nombreEstudio ? `${nombreEstudio} · ` : ""}Portal de clientes · Información
            de carácter referencial.
          </div>
        </footer>
      </div>
    </div>
  );
}

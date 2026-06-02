import { redirect } from "next/navigation";
import { requireEstudio } from "@/lib/session";
import { AppSidebar } from "@/components/app/app-sidebar";
import { Topbar } from "@/components/app/topbar";
import type { Rol } from "@/lib/constants";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireEstudio();

  // Los clientes externos sólo acceden al Portal del Cliente.
  if (ctx.rol === "cliente") redirect("/portal");

  const user = {
    name:
      ctx.profile?.nombre_completo ||
      ctx.profile?.nombre ||
      ctx.email ||
      "Usuario",
    email: ctx.email,
    avatarUrl: ctx.profile?.avatar_url ?? null,
    rol: ctx.rol as Rol | null,
  };

  return (
    <div className="min-h-dvh bg-background">
      <AppSidebar estudios={ctx.estudios} active={ctx.activeEstudio} />
      <div className="flex min-h-dvh flex-col lg:pl-64">
        <Topbar user={user} estudios={ctx.estudios} active={ctx.activeEstudio} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

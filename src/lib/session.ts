import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EstudioConRol, SessionContext } from "@/lib/types/domain";

export const ESTUDIO_COOKIE = "jos_estudio";

/**
 * The single source of truth for "who is the user and which estudio are they
 * operating in". Memoized per-request via React cache().
 */
export const getSessionContext = cache(async (): Promise<SessionContext | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase.from("usuarios").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("miembros_estudio")
      .select("id, rol, ver_todas_causas, estudios(*)")
      .eq("usuario_id", user.id)
      .eq("activo", true),
  ]);

  const estudios: EstudioConRol[] = (memberships ?? [])
    .filter((m) => m.estudios)
    .map((m) => ({
      ...(m.estudios as NonNullable<typeof m.estudios>),
      rol: m.rol,
      membership_id: m.id,
      ver_todas_causas: m.ver_todas_causas,
    }));

  const cookieStore = await cookies();
  const wanted = cookieStore.get(ESTUDIO_COOKIE)?.value;
  const activeEstudio =
    estudios.find((e) => e.id === wanted) ?? estudios[0] ?? null;

  return {
    userId: user.id,
    email: user.email ?? null,
    profile: profile ?? null,
    estudios,
    activeEstudio,
    rol: activeEstudio?.rol ?? null,
  };
});

/** Require an authenticated user (→ /login). */
export async function requireSession(): Promise<SessionContext> {
  const ctx = await getSessionContext();
  if (!ctx) redirect("/login");
  return ctx;
}

export type EstudioSession = SessionContext & { activeEstudio: EstudioConRol };

/** Require an authenticated user WITH an active estudio (→ /onboarding). */
export async function requireEstudio(): Promise<EstudioSession> {
  const ctx = await requireSession();
  if (!ctx.activeEstudio) redirect("/onboarding");
  return ctx as EstudioSession;
}

export function esAdmin(rol: string | null | undefined) {
  return rol === "owner";
}
export function esStaff(rol: string | null | undefined) {
  return !!rol && rol !== "cliente";
}

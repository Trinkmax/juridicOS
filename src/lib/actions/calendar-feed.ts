"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getActionContext, type ActionResult } from "./_base";

/** Token de 256 bits, URL-safe (~43 chars). Es la credencial del feed. */
function nuevoToken(): string {
  return randomBytes(32).toString("base64url");
}

function esStaff(rol: string | null): boolean {
  return !!rol && rol !== "cliente";
}

/**
 * Crea (o asegura) el feed de calendario del usuario en el estudio activo.
 * Idempotente: si ya existe, no lo toca. El feed arranca con alcance 'estudio'.
 */
export async function generarFeed(): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };
  if (!esStaff(ctx.rol)) return { ok: false, error: "No autorizado." };

  const { data: existente } = await ctx.supabase
    .from("calendar_feeds")
    .select("id")
    .eq("estudio_id", ctx.estudioId)
    .eq("usuario_id", ctx.userId)
    .maybeSingle();

  if (existente) {
    revalidatePath("/configuracion");
    return { ok: true, message: "Tu enlace de calendario ya está listo." };
  }

  const { error } = await ctx.supabase.from("calendar_feeds").insert({
    estudio_id: ctx.estudioId,
    usuario_id: ctx.userId,
    alcance: "estudio",
    token: nuevoToken(),
    created_by: ctx.userId,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/configuracion");
  return { ok: true, message: "Enlace de calendario generado." };
}

/** Cambia qué incluye el feed: toda la agenda del estudio o solo lo asignado. */
export async function cambiarAlcanceFeed(
  alcance: "estudio" | "personal",
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };
  if (alcance !== "estudio" && alcance !== "personal")
    return { ok: false, error: "Alcance inválido." };

  const { error } = await ctx.supabase
    .from("calendar_feeds")
    .update({ alcance })
    .eq("estudio_id", ctx.estudioId)
    .eq("usuario_id", ctx.userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/configuracion");
  return {
    ok: true,
    message:
      alcance === "estudio"
        ? "Tu enlace ahora incluye toda la agenda del estudio."
        : "Tu enlace ahora incluye solo lo asignado a vos.",
  };
}

/** Rota el token: invalida el enlace anterior y genera uno nuevo. */
export async function regenerarFeed(): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };

  const { error } = await ctx.supabase
    .from("calendar_feeds")
    .update({ token: nuevoToken(), rotated_at: new Date().toISOString() })
    .eq("estudio_id", ctx.estudioId)
    .eq("usuario_id", ctx.userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/configuracion");
  return { ok: true, message: "Enlace regenerado. Volvé a suscribir tus calendarios." };
}

/** Elimina la suscripción (el enlace deja de funcionar). */
export async function desactivarFeed(): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };

  const { error } = await ctx.supabase
    .from("calendar_feeds")
    .delete()
    .eq("estudio_id", ctx.estudioId)
    .eq("usuario_id", ctx.userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/configuracion");
  return { ok: true, message: "Suscripción eliminada." };
}

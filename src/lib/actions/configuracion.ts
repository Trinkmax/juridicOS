"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActionContext, fromZod, type ActionResult } from "./_base";

const iaSchema = z.object({
  apiKey: z.string().trim().min(10, "La API key parece demasiado corta"),
  modelo: z.string().trim().optional(),
});

export type IaConfigState = ActionResult | null;

/* ───────────────────────── Membrete del estudio ───────────────────────── */

const membreteSchema = z.object({
  // Columnas de `estudios`.
  nombre: z.string().trim().min(2, "El nombre del estudio es obligatorio"),
  cuit: z.string().trim().optional().default(""),
  domicilio: z.string().trim().optional().default(""),
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  telefono: z.string().trim().optional().default(""),
  logoUrl: z
    .string()
    .trim()
    .url("La URL del logo no es válida")
    .optional()
    .or(z.literal("")),
  // Extras → `estudios.config.membrete`.
  abogado: z.string().trim().optional().default(""),
  matricula: z.string().trim().optional().default(""),
  domicilioElectronico: z.string().trim().optional().default(""),
  incluirLogo: z.coerce.boolean().optional().default(false),
});

export type MembreteState = ActionResult | null;

/**
 * Guarda el membrete profesional usado en los PDF de Redacción.
 * - Campos de texto base → columnas de `estudios`.
 * - Extras (abogado, matrícula, domicilio electrónico, incluir_logo) →
 *   `estudios.config.membrete`, mergeando sobre el JSON existente para NO pisar
 *   otras claves de configuración.
 */
export async function guardarMembrete(
  _prev: MembreteState,
  formData: FormData,
): Promise<MembreteState> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };
  if (ctx.rol !== "owner")
    return {
      ok: false,
      error: "Sólo el administrador del estudio puede editar el membrete.",
    };

  const parsed = membreteSchema.safeParse({
    nombre: formData.get("nombre"),
    cuit: formData.get("cuit"),
    domicilio: formData.get("domicilio"),
    email: formData.get("email"),
    telefono: formData.get("telefono"),
    logoUrl: formData.get("logoUrl"),
    abogado: formData.get("abogado"),
    matricula: formData.get("matricula"),
    domicilioElectronico: formData.get("domicilioElectronico"),
    incluirLogo: formData.get("incluirLogo") === "on" || formData.get("incluirLogo") === "true",
  });
  if (!parsed.success) return fromZod(parsed.error);
  const v = parsed.data;

  // Leemos el config actual para mergear sin pisar otras claves.
  const { data: actual, error: readErr } = await ctx.supabase
    .from("estudios")
    .select("config")
    .eq("id", ctx.estudioId)
    .maybeSingle();
  if (readErr) return { ok: false, error: readErr.message };

  const configActual =
    actual?.config && typeof actual.config === "object" && !Array.isArray(actual.config)
      ? (actual.config as Record<string, unknown>)
      : {};

  const nuevoConfig = {
    ...configActual,
    membrete: {
      abogado: v.abogado || undefined,
      matricula: v.matricula || undefined,
      domicilio_electronico: v.domicilioElectronico || undefined,
      incluir_logo: v.incluirLogo,
    },
  };

  const { error } = await ctx.supabase
    .from("estudios")
    .update({
      nombre: v.nombre,
      cuit: v.cuit || null,
      domicilio: v.domicilio || null,
      email: v.email || null,
      telefono: v.telefono || null,
      logo_url: v.logoUrl || null,
      config: nuevoConfig,
    })
    .eq("id", ctx.estudioId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/configuracion");
  revalidatePath("/redaccion");
  return { ok: true, message: "Membrete guardado." };
}

export async function guardarApiKeyIA(
  _prev: IaConfigState,
  formData: FormData,
): Promise<IaConfigState> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };
  if (ctx.rol !== "owner")
    return { ok: false, error: "Sólo el administrador del estudio puede configurar la IA." };

  const parsed = iaSchema.safeParse({
    apiKey: formData.get("apiKey"),
    modelo: formData.get("modelo"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { error } = await ctx.supabase.rpc("guardar_api_key_ia", {
    _estudio: ctx.estudioId,
    _key: parsed.data.apiKey,
    _modelo: parsed.data.modelo || undefined,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/configuracion");
  return { ok: true, message: "Configuración de IA guardada." };
}

export async function borrarApiKeyIA(): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };
  if (ctx.rol !== "owner") return { ok: false, error: "No autorizado." };
  const { error } = await ctx.supabase.rpc("borrar_api_key_ia", { _estudio: ctx.estudioId });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/configuracion");
  return { ok: true, message: "API key eliminada." };
}

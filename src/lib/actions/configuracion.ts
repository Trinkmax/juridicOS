"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActionContext, fromZod, type ActionResult } from "./_base";

const iaSchema = z.object({
  apiKey: z.string().trim().min(10, "La API key parece demasiado corta"),
  modelo: z.string().trim().optional(),
});

export type IaConfigState = ActionResult | null;

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

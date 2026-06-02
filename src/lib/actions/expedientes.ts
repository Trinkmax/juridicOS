"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  getActionContext,
  fromZod,
  NO_ESTUDIO,
  type ActionResult,
} from "@/lib/actions/_base";
import { expedienteSchema } from "@/lib/validations/expediente";

/**
 * Alta de expediente. En éxito redirige a su detalle.
 * (redirect() lanza internamente; no retorna en el camino feliz.)
 */
export async function crearExpediente(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = expedienteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { caracter_cliente, ...rest } = parsed.data;

  const { data, error } = await ctx.supabase
    .from("expedientes")
    .insert({
      ...rest,
      caracter_cliente: caracter_cliente ?? null,
      estudio_id: ctx.estudioId,
      created_by: ctx.userId,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/expedientes");
  redirect(`/expedientes/${data.id}`);
}

/** Edición de un expediente existente. */
export async function actualizarExpediente(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = expedienteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { caracter_cliente, ...rest } = parsed.data;

  const { error } = await ctx.supabase
    .from("expedientes")
    .update({
      ...rest,
      caracter_cliente: caracter_cliente ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/expedientes");
  revalidatePath(`/expedientes/${id}`);
  return { ok: true, data: { id }, message: "Expediente actualizado." };
}

/** Archiva un expediente (soft): archivado=true + estado="archivado". */
export async function archivarExpediente(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { error } = await ctx.supabase
    .from("expedientes")
    .update({
      archivado: true,
      estado: "archivado",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/expedientes");
  revalidatePath(`/expedientes/${id}`);
  return { ok: true, message: "Expediente archivado." };
}

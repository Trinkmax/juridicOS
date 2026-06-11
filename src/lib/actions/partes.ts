"use server";

import { revalidatePath } from "next/cache";
import {
  getActionContext,
  fromZod,
  NO_ESTUDIO,
  type ActionResult,
} from "@/lib/actions/_base";
import { parteSchema } from "@/lib/validations/expediente";

/** Agrega una parte a un expediente. */
export async function crearParte(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = parteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { error, data } = await ctx.supabase
    .from("partes")
    .insert({
      ...parsed.data,
      es_propio: parsed.data.es_propio ?? false,
      estudio_id: ctx.estudioId,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/expedientes/${parsed.data.expediente_id}`);
  return { ok: true, data: { id: data.id }, message: "Parte agregada." };
}

/** Edita una parte existente. */
export async function actualizarParte(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = parteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { expediente_id, tipo, nombre, documento, domicilio, caracter, patrocinante, es_propio } =
    parsed.data;
  const { error } = await ctx.supabase
    .from("partes")
    .update({
      tipo,
      nombre,
      documento,
      domicilio,
      caracter,
      patrocinante,
      es_propio: es_propio ?? false,
    })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/expedientes/${expediente_id}`);
  return { ok: true, data: { id }, message: "Parte actualizada." };
}

/** Elimina una parte por id. */
export async function eliminarParte(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { data, error } = await ctx.supabase
    .from("partes")
    .delete()
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId)
    .select("expediente_id")
    .maybeSingle();

  if (error) return { ok: false, error: error.message };

  if (data?.expediente_id) revalidatePath(`/expedientes/${data.expediente_id}`);
  return { ok: true, message: "Parte eliminada." };
}

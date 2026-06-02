"use server";

import { revalidatePath } from "next/cache";
import { getActionContext, fromZod, NO_ESTUDIO, type ActionResult } from "@/lib/actions/_base";
import { audienciaSchema } from "@/lib/validations/plazo";

function revalidarAgenda(expedienteId?: string) {
  revalidatePath("/agenda");
  revalidatePath("/dashboard");
  if (expedienteId) revalidatePath(`/expedientes/${expedienteId}`);
}

export async function crearAudiencia(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult<{ id: string; expediente_id: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = audienciaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const v = parsed.data;
  const { data, error } = await ctx.supabase
    .from("audiencias")
    .insert({
      estudio_id: ctx.estudioId,
      created_by: ctx.userId,
      expediente_id: v.expediente_id,
      titulo: v.titulo,
      tipo: v.tipo ?? null,
      fecha_hora: v.fecha_hora,
      duracion_min: v.duracion_min ?? 60,
      modalidad: v.modalidad,
      lugar: v.lugar ?? null,
      enlace: v.enlace ?? null,
      juzgado: v.juzgado ?? null,
      responsable_id: v.responsable_id ?? null,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  revalidarAgenda(v.expediente_id);
  return { ok: true, data: { id: data.id, expediente_id: v.expediente_id } };
}

export async function actualizarAudiencia(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult<{ id: string; expediente_id: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = audienciaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const v = parsed.data;
  const { error } = await ctx.supabase
    .from("audiencias")
    .update({
      expediente_id: v.expediente_id,
      titulo: v.titulo,
      tipo: v.tipo ?? null,
      fecha_hora: v.fecha_hora,
      duracion_min: v.duracion_min ?? 60,
      modalidad: v.modalidad,
      lugar: v.lugar ?? null,
      enlace: v.enlace ?? null,
      juzgado: v.juzgado ?? null,
      responsable_id: v.responsable_id ?? null,
    })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);
  if (error) return { ok: false, error: error.message };

  revalidarAgenda(v.expediente_id);
  return { ok: true, data: { id, expediente_id: v.expediente_id } };
}

/** Cancela una audiencia (estado = "cancelada"). */
export async function cancelarAudiencia(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { error } = await ctx.supabase
    .from("audiencias")
    .update({ estado: "cancelada" })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);
  if (error) return { ok: false, error: error.message };

  revalidarAgenda();
  return { ok: true };
}

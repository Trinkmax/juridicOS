"use server";

import { revalidatePath } from "next/cache";
import { getActionContext, fromZod, NO_ESTUDIO, type ActionResult } from "@/lib/actions/_base";
import { plazoSchema } from "@/lib/validations/plazo";

function revalidarPlazos(expedienteId?: string) {
  revalidatePath("/plazos");
  revalidatePath("/dashboard");
  revalidatePath("/agenda");
  if (expedienteId) revalidatePath(`/expedientes/${expedienteId}`);
}

/**
 * Crea un plazo. La fecha_vencimiento y el vencimiento_con_gracia los calcula
 * un TRIGGER de la base a partir de fecha_inicio_computo + dias + modalidad,
 * por eso NO los mandamos acá.
 */
export async function crearPlazo(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult<{ expediente_id: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = plazoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const v = parsed.data;
  const { error } = await ctx.supabase.from("plazos").insert({
    estudio_id: ctx.estudioId,
    created_by: ctx.userId,
    expediente_id: v.expediente_id,
    acto_procesal: v.acto_procesal,
    modalidad: v.modalidad,
    dias: v.dias,
    fecha_inicio_computo: v.fecha_inicio_computo,
    jurisdiccion: v.jurisdiccion,
    prioridad: v.prioridad,
    descripcion: v.descripcion ?? null,
    responsable_id: v.responsable_id ?? null,
    catalogo_plazo_id: v.catalogo_plazo_id ?? null,
  });
  if (error) return { ok: false, error: error.message };

  revalidarPlazos(v.expediente_id);
  return { ok: true, data: { expediente_id: v.expediente_id } };
}

/**
 * Edita un plazo. El TRIGGER recalcula fecha_vencimiento al cambiar
 * fecha_inicio_computo / dias / modalidad — por eso no los mandamos calculados.
 */
export async function actualizarPlazo(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult<{ expediente_id: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = plazoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const v = parsed.data;
  const { error } = await ctx.supabase
    .from("plazos")
    .update({
      acto_procesal: v.acto_procesal,
      modalidad: v.modalidad,
      dias: v.dias,
      fecha_inicio_computo: v.fecha_inicio_computo,
      jurisdiccion: v.jurisdiccion,
      prioridad: v.prioridad,
      descripcion: v.descripcion ?? null,
    })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);
  if (error) return { ok: false, error: error.message };

  revalidarPlazos(v.expediente_id);
  return { ok: true, data: { expediente_id: v.expediente_id }, message: "Plazo actualizado." };
}

/** Marca un plazo como cumplido (con timestamp y autor). */
export async function marcarCumplido(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { error } = await ctx.supabase
    .from("plazos")
    .update({
      estado: "cumplido",
      cumplido_at: new Date().toISOString(),
      cumplido_por: ctx.userId,
    })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);
  if (error) return { ok: false, error: error.message };

  revalidarPlazos();
  return { ok: true };
}

/** Reabre un plazo cumplido/cancelado, volviéndolo a pendiente. */
export async function reabrirPlazo(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { error } = await ctx.supabase
    .from("plazos")
    .update({ estado: "pendiente", cumplido_at: null, cumplido_por: null })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);
  if (error) return { ok: false, error: error.message };

  revalidarPlazos();
  return { ok: true };
}

/** Elimina un plazo. */
export async function eliminarPlazo(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { error } = await ctx.supabase
    .from("plazos")
    .delete()
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);
  if (error) return { ok: false, error: error.message };

  revalidarPlazos();
  return { ok: true };
}

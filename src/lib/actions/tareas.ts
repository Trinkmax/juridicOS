"use server";

import { revalidatePath } from "next/cache";
import {
  getActionContext,
  fromZod,
  NO_ESTUDIO,
  type ActionResult,
} from "@/lib/actions/_base";
import { tareaSchema } from "@/lib/validations/tarea";
import type { Database } from "@/lib/types/database";

type EstadoTarea = Database["public"]["Enums"]["estado_tarea"];

export type TareaState = ActionResult<{ id: string }> | null;

/** Alta de tarea. Devuelve el id creado para el optimistic insert. */
export async function crearTarea(
  _prev: TareaState,
  formData: FormData,
): Promise<TareaState> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = tareaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { estado, ...rest } = parsed.data;

  const { data, error } = await ctx.supabase
    .from("tareas")
    .insert({
      ...rest,
      estado,
      completada_at: estado === "completada" ? new Date().toISOString() : null,
      estudio_id: ctx.estudioId,
      created_by: ctx.userId,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/tareas");
  revalidatePath("/dashboard");
  return { ok: true, data: { id: data.id }, message: "Tarea creada." };
}

/** Edición de una tarea. El id viene en el FormData (campo oculto). */
export async function actualizarTarea(
  _prev: TareaState,
  formData: FormData,
): Promise<TareaState> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { ok: false, error: "No pudimos identificar la tarea." };
  }

  const parsed = tareaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { estado, ...rest } = parsed.data;

  const { error } = await ctx.supabase
    .from("tareas")
    .update({
      ...rest,
      estado,
      completada_at: estado === "completada" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/tareas");
  revalidatePath("/dashboard");
  return { ok: true, data: { id }, message: "Tarea actualizada." };
}

/**
 * Cambia el estado de una tarea (drag & drop / "Mover a…").
 * Setea completada_at al instante actual si pasa a "completada", sino null.
 */
export async function cambiarEstadoTarea(
  id: string,
  estado: string,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const estadoTarea = estado as EstadoTarea;

  const { error } = await ctx.supabase
    .from("tareas")
    .update({
      estado: estadoTarea,
      completada_at: estadoTarea === "completada" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/tareas");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Elimina una tarea. */
export async function eliminarTarea(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { error } = await ctx.supabase
    .from("tareas")
    .delete()
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/tareas");
  revalidatePath("/dashboard");
  return { ok: true, message: "Tarea eliminada." };
}

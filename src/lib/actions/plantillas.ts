"use server";

import { revalidatePath } from "next/cache";
import {
  getActionContext,
  fromZod,
  NO_ESTUDIO,
  type ActionResult,
} from "@/lib/actions/_base";
import { plantillaSchema } from "@/lib/validations/plantilla";

export type PlantillaState = ActionResult<{ id: string }> | null;

/** Extrae las variables {{...}} presentes en el contenido (únicas, en orden). */
function extraerVariables(contenido: string): string[] {
  const encontradas = new Set<string>();
  const re = /\{\{\s*([\w.]+)\s*\}\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(contenido)) !== null) {
    if (m[1]) encontradas.add(m[1]);
  }
  return [...encontradas];
}

/** Alta de plantilla del estudio (ámbito "estudio"). */
export async function crearPlantilla(
  _prev: PlantillaState,
  formData: FormData,
): Promise<PlantillaState> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = plantillaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { nombre, tipo, categoria, fuero, descripcion, contenido } = parsed.data;

  const { data, error } = await ctx.supabase
    .from("plantillas")
    .insert({
      nombre,
      tipo: tipo ?? null,
      categoria: categoria ?? null,
      fuero: fuero ?? null,
      descripcion: descripcion ?? null,
      contenido,
      variables: extraerVariables(contenido),
      ambito: "estudio",
      estudio_id: ctx.estudioId,
      created_by: ctx.userId,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/redaccion");
  return { ok: true, data: { id: data.id }, message: "Plantilla creada" };
}

/** Edición de plantilla del estudio. El id viene en el FormData (campo oculto). */
export async function actualizarPlantilla(
  _prev: PlantillaState,
  formData: FormData,
): Promise<PlantillaState> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { ok: false, error: "No pudimos identificar la plantilla." };
  }

  const parsed = plantillaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { nombre, tipo, categoria, fuero, descripcion, contenido } = parsed.data;

  // Solo plantillas del estudio (las globales tienen estudio_id null y son de solo lectura).
  const { error } = await ctx.supabase
    .from("plantillas")
    .update({
      nombre,
      tipo: tipo ?? null,
      categoria: categoria ?? null,
      fuero: fuero ?? null,
      descripcion: descripcion ?? null,
      contenido,
      variables: extraerVariables(contenido),
    })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/redaccion");
  return { ok: true, data: { id }, message: "Plantilla actualizada" };
}

/** Baja definitiva de una plantilla del estudio. */
export async function eliminarPlantilla(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { error } = await ctx.supabase
    .from("plantillas")
    .delete()
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/redaccion");
  return { ok: true, message: "Plantilla eliminada" };
}

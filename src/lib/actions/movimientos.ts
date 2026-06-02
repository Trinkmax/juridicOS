"use server";

import { revalidatePath } from "next/cache";
import {
  getActionContext,
  fromZod,
  NO_ESTUDIO,
  type ActionResult,
} from "@/lib/actions/_base";
import { movimientoSchema } from "@/lib/validations/expediente";

/** Registra un movimiento manual en la cronología del expediente. */
export async function crearMovimiento(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = movimientoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { error, data } = await ctx.supabase
    .from("movimientos")
    .insert({
      ...parsed.data,
      origen: "manual",
      estudio_id: ctx.estudioId,
      expediente_id: parsed.data.expediente_id,
      created_by: ctx.userId,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/expedientes/${parsed.data.expediente_id}`);
  return { ok: true, data: { id: data.id }, message: "Movimiento registrado." };
}

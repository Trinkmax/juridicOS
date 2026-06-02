"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  getActionContext,
  fromZod,
  NO_ESTUDIO,
  type ActionResult,
} from "@/lib/actions/_base";
import { clienteSchema } from "@/lib/validations/cliente";

export type ClienteState = ActionResult<{ id: string }> | null;

/** Alta de cliente. Redirige al detalle del nuevo cliente. */
export async function crearCliente(
  _prev: ClienteState,
  formData: FormData,
): Promise<ClienteState> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = clienteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { data, error } = await ctx.supabase
    .from("clientes")
    .insert({
      ...parsed.data,
      estudio_id: ctx.estudioId,
      created_by: ctx.userId,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/clientes");
  redirect(`/clientes/${data.id}`);
}

/** Edición de cliente. El id viene en el FormData (campo oculto). */
export async function actualizarCliente(
  _prev: ClienteState,
  formData: FormData,
): Promise<ClienteState> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { ok: false, error: "No pudimos identificar el cliente." };
  }

  const parsed = clienteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { error } = await ctx.supabase
    .from("clientes")
    .update(parsed.data)
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  return { ok: true, data: { id }, message: "Cliente actualizado" };
}

/** Baja lógica (soft delete) del cliente. */
export async function desactivarCliente(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { error } = await ctx.supabase
    .from("clientes")
    .update({ activo: false })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/clientes");
  return { ok: true, message: "Cliente desactivado" };
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ESTUDIO_COOKIE, getSessionContext } from "@/lib/session";
import { estudioSchema } from "@/lib/validations/estudio";
import { fromZod, type ActionResult } from "./_base";

export type EstudioState = ActionResult | null;

const COOKIE_OPTS = { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" as const };

export async function crearEstudioAction(
  _prev: EstudioState,
  formData: FormData,
): Promise<EstudioState> {
  const parsed = estudioSchema.safeParse({
    nombre: formData.get("nombre"),
    cuit: formData.get("cuit"),
    localidad: formData.get("localidad"),
    telefono: formData.get("telefono"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("crear_estudio", {
    _nombre: parsed.data.nombre,
    _cuit: parsed.data.cuit || undefined,
    _localidad: parsed.data.localidad || undefined,
    _telefono: parsed.data.telefono || undefined,
  });
  if (error) return { ok: false, error: error.message };

  const cookieStore = await cookies();
  cookieStore.set(ESTUDIO_COOKIE, data as string, COOKIE_OPTS);
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/** Switch the active estudio (multi-estudio users). */
export async function switchEstudioAction(estudioId: string) {
  const ctx = await getSessionContext();
  if (!ctx || !ctx.estudios.some((e) => e.id === estudioId)) return;
  const cookieStore = await cookies();
  cookieStore.set(ESTUDIO_COOKIE, estudioId, COOKIE_OPTS);
  revalidatePath("/", "layout");
}

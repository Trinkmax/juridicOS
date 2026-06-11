"use server";

import { revalidatePath } from "next/cache";
import {
  getActionContext,
  NO_ESTUDIO,
  fromZod,
  type ActionResult,
} from "@/lib/actions/_base";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  rolEstudioSchema,
  crearMiembroSchema,
  agregarExistenteSchema,
} from "@/lib/validations/equipo";
import type { Database } from "@/lib/types/database";

type RolEstudio = Database["public"]["Enums"]["rol_estudio"];

const SOLO_OWNER: ActionResult<never> = {
  ok: false,
  error: "Solo el socio administrador puede gestionar el equipo.",
};

/**
 * Cambia el rol de un miembro del estudio. Reservado al owner; la RLS también
 * lo exige. El owner no puede cambiarse el rol a sí mismo (se valida en la UI,
 * pero acá protegemos el caso de borde devolviendo error).
 */
export async function cambiarRol(
  miembroId: string,
  rol: string,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;
  if (ctx.rol !== "owner") return SOLO_OWNER;

  const parsed = rolEstudioSchema.safeParse(rol);
  if (!parsed.success) {
    return { ok: false, error: "El rol seleccionado no es válido." };
  }

  // No permitimos que el owner se quite a sí mismo el rol de owner.
  const { data: miembro, error: lookupError } = await ctx.supabase
    .from("miembros_estudio")
    .select("id, usuario_id, rol")
    .eq("id", miembroId)
    .eq("estudio_id", ctx.estudioId)
    .maybeSingle();

  if (lookupError) return { ok: false, error: lookupError.message };
  if (!miembro) return { ok: false, error: "No encontramos a ese miembro." };

  if (miembro.usuario_id === ctx.userId && parsed.data !== "owner") {
    return {
      ok: false,
      error: "No podés quitarte el rol de administrador a vos mismo.",
    };
  }

  const { error } = await ctx.supabase
    .from("miembros_estudio")
    .update({ rol: parsed.data as RolEstudio })
    .eq("id", miembroId)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/equipo");
  return { ok: true, message: "Rol actualizado" };
}

/**
 * Activa o desactiva (baja lógica) a un miembro del estudio. Reservado al
 * owner. El owner no puede desactivarse a sí mismo.
 */
export async function activarMiembro(
  miembroId: string,
  activo: boolean,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;
  if (ctx.rol !== "owner") return SOLO_OWNER;

  const { data: miembro, error: lookupError } = await ctx.supabase
    .from("miembros_estudio")
    .select("id, usuario_id")
    .eq("id", miembroId)
    .eq("estudio_id", ctx.estudioId)
    .maybeSingle();

  if (lookupError) return { ok: false, error: lookupError.message };
  if (!miembro) return { ok: false, error: "No encontramos a ese miembro." };

  if (miembro.usuario_id === ctx.userId && !activo) {
    return {
      ok: false,
      error: "No podés desactivar tu propio acceso al estudio.",
    };
  }

  const { error } = await ctx.supabase
    .from("miembros_estudio")
    .update({ activo })
    .eq("id", miembroId)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/equipo");
  return { ok: true, message: activo ? "Miembro activado" : "Miembro desactivado" };
}

/** Vincula un usuario al estudio (o reactiva su membresía). Usa admin client. */
async function vincularMiembro(
  admin: ReturnType<typeof createAdminClient>,
  estudioId: string,
  usuarioId: string,
  rol: RolEstudio,
  invitadoPor: string,
): Promise<ActionResult> {
  const { data: existente } = await admin
    .from("miembros_estudio")
    .select("id, activo")
    .eq("estudio_id", estudioId)
    .eq("usuario_id", usuarioId)
    .maybeSingle();

  if (existente) {
    if (existente.activo) {
      return { ok: false, error: "Esa persona ya forma parte del estudio." };
    }
    const { error } = await admin
      .from("miembros_estudio")
      .update({ activo: true, rol })
      .eq("id", existente.id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/equipo");
    return { ok: true, message: "Reactivamos a esa persona en el estudio." };
  }

  const { error } = await admin.from("miembros_estudio").insert({
    estudio_id: estudioId,
    usuario_id: usuarioId,
    rol,
    invitado_por: invitadoPor,
    activo: true,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/equipo");
  return { ok: true, message: "Miembro agregado al estudio." };
}

/**
 * Agrega un miembro al estudio. Reservado al owner (la RLS también lo exige).
 * Dos modos:
 *  - "nuevo": le crea la cuenta (email + contraseña) con el admin client.
 *  - "existente": lo busca por email (si ya tiene cuenta) y lo vincula.
 */
export async function agregarMiembro(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;
  if (ctx.rol !== "owner") return SOLO_OWNER;

  const admin = createAdminClient();
  const modo = formData.get("modo") === "existente" ? "existente" : "nuevo";

  if (modo === "existente") {
    const parsed = agregarExistenteSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fromZod(parsed.error);
    const { email, rol } = parsed.data;

    const { data: usuario, error } = await admin
      .from("usuarios")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!usuario) {
      return {
        ok: false,
        error: "No existe una cuenta con ese email.",
        fieldErrors: { email: ["Usá “Crear usuario nuevo” para darle de alta."] },
      };
    }
    return vincularMiembro(admin, ctx.estudioId, usuario.id, rol, ctx.userId);
  }

  const parsed = crearMiembroSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);
  const { nombre, apellido, email, password, rol, matricula, titulo } = parsed.data;

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre, apellido },
  });

  if (createError || !created?.user) {
    const m = (createError?.message ?? "").toLowerCase();
    if (m.includes("already") || m.includes("registered") || m.includes("exist")) {
      return {
        ok: false,
        error: "Ya existe una cuenta con ese email.",
        fieldErrors: { email: ["Usá “Ya tiene cuenta” para sumarla."] },
      };
    }
    return { ok: false, error: createError?.message ?? "No pudimos crear el usuario." };
  }

  const usuarioId = created.user.id;

  // El trigger handle_new_user crea la fila en `usuarios` desde la metadata,
  // pero no setea nombre_completo. Reforzamos el perfil completo (idempotente)
  // para que el miembro se muestre bien en producción.
  const { error: perfilError } = await admin.from("usuarios").upsert({
    id: usuarioId,
    email,
    nombre,
    apellido,
    nombre_completo: `${nombre} ${apellido}`.trim(),
    matricula,
    titulo,
  });
  if (perfilError) return { ok: false, error: perfilError.message };

  return vincularMiembro(admin, ctx.estudioId, usuarioId, rol, ctx.userId);
}

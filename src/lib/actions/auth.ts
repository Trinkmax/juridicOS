"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import type { ActionResult } from "./_base";
import { fromZod } from "./_base";

export type AuthState = ActionResult<{ needsConfirmation?: boolean }> | null;

function traducirAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email o contraseña incorrectos.";
  if (m.includes("email not confirmed")) return "Confirmá tu email antes de ingresar.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Ya existe una cuenta con ese email.";
  if (m.includes("rate limit")) return "Demasiados intentos. Probá de nuevo en unos minutos.";
  if (m.includes("password")) return "La contraseña no cumple los requisitos.";
  return "No pudimos completar la operación. Intentá nuevamente.";
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, error: traducirAuthError(error.message) };

  const next = (formData.get("next") as string) || "/dashboard";
  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    nombre: formData.get("nombre"),
    apellido: formData.get("apellido"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { nombre: parsed.data.nombre, apellido: parsed.data.apellido } },
  });
  if (error) return { ok: false, error: traducirAuthError(error.message) };

  if (!data.session) {
    return { ok: true, data: { needsConfirmation: true } };
  }
  revalidatePath("/", "layout");
  redirect("/onboarding");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// Credenciales de la cuenta de demostración (sembrada en la migración de seed).
// No se exportan: en un módulo "use server" sólo pueden exportarse funciones async.
const DEMO_EMAIL = "demo@juridicos.app";
const DEMO_PASSWORD = "demo1234";

export async function demoLoginAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });
  if (error) redirect("/login?error=demo");
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

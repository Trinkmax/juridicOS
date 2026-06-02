import "server-only";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/lib/session";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

export type ActionResult<T = unknown> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

export type ActionContext = {
  supabase: SupabaseClient<Database>;
  userId: string;
  estudioId: string;
  rol: Database["public"]["Enums"]["rol_estudio"] | null;
};

/**
 * Resolve the authenticated context for a mutation. Returns null when the user
 * is unauthenticated or has no active estudio — actions should fail closed.
 */
export async function getActionContext(): Promise<ActionContext | null> {
  const ctx = await getSessionContext();
  if (!ctx || !ctx.activeEstudio) return null;
  const supabase = await createClient();
  return {
    supabase,
    userId: ctx.userId,
    estudioId: ctx.activeEstudio.id,
    rol: ctx.rol,
  };
}

export function fromZod(error: z.ZodError): ActionResult<never> {
  return {
    ok: false,
    error: "Revisá los campos marcados.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

export const NO_ESTUDIO: ActionResult<never> = {
  ok: false,
  error: "Tu sesión expiró o no tenés un estudio activo.",
};

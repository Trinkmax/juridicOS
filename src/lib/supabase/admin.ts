import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/**
 * Cliente Supabase con `service_role`. SOLO para servidor (server actions /
 * route handlers) y SIEMPRE detrás de una verificación de permisos (p. ej.
 * owner). Bypassa RLS: nunca lo importes desde un componente cliente ni
 * expongas la key. El import "server-only" impide que entre al bundle del cliente.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

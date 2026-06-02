"use server";

import { getActionContext } from "./_base";
import type { Recordatorio } from "@/lib/types/domain";

export async function getNotificaciones(): Promise<{
  items: Recordatorio[];
  noLeidas: number;
}> {
  const ctx = await getActionContext();
  if (!ctx) return { items: [], noLeidas: 0 };
  const { data } = await ctx.supabase
    .from("recordatorios")
    .select("*")
    .eq("destinatario_id", ctx.userId)
    .order("momento", { ascending: true })
    .limit(30);
  const items = (data ?? []) as Recordatorio[];
  return { items, noLeidas: items.filter((r) => !r.leido).length };
}

export async function marcarLeida(id: string) {
  const ctx = await getActionContext();
  if (!ctx) return;
  await ctx.supabase
    .from("recordatorios")
    .update({ leido: true })
    .eq("id", id)
    .eq("destinatario_id", ctx.userId);
}

export async function marcarTodasLeidas() {
  const ctx = await getActionContext();
  if (!ctx) return;
  await ctx.supabase
    .from("recordatorios")
    .update({ leido: true })
    .eq("destinatario_id", ctx.userId)
    .eq("leido", false);
}

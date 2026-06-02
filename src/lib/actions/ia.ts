"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { getActionContext, type ActionResult } from "./_base";
import { redactar, iaDisponible, IA_MODEL } from "@/lib/ai/claude";
import { formatFechaCorta } from "@/lib/format";

const SYSTEM_REDACCION = `Sos un asistente de redacción jurídica para un estudio de abogados de Córdoba, Argentina. Redactás escritos y documentos legales en ESPAÑOL rioplatense, con registro formal forense.

Reglas:
- Usá la terminología y estructura procesal argentina (Córdoba).
- NUNCA inventes hechos, fechas, montos, nombres ni datos que no estén en el contexto. Si falta un dato, dejá un marcador entre corchetes (p. ej. [FECHA], [MONTO], [DETALLAR HECHOS]).
- No inventes jurisprudencia, números de fallos ni citas. Citá normas sólo si son pertinentes y de uso común.
- El resultado es un BORRADOR para que el abogado revise y apruebe; no constituye asesoramiento jurídico definitivo.
- Devolvé únicamente el texto del documento, sin comentarios ni explicaciones meta.`;

const SYSTEM_RESUMEN = `Sos un asistente que resume expedientes judiciales para abogados de Córdoba, Argentina, en ESPAÑOL. Producí un resumen claro y conciso (TL;DR) del estado de la causa: partes, objeto, etapa procesal, últimos movimientos, próximos vencimientos y qué resta hacer. No inventes información que no esté en el contexto. Usá viñetas cuando ayude a la claridad.`;

async function construirContexto(
  supabase: SupabaseClient<Database>,
  estudioId: string,
  expedienteId: string,
): Promise<string> {
  const { data: exp } = await supabase
    .from("expedientes")
    .select("*, clientes(nombre, documento)")
    .eq("id", expedienteId)
    .eq("estudio_id", estudioId)
    .maybeSingle();
  if (!exp) return "";

  const [{ data: partes }, { data: movimientos }, { data: plazos }] = await Promise.all([
    supabase.from("partes").select("tipo, nombre, caracter").eq("expediente_id", expedienteId),
    supabase
      .from("movimientos")
      .select("fecha, titulo, descripcion")
      .eq("expediente_id", expedienteId)
      .order("fecha", { ascending: false })
      .limit(15),
    supabase
      .from("v_plazos_detalle")
      .select("acto_procesal, fecha_vencimiento, estado")
      .eq("expediente_id", expedienteId)
      .order("fecha_vencimiento", { ascending: true }),
  ]);

  const cliente = exp.clientes as { nombre: string; documento: string | null } | null;
  const lineas: string[] = [
    `Carátula: ${exp.caratula}`,
    exp.nro_sac ? `Nº SAC: ${exp.nro_sac}` : "",
    `Fuero: ${exp.fuero} · Estado: ${exp.estado}${exp.etapa ? ` · Etapa: ${exp.etapa}` : ""}`,
    exp.juzgado ? `Juzgado: ${exp.juzgado}${exp.secretaria ? ` (${exp.secretaria})` : ""}` : "",
    cliente ? `Cliente: ${cliente.nombre}${cliente.documento ? ` (${cliente.documento})` : ""}` : "",
    exp.observaciones ? `Observaciones: ${exp.observaciones}` : "",
  ].filter(Boolean);

  if (partes?.length) {
    lineas.push("", "Partes:");
    for (const p of partes) lineas.push(`- ${p.tipo}: ${p.nombre}${p.caracter ? ` (${p.caracter})` : ""}`);
  }
  if (movimientos?.length) {
    lineas.push("", "Movimientos recientes:");
    for (const m of movimientos)
      lineas.push(`- ${formatFechaCorta(m.fecha)}: ${m.titulo}${m.descripcion ? ` — ${m.descripcion}` : ""}`);
  }
  if (plazos?.length) {
    lineas.push("", "Plazos:");
    for (const pl of plazos)
      lineas.push(
        `- ${pl.acto_procesal}: vence ${formatFechaCorta(pl.fecha_vencimiento)} (${pl.estado})`,
      );
  }
  return lineas.join("\n");
}

async function logIA(
  supabase: SupabaseClient<Database>,
  estudioId: string,
  userId: string,
  feature: string,
  uso: { tokens_in: number; tokens_out: number; costo_usd: number },
) {
  await supabase.from("ai_interactions").insert({
    estudio_id: estudioId,
    usuario_id: userId,
    feature,
    modelo: IA_MODEL,
    tokens_in: uso.tokens_in,
    tokens_out: uso.tokens_out,
    costo_usd: uso.costo_usd,
  });
}

const SIN_IA: ActionResult<never> = {
  ok: false,
  error: "La IA no está configurada. Definí ANTHROPIC_API_KEY en el entorno del servidor.",
};

export async function asistirRedaccion(input: {
  modo: "generar" | "mejorar";
  instruccion: string;
  textoActual?: string;
  expedienteId?: string | null;
}): Promise<ActionResult<{ texto: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };
  if (!iaDisponible()) return SIN_IA;

  const contexto = input.expedienteId
    ? await construirContexto(ctx.supabase, ctx.estudioId, input.expedienteId)
    : "";

  const instruccion =
    input.modo === "mejorar"
      ? `Mejorá, corregí y completá el siguiente borrador según esta indicación: ${input.instruccion}\n\nBORRADOR ACTUAL:\n${input.textoActual ?? ""}`
      : input.instruccion;

  try {
    const { texto, uso } = await redactar({
      system: SYSTEM_REDACCION,
      contexto,
      instruccion,
      maxTokens: 6000,
    });
    await logIA(
      ctx.supabase,
      ctx.estudioId,
      ctx.userId,
      input.modo === "mejorar" ? "redaccion_mejorar" : "redaccion_generar",
      uso,
    );
    return { ok: true, data: { texto } };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return {
      ok: false,
      error: msg === "IA_NO_CONFIGURADA" ? SIN_IA.error : "No pudimos generar el texto. Probá nuevamente.",
    };
  }
}

export async function resumirExpediente(
  expedienteId: string,
): Promise<ActionResult<{ resumen: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };
  if (!iaDisponible()) return SIN_IA;

  const contexto = await construirContexto(ctx.supabase, ctx.estudioId, expedienteId);
  if (!contexto) return { ok: false, error: "No encontramos el expediente." };

  try {
    const { texto, uso } = await redactar({
      system: SYSTEM_RESUMEN,
      contexto,
      instruccion: "Resumí el estado de esta causa.",
      maxTokens: 1500,
    });
    await logIA(ctx.supabase, ctx.estudioId, ctx.userId, "resumen_expediente", uso);
    return { ok: true, data: { resumen: texto } };
  } catch {
    return { ok: false, error: "No pudimos generar el resumen." };
  }
}

/** Persistir un escrito (borrador) generado/editado. */
export async function guardarDocumentoGenerado(input: {
  id?: string;
  titulo: string;
  contenido: string;
  tipo?: string | null;
  expedienteId?: string | null;
  plantillaId?: string | null;
  generadoPorIa?: boolean;
}): Promise<ActionResult<{ id: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };

  if (input.id) {
    const { error } = await ctx.supabase
      .from("documentos_generados")
      .update({
        titulo: input.titulo,
        contenido: input.contenido,
        tipo: input.tipo ?? null,
      })
      .eq("id", input.id)
      .eq("estudio_id", ctx.estudioId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/documentos");
    return { ok: true, data: { id: input.id } };
  }

  const { data, error } = await ctx.supabase
    .from("documentos_generados")
    .insert({
      estudio_id: ctx.estudioId,
      titulo: input.titulo,
      contenido: input.contenido,
      tipo: input.tipo ?? null,
      expediente_id: input.expedienteId ?? null,
      plantilla_id: input.plantillaId ?? null,
      generado_por_ia: input.generadoPorIa ?? false,
      created_by: ctx.userId,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/documentos");
  return { ok: true, data: { id: data.id } };
}

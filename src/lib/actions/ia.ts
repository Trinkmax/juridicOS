"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/server";
import { getActionContext, type ActionResult } from "./_base";
import {
  redactar,
  extraer,
  iaKeyGlobal,
  modeloGlobal,
  IA_MODEL_DEFAULT,
} from "@/lib/ai/claude";
import { formatFechaCorta } from "@/lib/format";

type DB = SupabaseClient<Database>;

/* ── Resolución de la config de IA por estudio (key propia + fallback env) ── */
type ConfigIA = { apiKey: string; modelo: string };

async function resolverIA(supabase: DB, estudioId: string): Promise<ConfigIA | null> {
  const { data } = await supabase.rpc("obtener_api_key_ia", { _estudio: estudioId });
  const row = Array.isArray(data) ? data[0] : null;
  if (row?.api_key) {
    return { apiKey: row.api_key as string, modelo: (row.modelo as string) || IA_MODEL_DEFAULT };
  }
  const k = iaKeyGlobal();
  if (k) return { apiKey: k, modelo: modeloGlobal() };
  return null;
}

/** ¿El estudio tiene IA disponible (key propia o global)? Para banners en RSC. */
export async function iaActivaEstudio(estudioId: string): Promise<boolean> {
  const supabase = await createClient();
  return (await resolverIA(supabase, estudioId)) !== null;
}

const SIN_IA = {
  ok: false as const,
  error:
    "La IA no está configurada. Pedile al administrador que cargue la API key de IA en Configuración.",
};

const SYSTEM_REDACCION = `Sos un asistente de redacción jurídica para un estudio de abogados de Córdoba, Argentina (abogado litigante formado en la UNC). Redactás escritos judiciales y documentos legales en ESPAÑOL rioplatense, con registro formal forense, listos para revisar y presentar por el SAC.

ESTRUCTURA FORENSE (Córdoba). Cuando redactes un escrito judicial, seguí la estructura real de presentación:
- Título del escrito en MAYÚSCULAS (p. ej. "PROMUEVE DEMANDA LABORAL", "CONTESTA DEMANDA", "SOLICITA PRÓRROGA").
- Comparecencia: en demandas, los datos completos del compareciente (nombre, DNI, domicilio real, patrocinio o apoderamiento con M.P., domicilio procesal constituido y domicilio electrónico), cerrando con "comparezco ante V.S. y digo:". En escritos dentro de un expediente, la fórmula abreviada con la carátula y el tribunal.
- Secciones con numeración romana y título en MAYÚSCULAS: "I. OBJETO.", "II. HECHOS.", y según el caso RUBROS RECLAMADOS, PRUEBA (con acápites: DOCUMENTAL, INFORMATIVA, CONFESIONAL, TESTIMONIAL, PERICIAL, EXHIBICIÓN), DERECHO, RESERVA DEL CASO FEDERAL, PETITUM.
- En el OBJETO, la fórmula de estilo: "Que vengo por la presente a..." con el monto "o lo que en más o en menos resulte de la prueba a rendir", intereses y costas cuando corresponda.
- PETITUM numerado ("1. Me tenga por presentado..."), cierre "Proveer de conformidad." y "SERÁ JUSTICIA.-".
- Si el pedido NO es un escrito judicial (carta documento, telegrama, convenio, oficio), usá la estructura propia de ese género (intimación con plazo y apercibimiento; cláusulas numeradas; etc.).

REGLAS (no negociables):
- NUNCA inventes hechos, fechas, montos, nombres ni datos que no estén en el contexto. Si falta un dato, dejá el marcador [PENDIENTE: qué completar] (p. ej. [PENDIENTE: fecha de ingreso], [PENDIENTE: relatar los hechos]).
- PROHIBIDO inventar jurisprudencia: nada de carátulas, números de sentencia ni fechas de fallos. Si el escrito amerita citas, dejá [PENDIENTE: citar jurisprudencia sobre ...].
- Citá normas solo si son pertinentes y estás seguro (CCCN, LCT, CPCC Córdoba ley 8465, LPT ley 7987, Código Arancelario ley 9459). Ante duda: [PENDIENTE: verificar norma].
- Si el texto trae variables {{asi}}, conservalas EXACTAMENTE igual: las completa el sistema.
- Si trabajás sobre una plantilla o borrador con estructura de secciones, RESPETÁ esa estructura; mejorá adentro de ella.
- El resultado es un BORRADOR para que el abogado revise, apruebe y firme; no constituye asesoramiento jurídico.
- Devolvé únicamente el texto del documento, en texto plano (sin Markdown, sin #, sin **), sin comentarios meta.`;

const SYSTEM_REVISION = `Sos un prosecretario letrado de un tribunal de Córdoba, Argentina, encargado de la revisión FORMAL de escritos antes de su presentación por el SAC. Analizás un escrito y devolvés un control estructurado. NO opinás sobre la estrategia del caso: revisás forma, completitud y riesgos.

Revisá contra este checklist (adaptado al tipo de escrito; marcá "ok", "falta" o "revisar"):
1. Comparecencia completa (compareciente identificado; patrocinio/apoderamiento con M.P. si corresponde).
2. Domicilio procesal constituido y domicilio electrónico.
3. Identificación de la causa (carátula y/o N° de expediente) cuando es un escrito dentro de un proceso.
4. OBJETO claro y preciso (qué se pide).
5. HECHOS relatados (si el tipo de escrito lo exige).
6. DERECHO / fundamentación normativa.
7. PRUEBA ofrecida correctamente (si corresponde a la etapa).
8. PETITUM completo y congruente con el objeto.
9. Cierre de estilo ("Proveer de conformidad." / "SERÁ JUSTICIA.-") en escritos judiciales.
10. Sin restos de redacción: variables {{sin_completar}}, marcadores [PENDIENTE], datos faltantes.

Además:
- "citas_a_verificar": TODA cita normativa o jurisprudencial presente en el texto que el abogado deba verificar antes de presentar (las citas pueden ser erróneas o estar desactualizadas).
- "datos_pendientes": lista concreta de variables {{...}} y marcadores [PENDIENTE] que quedan sin completar, más datos obviamente faltantes.
- "apto_para_presentar": true solo si no hay items "falta" ni datos pendientes.
- Sé concreto y accionable; español rioplatense. No inventes problemas que no surjan del texto.`;

const SYSTEM_RESUMEN = `Sos un asistente que resume expedientes judiciales para abogados de Córdoba, Argentina, en ESPAÑOL. Producí un resumen claro y conciso (TL;DR) del estado de la causa: partes, objeto, etapa procesal, últimos movimientos, próximos vencimientos y qué resta hacer. No inventes información que no esté en el contexto. Usá viñetas cuando ayude a la claridad.`;

const SYSTEM_CEDULA = `Sos un asistente que analiza CÉDULAS y notificaciones judiciales de Córdoba, Argentina. Extraé la información clave del texto.
- Identificá el TIPO DE ACTO procesal notificado (p. ej. traslado de demanda, sentencia, decreto de apertura a prueba, citación de remate).
- FECHA de notificación en formato YYYY-MM-DD (null si no figura).
- PARTES mencionadas.
- Si el acto típicamente dispara un plazo, sugerí FUERO, DÍAS y modalidad (habiles/corridos) — p. ej. apelar = 5 hábiles, contestar demanda ordinario = 10 hábiles, citación de remate = 3 hábiles.
- "acto_catalogo_sugerido": el nombre del acto como figuraría en un catálogo de plazos (o null).
- Si no estás seguro de un dato, usá null y bajá la "confianza".
- NUNCA inventes datos que no estén en el texto. En "advertencia" recordá que el abogado debe verificar el plazo y la fecha.`;

const SYSTEM_QA = `Sos un asistente jurídico que responde preguntas sobre UN expediente judicial, en español, para el abogado a cargo. Respondé SOLO con base en el contexto provisto. Si la información no surge del contexto, decílo con claridad. Sé conciso y accionable (qué falta presentar, próximos vencimientos, riesgos). No inventes hechos, normas ni jurisprudencia.`;

async function construirContexto(
  supabase: DB,
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
      lineas.push(`- ${pl.acto_procesal}: vence ${formatFechaCorta(pl.fecha_vencimiento)} (${pl.estado})`);
  }
  return lineas.join("\n");
}

async function logIA(
  supabase: DB,
  estudioId: string,
  userId: string,
  feature: string,
  modelo: string,
  uso: { tokens_in: number; tokens_out: number; costo_usd: number },
) {
  await supabase.from("ai_interactions").insert({
    estudio_id: estudioId,
    usuario_id: userId,
    feature,
    modelo,
    tokens_in: uso.tokens_in,
    tokens_out: uso.tokens_out,
    costo_usd: uso.costo_usd,
  });
}

/* ── Redacción asistida ─────────────────────────────────────────────────── */
export async function asistirRedaccion(input: {
  modo: "generar" | "mejorar" | "completar";
  instruccion: string;
  textoActual?: string;
  expedienteId?: string | null;
}): Promise<ActionResult<{ texto: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };
  const cfg = await resolverIA(ctx.supabase, ctx.estudioId);
  if (!cfg) return SIN_IA;

  const contexto = input.expedienteId
    ? await construirContexto(ctx.supabase, ctx.estudioId, input.expedienteId)
    : "";

  let instruccion: string;
  switch (input.modo) {
    case "mejorar":
      instruccion = `Mejorá, corregí y completá el siguiente borrador según esta indicación: ${input.instruccion}\n\nBORRADOR ACTUAL:\n${input.textoActual ?? ""}`;
      break;
    case "completar":
      // Rellena la plantilla con el contexto SIN tocar la estructura: solo
      // marcadores [PENDIENTE] y huecos que el contexto realmente respalde.
      instruccion = `El siguiente escrito es una plantilla/borrador con marcadores [PENDIENTE: ...] y posibles variables {{var}}. Completá ÚNICAMENTE los marcadores y huecos que puedas respaldar con el CONTEXTO DEL EXPEDIENTE provisto. Mantené la estructura, las secciones y las fórmulas de estilo EXACTAMENTE como están. Lo que el contexto no respalde, dejalo como marcador [PENDIENTE: ...] (no lo inventes). Conservá intactas las variables {{var}} que no puedas resolver con certeza.${input.instruccion ? `\n\nIndicaciones del abogado (hechos del caso que podés usar como fuente): ${input.instruccion}` : ""}\n\nESCRITO A COMPLETAR:\n${input.textoActual ?? ""}`;
      break;
    default:
      instruccion = input.instruccion;
  }

  try {
    const { texto, uso } = await redactar({
      apiKey: cfg.apiKey,
      modelo: cfg.modelo,
      system: SYSTEM_REDACCION,
      contexto,
      instruccion,
      maxTokens: 6000,
    });
    await logIA(
      ctx.supabase,
      ctx.estudioId,
      ctx.userId,
      `redaccion_${input.modo}`,
      cfg.modelo,
      uso,
    );
    return { ok: true, data: { texto } };
  } catch {
    return { ok: false, error: "No pudimos generar el texto. Revisá tu API key o probá nuevamente." };
  }
}

/* ── Revisión formal del escrito (checklist estructurado) ───────────────── */
const revisionSchema = z.object({
  apto_para_presentar: z.boolean(),
  resumen: z.string(),
  checklist: z.array(
    z.object({
      requisito: z.string(),
      estado: z.enum(["ok", "falta", "revisar", "no_aplica"]),
      detalle: z.string(),
    }),
  ),
  citas_a_verificar: z.array(z.string()),
  datos_pendientes: z.array(z.string()),
});

export type RevisionEscrito = z.infer<typeof revisionSchema>;

/**
 * Control formal del escrito antes de presentar: checklist de requisitos,
 * citas a verificar y datos pendientes. La IA asiste, el abogado decide.
 */
export async function revisarEscrito(input: {
  texto: string;
  expedienteId?: string | null;
}): Promise<ActionResult<{ revision: RevisionEscrito }>> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };
  const cfg = await resolverIA(ctx.supabase, ctx.estudioId);
  if (!cfg) return SIN_IA;
  if (!input.texto || input.texto.trim().length < 40)
    return { ok: false, error: "El escrito es muy corto para revisar." };

  const contexto = input.expedienteId
    ? await construirContexto(ctx.supabase, ctx.estudioId, input.expedienteId)
    : "";

  try {
    const { data, uso } = await extraer({
      apiKey: cfg.apiKey,
      modelo: cfg.modelo,
      system: contexto
        ? `${SYSTEM_REVISION}\n\nCONTEXTO DEL EXPEDIENTE (para detectar incongruencias):\n${contexto}`
        : SYSTEM_REVISION,
      contenido: input.texto.slice(0, 60000),
      schema: revisionSchema,
      maxTokens: 3000,
    });
    await logIA(ctx.supabase, ctx.estudioId, ctx.userId, "redaccion_revision", cfg.modelo, uso);
    return { ok: true, data: { revision: data } };
  } catch {
    return { ok: false, error: "No pudimos revisar el escrito. Probá nuevamente." };
  }
}

export async function resumirExpediente(
  expedienteId: string,
): Promise<ActionResult<{ resumen: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };
  const cfg = await resolverIA(ctx.supabase, ctx.estudioId);
  if (!cfg) return SIN_IA;

  const contexto = await construirContexto(ctx.supabase, ctx.estudioId, expedienteId);
  if (!contexto) return { ok: false, error: "No encontramos el expediente." };

  try {
    const { texto, uso } = await redactar({
      apiKey: cfg.apiKey,
      modelo: cfg.modelo,
      system: SYSTEM_RESUMEN,
      contexto,
      instruccion: "Resumí el estado de esta causa.",
      maxTokens: 1500,
    });
    await logIA(ctx.supabase, ctx.estudioId, ctx.userId, "resumen_expediente", cfg.modelo, uso);
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
      .update({ titulo: input.titulo, contenido: input.contenido, tipo: input.tipo ?? null })
      .eq("id", input.id)
      .eq("estudio_id", ctx.estudioId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/redaccion");
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
  revalidatePath("/redaccion");
  return { ok: true, data: { id: data.id } };
}

/* ── Ingesta inteligente de cédulas ─────────────────────────────────────── */
const cedulaSchema = z.object({
  tipo_acto: z.string(),
  fecha_notificacion: z.string().nullable(),
  partes_detectadas: z.array(z.string()),
  fuero_sugerido: z
    .enum([
      "civil_comercial",
      "laboral",
      "familia",
      "penal",
      "contencioso_administrativo",
      "concursos_quiebras",
      "tributario",
      "otro",
    ])
    .nullable(),
  dias_sugerido: z.number().int().nullable(),
  modalidad_sugerida: z.enum(["habiles", "corridos", "horas"]).nullable(),
  acto_catalogo_sugerido: z.string().nullable(),
  resumen: z.string(),
  confianza: z.enum(["alta", "media", "baja"]),
  advertencia: z.string(),
});

export type CedulaExtraccion = z.infer<typeof cedulaSchema>;
export type CatalogoMatch = { id: string; acto_procesal: string; dias: number; modalidad: string };

export async function parsearCedula(input: {
  texto: string;
  expedienteId?: string | null;
}): Promise<ActionResult<{ extraccion: CedulaExtraccion; catalogoMatch: CatalogoMatch | null }>> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };
  const cfg = await resolverIA(ctx.supabase, ctx.estudioId);
  if (!cfg) return SIN_IA;
  if (!input.texto || input.texto.trim().length < 20)
    return { ok: false, error: "Pegá el texto de la cédula (al menos unas líneas)." };

  try {
    const { data, uso } = await extraer({
      apiKey: cfg.apiKey,
      modelo: cfg.modelo,
      system: SYSTEM_CEDULA,
      contenido: input.texto.slice(0, 16000),
      schema: cedulaSchema,
      maxTokens: 2000,
    });
    await logIA(ctx.supabase, ctx.estudioId, ctx.userId, "parseo_cedula", cfg.modelo, uso);

    const { data: cat } = await ctx.supabase
      .from("catalogo_plazos")
      .select("id, acto_procesal, dias, modalidad, fuero")
      .or(`estudio_id.is.null,estudio_id.eq.${ctx.estudioId}`)
      .eq("activo", true);
    const catalogo = cat ?? [];

    let match: CatalogoMatch | null = null;
    const sug = (data.acto_catalogo_sugerido ?? "").toLowerCase().trim();
    if (sug) {
      const m =
        catalogo.find((c) => c.acto_procesal.toLowerCase().includes(sug)) ??
        catalogo.find((c) => sug.includes(c.acto_procesal.toLowerCase().split(" — ")[0]!));
      if (m) match = { id: m.id, acto_procesal: m.acto_procesal, dias: m.dias, modalidad: m.modalidad };
    }
    if (!match && data.dias_sugerido != null) {
      const m = catalogo.find(
        (c) => c.dias === data.dias_sugerido && (!data.fuero_sugerido || c.fuero === data.fuero_sugerido),
      );
      if (m) match = { id: m.id, acto_procesal: m.acto_procesal, dias: m.dias, modalidad: m.modalidad };
    }

    return { ok: true, data: { extraccion: data, catalogoMatch: match } };
  } catch {
    return { ok: false, error: "No pudimos analizar la cédula. Revisá tu API key o probá nuevamente." };
  }
}

export async function responderExpediente(input: {
  expedienteId: string;
  pregunta: string;
}): Promise<ActionResult<{ respuesta: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión expiró." };
  const cfg = await resolverIA(ctx.supabase, ctx.estudioId);
  if (!cfg) return SIN_IA;
  if (!input.pregunta?.trim()) return { ok: false, error: "Escribí una pregunta." };

  const contexto = await construirContexto(ctx.supabase, ctx.estudioId, input.expedienteId);
  if (!contexto) return { ok: false, error: "No encontramos el expediente." };

  try {
    const { texto, uso } = await redactar({
      apiKey: cfg.apiKey,
      modelo: cfg.modelo,
      system: SYSTEM_QA,
      contexto,
      instruccion: `Pregunta del abogado: ${input.pregunta}`,
      maxTokens: 1500,
    });
    await logIA(ctx.supabase, ctx.estudioId, ctx.userId, "qa_expediente", cfg.modelo, uso);
    return { ok: true, data: { respuesta: texto } };
  } catch {
    return { ok: false, error: "No pudimos responder. Probá nuevamente." };
  }
}

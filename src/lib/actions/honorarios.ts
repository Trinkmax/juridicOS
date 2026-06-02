"use server";

import { revalidatePath } from "next/cache";
import {
  getActionContext,
  fromZod,
  NO_ESTUDIO,
  type ActionResult,
} from "@/lib/actions/_base";
import {
  timeEntrySchema,
  honorarioSchema,
  facturaSchema,
  estadoHonorario,
  estadoFactura,
  type EstadoHonorario,
  type EstadoFactura,
} from "@/lib/validations/honorarios";

function revalidar() {
  revalidatePath("/honorarios");
  revalidatePath("/dashboard");
}

/* ════════════════════════ TIME TRACKING ════════════════════════ */

export async function crearTimeEntry(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = timeEntrySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);
  const v = parsed.data;

  const { error } = await ctx.supabase.from("time_entries").insert({
    estudio_id: ctx.estudioId,
    usuario_id: ctx.userId,
    expediente_id: v.expediente_id ?? null,
    fecha: v.fecha,
    minutos: v.minutos,
    descripcion: v.descripcion ?? null,
    tarifa_hora: v.tarifa_hora ?? null,
    facturable: v.facturable ?? true,
  });
  if (error) return { ok: false, error: error.message };

  revalidar();
  return { ok: true, message: "Tiempo registrado." };
}

export async function eliminarTimeEntry(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { error } = await ctx.supabase
    .from("time_entries")
    .delete()
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);
  if (error) return { ok: false, error: error.message };

  revalidar();
  return { ok: true };
}

/* ════════════════════════ HONORARIOS ════════════════════════ */

export async function crearHonorario(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = honorarioSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);
  const v = parsed.data;

  // El monto se CALCULA en el server según la base elegida.
  let monto = 0;
  let jusCantidad: number | null = null;
  let jusValor: number | null = null;
  let porcentaje: number | null = null;

  switch (v.base) {
    case "jus": {
      jusCantidad = v.jus_cantidad ?? 0;
      jusValor = v.jus_valor ?? 0;
      monto = jusCantidad * jusValor;
      break;
    }
    case "monto":
    case "tiempo": {
      monto = v.monto ?? 0;
      break;
    }
    case "pacto_cuota_litis": {
      porcentaje = v.porcentaje ?? 0;
      // El monto puede no conocerse aún (depende de la sentencia/acuerdo).
      monto = v.monto ?? 0;
      break;
    }
  }

  const { error } = await ctx.supabase.from("honorarios").insert({
    estudio_id: ctx.estudioId,
    created_by: ctx.userId,
    expediente_id: v.expediente_id ?? null,
    cliente_id: v.cliente_id ?? null,
    concepto: v.concepto,
    base: v.base,
    jus_cantidad: jusCantidad,
    jus_valor: jusValor,
    porcentaje,
    monto,
    notas: v.notas ?? null,
    estado: "pendiente",
  });
  if (error) return { ok: false, error: error.message };

  revalidar();
  return { ok: true, message: "Honorario registrado." };
}

export async function actualizarEstadoHonorario(
  id: string,
  estado: EstadoHonorario,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = estadoHonorario.safeParse(estado);
  if (!parsed.success) return { ok: false, error: "Estado inválido." };

  const { error } = await ctx.supabase
    .from("honorarios")
    .update({ estado: parsed.data })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);
  if (error) return { ok: false, error: error.message };

  revalidar();
  return { ok: true };
}

export async function eliminarHonorario(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { error } = await ctx.supabase
    .from("honorarios")
    .delete()
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);
  if (error) return { ok: false, error: error.message };

  revalidar();
  return { ok: true };
}

/* ════════════════════════ FACTURAS ════════════════════════ */

export async function crearFactura(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  // Los items llegan serializados como JSON desde el client.
  const raw = Object.fromEntries(formData);
  let itemsParsed: unknown = [];
  try {
    itemsParsed = JSON.parse(String(raw.items ?? "[]"));
  } catch {
    return { ok: false, error: "No se pudieron leer los ítems de la factura." };
  }

  const parsed = facturaSchema.safeParse({
    cliente_id: raw.cliente_id,
    expediente_id: raw.expediente_id,
    tipo_comprobante: raw.tipo_comprobante,
    items: itemsParsed,
    notas: raw.notas,
  });
  if (!parsed.success) return fromZod(parsed.error);
  const v = parsed.data;

  const subtotal = v.items.reduce(
    (acc, it) => acc + it.cantidad * it.precio_unitario,
    0,
  );
  const iva = 0; // Sin discriminar IVA por ahora.
  const total = subtotal + iva;

  // Numeración interna correlativa por estudio (provisional, sin CAE).
  const { count } = await ctx.supabase
    .from("facturas")
    .select("id", { count: "exact", head: true })
    .eq("estudio_id", ctx.estudioId);
  const numero = `${v.tipo_comprobante}-${String((count ?? 0) + 1).padStart(8, "0")}`;

  const { error } = await ctx.supabase.from("facturas").insert({
    estudio_id: ctx.estudioId,
    created_by: ctx.userId,
    cliente_id: v.cliente_id,
    expediente_id: v.expediente_id ?? null,
    tipo_comprobante: v.tipo_comprobante,
    items: v.items,
    subtotal,
    iva,
    total,
    notas: v.notas ?? null,
    numero,
    estado: "borrador",
  });
  if (error) return { ok: false, error: error.message };

  revalidar();
  return { ok: true, message: "Factura creada en estado borrador." };
}

export async function actualizarEstadoFactura(
  id: string,
  estado: EstadoFactura,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = estadoFactura.safeParse(estado);
  if (!parsed.success) return { ok: false, error: "Estado inválido." };

  const { error } = await ctx.supabase
    .from("facturas")
    .update({ estado: parsed.data })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);
  if (error) return { ok: false, error: error.message };

  revalidar();
  return { ok: true };
}

/**
 * STUB de solicitud de CAE ante ARCA/AFIP.
 * ⚠️ NO realiza ninguna llamada real a AFIP. Simula la emisión marcando la
 * factura como "emitida" y generando un CAE de demostración. La integración
 * real (WSFE / web services de ARCA) queda PENDIENTE.
 */
export async function solicitarCAE(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const ahora = new Date();
  const caeDemo = `DEMO-${ahora.getTime()}`;
  const vencimiento = new Date(ahora);
  vencimiento.setDate(vencimiento.getDate() + 10);
  const caeVencimiento = vencimiento.toISOString().slice(0, 10);

  const { error } = await ctx.supabase
    .from("facturas")
    .update({
      estado: "emitida",
      cae: caeDemo,
      cae_vencimiento: caeVencimiento,
    })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);
  if (error) return { ok: false, error: error.message };

  revalidar();
  return {
    ok: true,
    message:
      "CAE de demostración generado. La emisión real ante ARCA/AFIP está pendiente de integración.",
  };
}

import { z } from "zod";

/**
 * Schemas del módulo Honorarios + Time-tracking + Facturación.
 * Los `coerce` permiten que los <input> envíen strings (FormData) y los
 * convierten a number/boolean del lado del server.
 */

/* ── Time tracking ──────────────────────────────────────────────────── */
export const timeEntrySchema = z.object({
  expediente_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || undefined),
  fecha: z.string().min(1, "Indicá la fecha."),
  minutos: z.coerce.number().int().min(0, "Los minutos no pueden ser negativos."),
  descripcion: z.string().trim().max(500).optional(),
  tarifa_hora: z.coerce.number().min(0).optional(),
  facturable: z.coerce.boolean().optional(),
});
export type TimeEntryInput = z.infer<typeof timeEntrySchema>;

/* ── Honorarios ─────────────────────────────────────────────────────── */
export const baseHonorario = z.enum(["jus", "monto", "pacto_cuota_litis", "tiempo"]);
export type BaseHonorario = z.infer<typeof baseHonorario>;

export const honorarioSchema = z.object({
  expediente_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || undefined),
  cliente_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || undefined),
  concepto: z.string().trim().min(2, "El concepto es muy corto."),
  base: baseHonorario,
  jus_cantidad: z.coerce.number().min(0).optional(),
  jus_valor: z.coerce.number().min(0).optional(),
  porcentaje: z.coerce.number().min(0).max(100).optional(),
  monto: z.coerce.number().min(0).optional(),
  notas: z.string().trim().max(1000).optional(),
});
export type HonorarioInput = z.infer<typeof honorarioSchema>;

export const estadoHonorario = z.enum(["pendiente", "facturado", "cobrado", "anulado"]);
export type EstadoHonorario = z.infer<typeof estadoHonorario>;

/* ── Facturas ───────────────────────────────────────────────────────── */
export const facturaItemSchema = z.object({
  descripcion: z.string().trim().min(1, "Describí el ítem."),
  cantidad: z.coerce.number().min(0),
  precio_unitario: z.coerce.number().min(0),
});
export type FacturaItem = z.infer<typeof facturaItemSchema>;

export const facturaSchema = z.object({
  cliente_id: z.string().uuid("Elegí un cliente."),
  expediente_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || undefined),
  tipo_comprobante: z.enum(["A", "B", "C"]),
  items: z.array(facturaItemSchema).min(1, "Agregá al menos un ítem."),
  notas: z.string().trim().max(1000).optional(),
});
export type FacturaInput = z.infer<typeof facturaSchema>;

export const estadoFactura = z.enum(["borrador", "emitida", "pagada", "anulada"]);
export type EstadoFactura = z.infer<typeof estadoFactura>;

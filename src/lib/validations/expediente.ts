import { z } from "zod";

/* ── Enum values (mirror the Postgres enums) ─────────────────────────── */
const FUERO_VALUES = [
  "civil_comercial",
  "laboral",
  "familia",
  "penal",
  "contencioso_administrativo",
  "concursos_quiebras",
  "tributario",
  "otro",
] as const;

const ESTADO_EXPEDIENTE_VALUES = [
  "en_tramite",
  "con_sentencia",
  "en_ejecucion",
  "en_apelacion",
  "suspendido",
  "archivado",
] as const;

const TIPO_PARTE_VALUES = [
  "actor",
  "demandado",
  "tercero",
  "citado_garantia",
  "otro",
] as const;

/** "" → undefined, then trim. Used for optional text fields coming from FormData. */
const optionalText = z
  .preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().optional(),
  )
  .transform((v) => v ?? null);

/** "" → null for a foreign key uuid coming from a Select. */
const optionalId = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? null : v),
  z.string().uuid().nullable().optional(),
);

/** "" → undefined enum (Select returns "" when nothing chosen). */
function optionalEnum<const T extends readonly [string, ...string[]]>(values: T) {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.enum(values).optional(),
  );
}

/* ── Expediente ──────────────────────────────────────────────────────── */
export const expedienteSchema = z.object({
  caratula: z.string().trim().min(3, "La carátula es obligatoria (mínimo 3 caracteres)."),
  nro_sac: optionalText,
  fuero: z.enum(FUERO_VALUES).default("civil_comercial"),
  materia: optionalText,
  juzgado: optionalText,
  secretaria: optionalText,
  jurisdiccion: z
    .preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z.string().trim().optional(),
    )
    .transform((v) => v ?? "cordoba"),
  localidad: optionalText,
  etapa: optionalText,
  estado: z.enum(ESTADO_EXPEDIENTE_VALUES).default("en_tramite"),
  cliente_id: optionalId,
  caracter_cliente: optionalEnum(TIPO_PARTE_VALUES),
  monto_reclamado: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().nonnegative("El monto no puede ser negativo.").optional(),
  ),
  fecha_inicio: optionalText,
  observaciones: optionalText,
});

export type ExpedienteValues = z.infer<typeof expedienteSchema>;

/* ── Parte ───────────────────────────────────────────────────────────── */
export const parteSchema = z.object({
  expediente_id: z.string().uuid(),
  tipo: z.enum(TIPO_PARTE_VALUES).default("actor"),
  nombre: z.string().trim().min(2, "El nombre de la parte es obligatorio."),
  documento: optionalText,
  domicilio: optionalText,
  caracter: optionalText,
  patrocinante: optionalText,
  es_propio: z.preprocess(
    (v) => v === "true" || v === "on" || v === true,
    z.coerce.boolean().optional(),
  ),
});

export type ParteValues = z.infer<typeof parteSchema>;

/* ── Movimiento ──────────────────────────────────────────────────────── */
export const movimientoSchema = z.object({
  expediente_id: z.string().uuid(),
  fecha: z.string().trim().min(1, "La fecha es obligatoria."),
  titulo: z.string().trim().min(2, "El título es obligatorio."),
  descripcion: optionalText,
  tipo: optionalText,
});

export type MovimientoValues = z.infer<typeof movimientoSchema>;

import { z } from "zod";

/* ── Enum values (mirror the Postgres enums) ─────────────────────────── */
const ESTADO_TAREA_VALUES = [
  "pendiente",
  "en_curso",
  "en_revision",
  "completada",
  "cancelada",
] as const;

const PRIORIDAD_VALUES = ["baja", "media", "alta", "critica"] as const;

/** "" → undefined, then trim. Para campos de texto opcionales de FormData. */
const optionalText = z
  .preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().optional(),
  )
  .transform((v) => v ?? null);

/** "" → null para una fecha opcional. */
const optionalFecha = z
  .preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().optional(),
  )
  .transform((v) => v ?? null);

/** "" → null para una FK uuid que llega de un Select. */
const optionalId = z
  .preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().uuid().optional(),
  )
  .transform((v) => v ?? null);

/* ── Tarea ───────────────────────────────────────────────────────────── */
export const tareaSchema = z.object({
  titulo: z.string().trim().min(2, "El título es obligatorio (mínimo 2 caracteres)."),
  descripcion: optionalText,
  estado: z.enum(ESTADO_TAREA_VALUES).default("pendiente"),
  prioridad: z.enum(PRIORIDAD_VALUES).default("media"),
  vencimiento: optionalFecha,
  asignado_a: optionalId,
  expediente_id: optionalId,
});

export type TareaValues = z.infer<typeof tareaSchema>;

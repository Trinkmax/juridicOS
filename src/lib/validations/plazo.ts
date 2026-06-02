import { z } from "zod";

/** Optional string field: trims, and converts "" → undefined. */
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

/** Optional UUID field: "" → undefined, otherwise must be a uuid. */
const optionalUuid = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .pipe(z.string().uuid().optional());

export const plazoSchema = z.object({
  expediente_id: z.string().uuid("Elegí un expediente válido."),
  acto_procesal: z.string().trim().min(2, "Describí el acto procesal."),
  modalidad: z.enum(["habiles", "corridos", "horas"]).default("habiles"),
  dias: z.coerce.number().int("Tiene que ser un número entero.").min(0, "No puede ser negativo."),
  fecha_inicio_computo: z.string().trim().min(1, "Indicá la fecha de inicio del cómputo."),
  jurisdiccion: z.string().trim().min(1).default("cordoba"),
  prioridad: z.enum(["baja", "media", "alta", "critica"]).default("alta"),
  descripcion: optionalText,
  responsable_id: optionalUuid,
  catalogo_plazo_id: optionalUuid,
});

export type PlazoValues = z.infer<typeof plazoSchema>;

export const audienciaSchema = z.object({
  expediente_id: z.string().uuid("Elegí un expediente válido."),
  titulo: z.string().trim().min(2, "El título es obligatorio."),
  tipo: optionalText,
  fecha_hora: z.string().trim().min(1, "Indicá fecha y hora."),
  duracion_min: z.coerce.number().int().min(0).optional(),
  modalidad: z.enum(["presencial", "virtual", "hibrida"]).default("presencial"),
  lugar: optionalText,
  enlace: optionalText,
  juzgado: optionalText,
  responsable_id: optionalUuid,
});

export type AudienciaValues = z.infer<typeof audienciaSchema>;

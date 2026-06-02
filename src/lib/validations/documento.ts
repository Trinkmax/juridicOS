import { z } from "zod";

/** "" → null para FKs uuid que vienen de un Select. */
const optionalId = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? null : v),
  z.string().uuid().nullable().optional(),
);

/** "" → undefined para texto opcional. */
const optionalText = z
  .preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().optional(),
  )
  .transform((v) => v ?? null);

/**
 * Metadatos de un documento del archivo digital.
 * El archivo ya se subió a Storage; acá registramos la fila.
 */
export const documentoMetaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre del documento es obligatorio."),
  tipo: optionalText,
  expediente_id: optionalId,
  cliente_id: optionalId,
  etiquetas: z.array(z.string().trim().min(1)).optional(),
  compartido_cliente: z.boolean().optional(),
});

export type DocumentoMetaValues = z.infer<typeof documentoMetaSchema>;

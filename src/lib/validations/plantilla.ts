import { z } from "zod";

/** Empty-string → undefined so optional text fields persist as null. */
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

export const plantillaSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio"),
  tipo: optionalText,
  contenido: z.string().trim().min(1, "El contenido no puede estar vacío"),
});

export type PlantillaValues = z.infer<typeof plantillaSchema>;

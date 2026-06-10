import { z } from "zod";
import { CATEGORIAS_PLANTILLA, FUEROS } from "@/lib/constants";

/** Empty-string → undefined so optional text fields persist as null. */
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

/** Empty-string/null → undefined antes de validar contra el vocabulario. */
const optionalEnum = <T extends string>(values: readonly T[]) =>
  z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.enum(values as [T, ...T[]]).optional(),
  );

const categorias = CATEGORIAS_PLANTILLA.map((c) => c.value);
const fueros = FUEROS.map((f) => f.value);

export const plantillaSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio"),
  tipo: optionalText,
  categoria: optionalEnum(categorias),
  fuero: optionalEnum(fueros),
  descripcion: optionalText,
  contenido: z.string().trim().min(1, "El contenido no puede estar vacío"),
});

export type PlantillaValues = z.infer<typeof plantillaSchema>;

import { z } from "zod";

/** Empty-string → undefined so optional text fields persist as null. */
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

export const clienteSchema = z.object({
  tipo: z.enum(["fisica", "juridica"]).default("fisica"),
  nombre: z.string().trim().min(2, "El nombre es obligatorio"),
  documento: optionalText,
  email: z
    .string()
    .trim()
    .email("Ingresá un email válido")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  telefono: optionalText,
  domicilio_real: optionalText,
  domicilio_electronico: optionalText,
  localidad: optionalText,
  provincia: optionalText,
  notas: optionalText,
});

export type ClienteValues = z.infer<typeof clienteSchema>;

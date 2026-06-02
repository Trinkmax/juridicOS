import { z } from "zod";

export const estudioSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre del estudio es obligatorio"),
  cuit: z.string().trim().optional(),
  localidad: z.string().trim().optional(),
  telefono: z.string().trim().optional(),
});

export type EstudioValues = z.infer<typeof estudioSchema>;

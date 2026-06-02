import { z } from "zod";

/** Roles asignables a un miembro del estudio (incluye "cliente"). */
export const rolEstudioSchema = z.enum([
  "owner",
  "abogado",
  "procurador",
  "paralegal",
  "secretaria",
  "cliente",
]);

export type RolEstudio = z.infer<typeof rolEstudioSchema>;

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

/** "" → null, con trim. Para campos de texto opcionales del FormData. */
const optionalText = z
  .preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().optional(),
  )
  .transform((v) => v ?? null);

/** Alta de un miembro nuevo: el owner le crea la cuenta (email + contraseña). */
export const crearMiembroSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresá el nombre."),
  apellido: z.string().trim().min(2, "Ingresá el apellido."),
  email: z.string().trim().toLowerCase().email("Ingresá un email válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  rol: rolEstudioSchema.default("abogado"),
  matricula: optionalText,
  titulo: optionalText,
});

export type CrearMiembroValues = z.infer<typeof crearMiembroSchema>;

/** Suma a alguien que ya tiene cuenta en juridicOS, por su email. */
export const agregarExistenteSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ingresá un email válido."),
  rol: rolEstudioSchema.default("abogado"),
});

export type AgregarExistenteValues = z.infer<typeof agregarExistenteSchema>;

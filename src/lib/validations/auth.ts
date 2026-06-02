import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ingresá un email válido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});

export const signupSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresá tu nombre"),
  apellido: z.string().trim().min(2, "Ingresá tu apellido"),
  email: z.string().email("Ingresá un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;

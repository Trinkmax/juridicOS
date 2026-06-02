import Link from "next/link";
import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Crear estudio" };

export default function RegistroPage() {
  return (
    <div className="animate-in-up">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Creá tu estudio</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Empezá gratis. En menos de un minuto tenés tu estudio funcionando.
      </p>
      <div className="mt-8">
        <SignupForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Ingresá
        </Link>
      </p>
    </div>
  );
}

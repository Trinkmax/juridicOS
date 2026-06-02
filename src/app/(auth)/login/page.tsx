import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Ingresar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <div className="animate-in-up">
      <h1 className="text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Ingresá para gestionar tu estudio.
      </p>
      <div className="mt-8">
        <LoginForm next={next} demoError={error === "demo"} />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tenés cuenta?{" "}
        <Link href="/registro" className="font-medium text-primary hover:underline">
          Creá tu estudio
        </Link>
      </p>
    </div>
  );
}

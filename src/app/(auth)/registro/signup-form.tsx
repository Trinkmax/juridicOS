"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { MailCheck } from "lucide-react";
import { signupAction, type AuthState } from "@/lib/actions/auth";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Spinner />}
      Crear mi cuenta
    </Button>
  );
}

export function SignupForm() {
  const [state, action] = useActionState<AuthState, FormData>(signupAction, null);
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  if (state?.ok && state.data?.needsConfirmation) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-success-soft text-success">
          <MailCheck className="size-6" />
        </div>
        <h2 className="text-base font-semibold">Revisá tu email</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Te enviamos un enlace para confirmar tu cuenta. Una vez confirmada, vas a poder
          crear tu estudio.
        </p>
        <Button asChild variant="outline" className="mt-5 w-full">
          <Link href="/login">Ir a ingresar</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state && !state.ok && <FormError>{state.error}</FormError>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nombre" htmlFor="nombre" error={fieldErrors?.nombre}>
          <Input id="nombre" name="nombre" autoComplete="given-name" placeholder="María" required />
        </Field>
        <Field label="Apellido" htmlFor="apellido" error={fieldErrors?.apellido}>
          <Input id="apellido" name="apellido" autoComplete="family-name" placeholder="Pérez" required />
        </Field>
      </div>
      <Field label="Email" htmlFor="email" error={fieldErrors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" placeholder="vos@estudio.com" required />
      </Field>
      <Field
        label="Contraseña"
        htmlFor="password"
        error={fieldErrors?.password}
        hint="Al menos 8 caracteres."
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
        />
      </Field>
      <SubmitButton />
      <p className="text-center text-xs text-muted-foreground">
        Al crear tu cuenta aceptás los términos del servicio.
      </p>
    </form>
  );
}

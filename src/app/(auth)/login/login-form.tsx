"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Play } from "lucide-react";
import { loginAction, demoLoginAction, type AuthState } from "@/lib/actions/auth";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Spinner />}
      {children}
    </Button>
  );
}

function DemoButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" variant="outline" className="w-full" disabled={pending}>
      {pending ? <Spinner /> : <Play className="size-4" />}
      Entrar a la demo
    </Button>
  );
}

export function LoginForm({ next, demoError }: { next?: string; demoError?: boolean }) {
  const [state, action] = useActionState<AuthState, FormData>(loginAction, null);
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <div className="space-y-5">
      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next ?? "/dashboard"} />
        {state && !state.ok && <FormError>{state.error}</FormError>}
        {demoError && (
          <FormError>No pudimos entrar a la demo. Probá de nuevo en unos segundos.</FormError>
        )}
        <Field label="Email" htmlFor="email" error={fieldErrors?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="vos@estudio.com"
            required
          />
        </Field>
        <Field label="Contraseña" htmlFor="password" error={fieldErrors?.password}>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </Field>
        <SubmitButton>Ingresar</SubmitButton>
      </form>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">o</span>
        <Separator className="flex-1" />
      </div>

      <form action={demoLoginAction}>
        <DemoButton />
      </form>
      <p className="text-center text-xs text-muted-foreground">
        La demo carga un estudio con causas, plazos y audiencias de ejemplo.
      </p>
    </div>
  );
}

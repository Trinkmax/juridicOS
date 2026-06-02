"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { crearEstudioAction, type EstudioState } from "@/lib/actions/estudio";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? <Spinner /> : null}
      Crear estudio
      {!pending && <ArrowRight className="size-4" />}
    </Button>
  );
}

export function OnboardingForm() {
  const [state, action] = useActionState<EstudioState, FormData>(crearEstudioAction, null);
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={action} className="space-y-4">
      {state && !state.ok && <FormError>{state.error}</FormError>}
      <Field label="Nombre del estudio" htmlFor="nombre" error={fieldErrors?.nombre} required>
        <Input id="nombre" name="nombre" placeholder="Estudio Pérez & Asociados" required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="CUIT" htmlFor="cuit" error={fieldErrors?.cuit}>
          <Input id="cuit" name="cuit" placeholder="30-12345678-9" />
        </Field>
        <Field label="Localidad" htmlFor="localidad" error={fieldErrors?.localidad}>
          <Input id="localidad" name="localidad" defaultValue="Córdoba" />
        </Field>
      </div>
      <Field label="Teléfono" htmlFor="telefono" error={fieldErrors?.telefono}>
        <Input id="telefono" name="telefono" placeholder="+54 351 ..." />
      </Field>
      <SubmitButton />
    </form>
  );
}

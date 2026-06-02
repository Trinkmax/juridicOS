"use client";

import * as React from "react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Stamp } from "lucide-react";
import { guardarMembrete, type MembreteState } from "@/lib/actions/configuracion";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";

export type MembreteFormValues = {
  nombre: string;
  cuit: string;
  domicilio: string;
  email: string;
  telefono: string;
  logoUrl: string;
  abogado: string;
  matricula: string;
  domicilioElectronico: string;
  incluirLogo: boolean;
};

function GuardarBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner /> : <Save className="size-4" />}
      Guardar membrete
    </Button>
  );
}

export function MembreteForm({ valores }: { valores: MembreteFormValues }) {
  const router = useRouter();
  const [incluirLogo, setIncluirLogo] = useState(valores.incluirLogo);
  const [state, action] = useActionState<MembreteState, FormData>(
    guardarMembrete,
    null,
  );
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message ?? "Guardado");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-5">
      {state && !state.ok && <FormError>{state.error}</FormError>}

      <div className="flex items-start gap-2 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        <Stamp className="mt-0.5 size-3.5 shrink-0" />
        <p>
          Estos datos forman el encabezado de los escritos que generás en PDF en
          Redacción. Lo legalmente relevante es el texto (estudio, abogado,
          matrícula y domicilios constituido y electrónico).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre del estudio" htmlFor="nombre" error={fieldErrors?.nombre} required>
          <Input
            id="nombre"
            name="nombre"
            defaultValue={valores.nombre}
            placeholder="Estudio Jurídico Pérez & Asoc."
          />
        </Field>
        <Field label="Nombre del abogado/a" htmlFor="abogado" error={fieldErrors?.abogado}>
          <Input
            id="abogado"
            name="abogado"
            defaultValue={valores.abogado}
            placeholder="Dra. Juana Pérez"
          />
        </Field>
        <Field
          label="Matrícula (Tomo–Folio)"
          htmlFor="matricula"
          error={fieldErrors?.matricula}
          hint="Como figura en el SAC. Ej.: T° 123 F° 45."
        >
          <Input
            id="matricula"
            name="matricula"
            defaultValue={valores.matricula}
            placeholder="T° 123 F° 45"
          />
        </Field>
        <Field label="CUIT" htmlFor="cuit" error={fieldErrors?.cuit}>
          <Input
            id="cuit"
            name="cuit"
            defaultValue={valores.cuit}
            placeholder="20-12345678-9"
          />
        </Field>
        <Field
          label="Domicilio constituido"
          htmlFor="domicilio"
          error={fieldErrors?.domicilio}
          className="sm:col-span-2"
        >
          <Input
            id="domicilio"
            name="domicilio"
            defaultValue={valores.domicilio}
            placeholder="Av. Colón 123, Piso 4, Córdoba"
          />
        </Field>
        <Field
          label="Domicilio electrónico (casilla)"
          htmlFor="domicilioElectronico"
          error={fieldErrors?.domicilioElectronico}
          hint="La casilla del SAC donde se notifican los traslados."
          className="sm:col-span-2"
        >
          <Input
            id="domicilioElectronico"
            name="domicilioElectronico"
            defaultValue={valores.domicilioElectronico}
            placeholder="20123456789@justiciacordoba.gob.ar"
          />
        </Field>
        <Field label="Teléfono" htmlFor="telefono" error={fieldErrors?.telefono}>
          <Input
            id="telefono"
            name="telefono"
            defaultValue={valores.telefono}
            placeholder="0351 123-4567"
          />
        </Field>
        <Field label="Email" htmlFor="email" error={fieldErrors?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={valores.email}
            placeholder="estudio@ejemplo.com"
          />
        </Field>
        <Field
          label="URL del logo"
          htmlFor="logoUrl"
          error={fieldErrors?.logoUrl}
          hint="Opcional. Pegá la URL pública de tu logo (PNG o JPG)."
          className="sm:col-span-2"
        >
          <Input
            id="logoUrl"
            name="logoUrl"
            type="url"
            defaultValue={valores.logoUrl}
            placeholder="https://…/logo.png"
          />
        </Field>
      </div>

      <label className="flex items-center justify-between gap-4 rounded-md border border-border bg-muted/40 px-3 py-2.5">
        <span className="min-w-0">
          <span className="block text-sm font-medium">
            Incluir logo en los documentos
          </span>
          <span className="block text-xs text-muted-foreground">
            Si está activo y hay URL de logo, aparece en el encabezado del PDF. El
            estándar forense es sobrio; muchos escritos van sin logo.
          </span>
        </span>
        <input type="hidden" name="incluirLogo" value={incluirLogo ? "true" : "false"} />
        <Switch
          checked={incluirLogo}
          onCheckedChange={setIncluirLogo}
          aria-label="Incluir logo en los documentos"
        />
      </label>

      <GuardarBtn />
    </form>
  );
}

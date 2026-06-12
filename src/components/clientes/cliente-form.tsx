"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, UserPlus } from "lucide-react";
import {
  crearCliente,
  actualizarCliente,
  type ClienteState,
} from "@/lib/actions/clientes";
import { TIPOS_CLIENTE, type TipoCliente } from "@/lib/constants";
import type { Cliente } from "@/lib/types/domain";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type FieldErrors = Record<string, string[] | undefined> | undefined;

function SubmitButton({ modo }: { modo: "crear" | "editar" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Spinner />
      ) : modo === "crear" ? (
        <UserPlus className="size-4" />
      ) : (
        <Save className="size-4" />
      )}
      {modo === "crear" ? "Crear cliente" : "Guardar cambios"}
    </Button>
  );
}

export function ClienteForm({
  cliente,
  onSuccess,
  cancel,
}: {
  /** Si viene, el form opera en modo edición. */
  cliente?: Cliente;
  /** Callback al guardar con éxito (p.ej. cerrar diálogo). */
  onSuccess?: () => void;
  /** Botón/acción de cancelar (p.ej. DialogClose) renderizado en el footer. */
  cancel?: React.ReactNode;
}) {
  const modo = cliente ? "editar" : "crear";
  const router = useRouter();
  const [state, action] = useActionState<ClienteState, FormData>(
    cliente ? actualizarCliente : crearCliente,
    null,
  );
  const fieldErrors: FieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  const [tipo, setTipo] = useState<TipoCliente>(
    (cliente?.tipo as TipoCliente) ?? "fisica",
  );
  const esJuridica = tipo === "juridica";

  useEffect(() => {
    if (state?.ok && modo === "editar") {
      toast.success("Cliente actualizado");
      onSuccess?.();
      router.refresh();
    }
  }, [state, modo, onSuccess, router]);

  return (
    <form action={action} className="space-y-6">
      {cliente && <input type="hidden" name="id" value={cliente.id} />}
      <input type="hidden" name="tipo" value={tipo} />

      {state && !state.ok && <FormError>{state.error}</FormError>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo de cliente">
          <Select value={tipo} onValueChange={(v) => setTipo(v as TipoCliente)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccioná un tipo" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_CLIENTE.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          label={esJuridica ? "CUIT" : "DNI"}
          htmlFor="documento"
          error={fieldErrors?.documento}
        >
          <Input
            id="documento"
            name="documento"
            defaultValue={cliente?.documento ?? ""}
            placeholder={esJuridica ? "30-12345678-9" : "12.345.678"}
          />
        </Field>
      </div>

      <Field
        label={esJuridica ? "Razón social" : "Nombre y apellido"}
        htmlFor="nombre"
        error={fieldErrors?.nombre}
        required
      >
        <Input
          id="nombre"
          name="nombre"
          defaultValue={cliente?.nombre ?? ""}
          placeholder={esJuridica ? "Constructora del Sur S.A." : "María Pérez"}
          required
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={fieldErrors?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={cliente?.email ?? ""}
            placeholder="cliente@correo.com"
          />
        </Field>
        <Field label="Teléfono" htmlFor="telefono" error={fieldErrors?.telefono}>
          <Input
            id="telefono"
            name="telefono"
            defaultValue={cliente?.telefono ?? ""}
            placeholder="+54 351 ..."
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Domicilio real"
          htmlFor="domicilio_real"
          error={fieldErrors?.domicilio_real}
        >
          <Input
            id="domicilio_real"
            name="domicilio_real"
            defaultValue={cliente?.domicilio_real ?? ""}
            placeholder="Av. Colón 1234"
          />
        </Field>
        <Field
          label="Domicilio electrónico"
          htmlFor="domicilio_electronico"
          error={fieldErrors?.domicilio_electronico}
          hint="Domicilio constituido / electrónico judicial"
        >
          <Input
            id="domicilio_electronico"
            name="domicilio_electronico"
            defaultValue={cliente?.domicilio_electronico ?? ""}
            placeholder="20-12345678-9"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Localidad" htmlFor="localidad" error={fieldErrors?.localidad}>
          <Input
            id="localidad"
            name="localidad"
            defaultValue={cliente?.localidad ?? "Córdoba"}
            placeholder="Córdoba"
          />
        </Field>
        <Field label="Provincia" htmlFor="provincia" error={fieldErrors?.provincia}>
          <Input
            id="provincia"
            name="provincia"
            defaultValue={cliente?.provincia ?? "Córdoba"}
            placeholder="Córdoba"
          />
        </Field>
      </div>

      <Field label="Notas" htmlFor="notas" error={fieldErrors?.notas}>
        <Textarea
          id="notas"
          name="notas"
          defaultValue={cliente?.notas ?? ""}
          rows={3}
          placeholder="Observaciones internas sobre el cliente…"
        />
      </Field>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {cancel}
        <SubmitButton modo={modo} />
      </div>
    </form>
  );
}

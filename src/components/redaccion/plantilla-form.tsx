"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Plus } from "lucide-react";
import {
  crearPlantilla,
  actualizarPlantilla,
  type PlantillaState,
} from "@/lib/actions/plantillas";
import type { Plantilla } from "@/lib/types/domain";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type FieldErrors = Record<string, string[] | undefined> | undefined;

function SubmitButton({ modo }: { modo: "crear" | "editar" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Spinner />
      ) : modo === "crear" ? (
        <Plus className="size-4" />
      ) : (
        <Save className="size-4" />
      )}
      {modo === "crear" ? "Crear plantilla" : "Guardar cambios"}
    </Button>
  );
}

export function PlantillaForm({
  plantilla,
  onSuccess,
  cancel,
}: {
  plantilla?: Plantilla;
  onSuccess?: () => void;
  cancel?: React.ReactNode;
}) {
  const modo = plantilla ? "editar" : "crear";
  const router = useRouter();
  const [state, action] = useActionState<PlantillaState, FormData>(
    plantilla ? actualizarPlantilla : crearPlantilla,
    null,
  );
  const fieldErrors: FieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  useEffect(() => {
    if (state?.ok) {
      toast.success(modo === "crear" ? "Plantilla creada" : "Plantilla actualizada");
      onSuccess?.();
      router.refresh();
    }
  }, [state, modo, onSuccess, router]);

  return (
    <form action={action} className="space-y-5">
      {plantilla && <input type="hidden" name="id" value={plantilla.id} />}

      {state && !state.ok && <FormError>{state.error}</FormError>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="nombre" error={fieldErrors?.nombre} required>
          <Input
            id="nombre"
            name="nombre"
            defaultValue={plantilla?.nombre ?? ""}
            placeholder="Solicitud de prórroga"
            required
          />
        </Field>
        <Field label="Tipo" htmlFor="tipo" error={fieldErrors?.tipo} hint="Categoría libre (escrito, oficio, carta…)">
          <Input
            id="tipo"
            name="tipo"
            defaultValue={plantilla?.tipo ?? ""}
            placeholder="Escrito judicial"
          />
        </Field>
      </div>

      <Field
        label="Contenido"
        htmlFor="contenido"
        error={fieldErrors?.contenido}
        hint="Usá {{variable}} para los campos que se completan por expediente (ej.: {{expediente_caratula}}, {{nro_sac}}, {{cliente_nombre}})."
        required
      >
        <Textarea
          id="contenido"
          name="contenido"
          defaultValue={plantilla?.contenido ?? ""}
          rows={12}
          className="font-mono text-[13px] leading-relaxed"
          placeholder={`Señor Juez:\n\nEn los autos caratulados "{{expediente_caratula}}" (Expte. SAC {{nro_sac}}), {{cliente_nombre}} comparece y dice:\n\n…`}
          required
        />
      </Field>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {cancel}
        <SubmitButton modo={modo} />
      </div>
    </form>
  );
}

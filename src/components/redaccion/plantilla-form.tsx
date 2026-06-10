"use client";

import { useActionState, useEffect, useState } from "react";
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
import { CATEGORIAS_PLANTILLA, FUEROS } from "@/lib/constants";
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

const SIN_VALOR = "__ninguno__";

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
  const [categoria, setCategoria] = useState(plantilla?.categoria ?? "");
  const [fuero, setFuero] = useState(plantilla?.fuero ?? "");
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
      <input type="hidden" name="categoria" value={categoria} />
      <input type="hidden" name="fuero" value={fuero} />

      {state && !state.ok && <FormError>{state.error}</FormError>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="nombre" error={fieldErrors?.nombre} required>
          <Input
            id="nombre"
            name="nombre"
            defaultValue={plantilla?.nombre ?? ""}
            placeholder="Demanda laboral — Ordinario"
            required
          />
        </Field>
        <Field label="Tipo" htmlFor="tipo" error={fieldErrors?.tipo} hint="Etiqueta libre (escrito, oficio, carta…)">
          <Input
            id="tipo"
            name="tipo"
            defaultValue={plantilla?.tipo ?? ""}
            placeholder="Escrito judicial"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Categoría"
          htmlFor="categoria-select"
          error={fieldErrors?.categoria}
          hint="Agrupa la plantilla en la galería."
        >
          <Select
            value={categoria || SIN_VALOR}
            onValueChange={(v) => setCategoria(v === SIN_VALOR ? "" : v)}
          >
            <SelectTrigger id="categoria-select">
              <SelectValue placeholder="Sin categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SIN_VALOR}>Sin categoría</SelectItem>
              {CATEGORIAS_PLANTILLA.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="Fuero"
          htmlFor="fuero-select"
          error={fieldErrors?.fuero}
          hint="Opcional: si el modelo es de un fuero específico."
        >
          <Select
            value={fuero || SIN_VALOR}
            onValueChange={(v) => setFuero(v === SIN_VALOR ? "" : v)}
          >
            <SelectTrigger id="fuero-select">
              <SelectValue placeholder="Multifuero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SIN_VALOR}>Multifuero</SelectItem>
              {FUEROS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field
        label="Descripción"
        htmlFor="descripcion"
        error={fieldErrors?.descripcion}
        hint="Una línea para la galería: qué es y cuándo se usa."
      >
        <Input
          id="descripcion"
          name="descripcion"
          defaultValue={plantilla?.descripcion ?? ""}
          placeholder="Demanda por despido con estructura completa: OBJETO, HECHOS, PRUEBA, PETITUM"
        />
      </Field>

      <Field
        label="Contenido"
        htmlFor="contenido"
        error={fieldErrors?.contenido}
        hint="Usá {{variable}} para datos que se completan solos: {{expediente_caratula}}, {{nro_sac}}, {{cliente_nombre}}, {{contraparte_nombre}}, {{abogado}}, {{matricula}}, {{estudio_domicilio}}, {{domicilio_electronico}}, {{fecha}}… Para huecos del caso, dejá [PENDIENTE: qué completar]."
        required
      >
        <Textarea
          id="contenido"
          name="contenido"
          defaultValue={plantilla?.contenido ?? ""}
          rows={12}
          className="font-mono text-[13px] leading-relaxed"
          placeholder={`PROMUEVE DEMANDA\n\n{{cliente_nombre}}, DNI N.º {{cliente_documento}}, con el patrocinio letrado de {{abogado}}, M.P. {{matricula}}, constituyendo domicilio procesal en {{estudio_domicilio}}, comparezco ante V.S. y digo:\n\nI. OBJETO.\n\n…`}
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

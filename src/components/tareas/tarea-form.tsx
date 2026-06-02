"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Save } from "lucide-react";
import {
  crearTarea,
  actualizarTarea,
  type TareaState,
} from "@/lib/actions/tareas";
import {
  ESTADOS_TAREA,
  PRIORIDADES,
  type EstadoTarea,
  type Prioridad,
} from "@/lib/constants";
import type { Tarea } from "@/lib/types/domain";
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

export type MiembroOption = { id: string; nombre: string };
export type ExpedienteOption = { id: string; caratula: string };

type FieldErrors = Record<string, string[] | undefined> | undefined;

const SIN_ASIGNAR = "__sin__";
const SIN_EXPEDIENTE = "__sin_exp__";

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
      {modo === "crear" ? "Crear tarea" : "Guardar cambios"}
    </Button>
  );
}

export function TareaForm({
  tarea,
  miembros,
  expedientes,
  estadoInicial,
  onSuccess,
  cancel,
}: {
  /** Si viene, el form opera en modo edición. */
  tarea?: Tarea;
  miembros: MiembroOption[];
  expedientes: ExpedienteOption[];
  /** Estado precargado al crear (p. ej. la columna desde la que se abrió). */
  estadoInicial?: EstadoTarea;
  onSuccess?: () => void;
  cancel?: React.ReactNode;
}) {
  const modo = tarea ? "editar" : "crear";
  const router = useRouter();
  const [state, action] = useActionState<TareaState, FormData>(
    tarea ? actualizarTarea : crearTarea,
    null,
  );
  const fieldErrors: FieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  const [estado, setEstado] = useState<EstadoTarea>(
    (tarea?.estado as EstadoTarea) ?? estadoInicial ?? "pendiente",
  );
  const [prioridad, setPrioridad] = useState<Prioridad>(
    (tarea?.prioridad as Prioridad) ?? "media",
  );
  const [asignado, setAsignado] = useState<string>(tarea?.asignado_a ?? SIN_ASIGNAR);
  const [expediente, setExpediente] = useState<string>(
    tarea?.expediente_id ?? SIN_EXPEDIENTE,
  );

  useEffect(() => {
    if (state?.ok) {
      toast.success(modo === "crear" ? "Tarea creada" : "Tarea actualizada");
      onSuccess?.();
      router.refresh();
    }
  }, [state, modo, onSuccess, router]);

  return (
    <form action={action} className="space-y-5">
      {tarea && <input type="hidden" name="id" value={tarea.id} />}
      <input type="hidden" name="estado" value={estado} />
      <input type="hidden" name="prioridad" value={prioridad} />
      <input
        type="hidden"
        name="asignado_a"
        value={asignado === SIN_ASIGNAR ? "" : asignado}
      />
      <input
        type="hidden"
        name="expediente_id"
        value={expediente === SIN_EXPEDIENTE ? "" : expediente}
      />

      {state && !state.ok && <FormError>{state.error}</FormError>}

      <Field label="Título" htmlFor="titulo" error={fieldErrors?.titulo} required>
        <Input
          id="titulo"
          name="titulo"
          defaultValue={tarea?.titulo ?? ""}
          placeholder="Ej.: Presentar escrito de contestación"
          required
          autoFocus
        />
      </Field>

      <Field label="Descripción" htmlFor="descripcion" error={fieldErrors?.descripcion}>
        <Textarea
          id="descripcion"
          name="descripcion"
          defaultValue={tarea?.descripcion ?? ""}
          rows={3}
          placeholder="Detalles, contexto o pasos a seguir…"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Estado">
          <Select value={estado} onValueChange={(v) => setEstado(v as EstadoTarea)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccioná un estado" />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS_TAREA.map((e) => (
                <SelectItem key={e.value} value={e.value}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Prioridad">
          <Select value={prioridad} onValueChange={(v) => setPrioridad(v as Prioridad)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccioná la prioridad" />
            </SelectTrigger>
            <SelectContent>
              {PRIORIDADES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Responsable">
          <Select value={asignado} onValueChange={setAsignado}>
            <SelectTrigger>
              <SelectValue placeholder="Sin asignar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SIN_ASIGNAR}>Sin asignar</SelectItem>
              {miembros.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          label="Vencimiento"
          htmlFor="vencimiento"
          error={fieldErrors?.vencimiento}
        >
          <Input
            id="vencimiento"
            name="vencimiento"
            type="date"
            defaultValue={tarea?.vencimiento ?? ""}
          />
        </Field>
      </div>

      <Field label="Expediente vinculado">
        <Select value={expediente} onValueChange={setExpediente}>
          <SelectTrigger>
            <SelectValue placeholder="Sin expediente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SIN_EXPEDIENTE}>Sin expediente</SelectItem>
            {expedientes.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.caratula}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {cancel}
        <SubmitButton modo={modo} />
      </div>
    </form>
  );
}

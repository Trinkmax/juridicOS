"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { crearAudiencia, actualizarAudiencia } from "@/lib/actions/audiencias";
import type { ActionResult } from "@/lib/actions/_base";
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
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";

type ExpedienteLite = { id: string; caratula: string };

/** Subconjunto de Audiencia que precarga el form (lo cumple la fila completa y el ítem de agenda). */
type AudienciaEditable = {
  id: string;
  expediente_id: string;
  titulo: string;
  tipo: string | null;
  fecha_hora: string;
  duracion_min: number | null;
  modalidad: string;
  lugar: string | null;
  juzgado: string | null;
  enlace: string | null;
};

const MODALIDADES_AUDIENCIA = [
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
  { value: "hibrida", label: "Híbrida" },
];

/** ISO (timestamptz) → valor para <input type="datetime-local"> en hora local. */
function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function SubmitButton({ editando }: { editando: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Spinner />}
      {editando ? "Guardar cambios" : "Agendar audiencia"}
    </Button>
  );
}

export function AudienciaForm({
  expedientes,
  expedientePreseleccionado,
  audiencia,
  onSuccess,
}: {
  expedientes: ExpedienteLite[];
  expedientePreseleccionado?: string;
  /** Si viene, el formulario edita esa audiencia en vez de crear una nueva. */
  audiencia?: AudienciaEditable;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const editando = Boolean(audiencia);
  const accion = React.useMemo(
    () => (audiencia ? actualizarAudiencia.bind(null, audiencia.id) : crearAudiencia),
    [audiencia],
  );
  const [state, action] = useActionState<ActionResult | null, FormData>(accion, null);
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  const [expedienteId, setExpedienteId] = React.useState(
    audiencia?.expediente_id ?? expedientePreseleccionado ?? "",
  );
  const [modalidad, setModalidad] = React.useState(audiencia?.modalidad ?? "presencial");

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(editando ? "Audiencia actualizada." : "Audiencia agendada.");
      onSuccess?.();
      router.refresh();
    }
  }, [state, editando, onSuccess, router]);

  return (
    <form action={action} className="space-y-4">
      {state && !state.ok && <FormError>{state.error}</FormError>}

      <Field label="Expediente" required error={fieldErrors?.expediente_id}>
        <input type="hidden" name="expediente_id" value={expedienteId} />
        <Select value={expedienteId} onValueChange={setExpedienteId} disabled={editando}>
          <SelectTrigger>
            <SelectValue placeholder="Elegí el expediente" />
          </SelectTrigger>
          <SelectContent>
            {expedientes.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.caratula}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Título" required error={fieldErrors?.titulo}>
        <Input
          name="titulo"
          placeholder="Ej: Audiencia preliminar"
          defaultValue={audiencia?.titulo ?? ""}
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Fecha y hora" required error={fieldErrors?.fecha_hora}>
          <Input
            type="datetime-local"
            name="fecha_hora"
            defaultValue={audiencia ? toDatetimeLocal(audiencia.fecha_hora) : ""}
            required
          />
        </Field>
        <Field label="Duración (min)" error={fieldErrors?.duracion_min}>
          <Input
            type="number"
            name="duracion_min"
            min={0}
            defaultValue={audiencia?.duracion_min ?? 60}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Modalidad">
          <input type="hidden" name="modalidad" value={modalidad} />
          <Select value={modalidad} onValueChange={setModalidad}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODALIDADES_AUDIENCIA.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Juzgado" error={fieldErrors?.juzgado}>
          <Input name="juzgado" placeholder="Opcional" defaultValue={audiencia?.juzgado ?? ""} />
        </Field>
      </div>

      {modalidad === "presencial" || modalidad === "hibrida" ? (
        <Field label="Lugar" error={fieldErrors?.lugar}>
          <Input name="lugar" placeholder="Dirección o sala" defaultValue={audiencia?.lugar ?? ""} />
        </Field>
      ) : null}

      {modalidad === "virtual" || modalidad === "hibrida" ? (
        <Field label="Enlace" error={fieldErrors?.enlace}>
          <Input name="enlace" placeholder="https://…" defaultValue={audiencia?.enlace ?? ""} />
        </Field>
      ) : null}

      <Field label="Tipo" error={fieldErrors?.tipo} hint="Opcional.">
        <Textarea
          name="tipo"
          placeholder="Notas o tipo de audiencia…"
          defaultValue={audiencia?.tipo ?? ""}
        />
      </Field>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Cancelar
          </Button>
        </DialogClose>
        <SubmitButton editando={editando} />
      </DialogFooter>
    </form>
  );
}

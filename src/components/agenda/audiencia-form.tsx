"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { crearAudiencia } from "@/lib/actions/audiencias";
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

const MODALIDADES_AUDIENCIA = [
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
  { value: "hibrida", label: "Híbrida" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Spinner />}
      Agendar audiencia
    </Button>
  );
}

export function AudienciaForm({
  expedientes,
  expedientePreseleccionado,
  onSuccess,
}: {
  expedientes: ExpedienteLite[];
  expedientePreseleccionado?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [state, action] = useActionState<ActionResult | null, FormData>(
    crearAudiencia,
    null,
  );
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  const [expedienteId, setExpedienteId] = React.useState(expedientePreseleccionado ?? "");
  const [modalidad, setModalidad] = React.useState("presencial");

  React.useEffect(() => {
    if (state?.ok) {
      toast.success("Audiencia agendada.");
      onSuccess?.();
      router.refresh();
    }
  }, [state, onSuccess, router]);

  return (
    <form action={action} className="space-y-4">
      {state && !state.ok && <FormError>{state.error}</FormError>}

      <Field label="Expediente" required error={fieldErrors?.expediente_id}>
        <input type="hidden" name="expediente_id" value={expedienteId} />
        <Select value={expedienteId} onValueChange={setExpedienteId}>
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
        <Input name="titulo" placeholder="Ej: Audiencia preliminar" required />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Fecha y hora" required error={fieldErrors?.fecha_hora}>
          <Input type="datetime-local" name="fecha_hora" required />
        </Field>
        <Field label="Duración (min)" error={fieldErrors?.duracion_min}>
          <Input type="number" name="duracion_min" min={0} defaultValue={60} />
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
          <Input name="juzgado" placeholder="Opcional" />
        </Field>
      </div>

      {modalidad === "presencial" || modalidad === "hibrida" ? (
        <Field label="Lugar" error={fieldErrors?.lugar}>
          <Input name="lugar" placeholder="Dirección o sala" />
        </Field>
      ) : null}

      {modalidad === "virtual" || modalidad === "hibrida" ? (
        <Field label="Enlace" error={fieldErrors?.enlace}>
          <Input name="enlace" placeholder="https://…" />
        </Field>
      ) : null}

      <Field label="Tipo" error={fieldErrors?.tipo} hint="Opcional.">
        <Textarea name="tipo" placeholder="Notas o tipo de audiencia…" />
      </Field>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Cancelar
          </Button>
        </DialogClose>
        <SubmitButton />
      </DialogFooter>
    </form>
  );
}

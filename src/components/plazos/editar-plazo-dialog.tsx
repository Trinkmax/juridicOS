"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { actualizarPlazo } from "@/lib/actions/plazos";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MODALIDADES_PLAZO, PRIORIDADES } from "@/lib/constants";
import type { ActionResult } from "@/lib/actions/_base";

/** Campos necesarios para editar un plazo (los expone `v_plazos_detalle`). */
export type PlazoEditable = {
  id: string;
  expediente_id: string | null;
  acto_procesal: string | null;
  dias: number | null;
  modalidad: string | null;
  fecha_inicio_computo: string | null;
  jurisdiccion: string | null;
  prioridad: string | null;
  descripcion: string | null;
};

function Guardar() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Save />}
      Guardar cambios
    </Button>
  );
}

/** Formulario de edición de plazo (cuerpo, sin Dialog — reutilizable). */
export function EditarPlazoForm({
  plazo,
  onSuccess,
}: {
  plazo: PlazoEditable;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const accion = React.useMemo(() => actualizarPlazo.bind(null, plazo.id), [plazo.id]);
  const [state, action] = useActionState<ActionResult | null, FormData>(accion, null);
  const [modalidad, setModalidad] = React.useState(plazo.modalidad ?? "habiles");
  const [prioridad, setPrioridad] = React.useState(plazo.prioridad ?? "alta");

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(state.message ?? "Plazo actualizado.");
      onSuccess?.();
      router.refresh();
    }
  }, [state, onSuccess, router]);

  const fieldError = (c: string) =>
    state && !state.ok ? state.fieldErrors?.[c] : undefined;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="expediente_id" value={plazo.expediente_id ?? ""} />
      <input type="hidden" name="jurisdiccion" value={plazo.jurisdiccion ?? "cordoba"} />
      <input type="hidden" name="modalidad" value={modalidad} />
      <input type="hidden" name="prioridad" value={prioridad} />
      <FormError>{state && !state.ok ? state.error : undefined}</FormError>

      <Field label="Acto procesal" htmlFor="pz-acto" required error={fieldError("acto_procesal")}>
        <Input id="pz-acto" name="acto_procesal" defaultValue={plazo.acto_procesal ?? ""} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Fecha de cómputo"
          htmlFor="pz-fecha"
          required
          error={fieldError("fecha_inicio_computo")}
          hint="Día de notificación."
        >
          <Input
            id="pz-fecha"
            name="fecha_inicio_computo"
            type="date"
            defaultValue={plazo.fecha_inicio_computo ?? ""}
          />
        </Field>
        <Field label="Días" htmlFor="pz-dias" required error={fieldError("dias")}>
          <Input id="pz-dias" name="dias" type="number" min={0} defaultValue={plazo.dias ?? 0} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Modalidad">
          <Select value={modalidad} onValueChange={setModalidad}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODALIDADES_PLAZO.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Prioridad">
          <Select value={prioridad} onValueChange={setPrioridad}>
            <SelectTrigger>
              <SelectValue />
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

      <Field label="Notas" htmlFor="pz-desc" error={fieldError("descripcion")} hint="Opcional.">
        <Textarea id="pz-desc" name="descripcion" defaultValue={plazo.descripcion ?? ""} />
      </Field>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="ghost">
            Cancelar
          </Button>
        </DialogClose>
        <Guardar />
      </DialogFooter>
    </form>
  );
}

/** Diálogo de edición de plazo (controlado). */
export function EditarPlazoDialog({
  plazo,
  open,
  onOpenChange,
}: {
  plazo: PlazoEditable;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar plazo</DialogTitle>
          <DialogDescription>
            Si cambiás los días o la fecha de cómputo, el vencimiento se recalcula solo.
          </DialogDescription>
        </DialogHeader>
        <EditarPlazoForm plazo={plazo} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

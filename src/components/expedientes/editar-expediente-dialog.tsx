"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Loader2, Save } from "lucide-react";
import { actualizarExpediente } from "@/lib/actions/expedientes";
import {
  Dialog,
  DialogTrigger,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FUEROS, ESTADOS_EXPEDIENTE, TIPOS_PARTE } from "@/lib/constants";
import type { ActionResult } from "@/lib/actions/_base";
import type { Expediente } from "@/lib/types/domain";

type ClienteOpcion = { id: string; nombre: string };

const SIN_CLIENTE = "__sin_cliente__";
const SIN_CARACTER = "__sin_caracter__";

function Enviar() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Save />}
      Guardar cambios
    </Button>
  );
}

export function EditarExpedienteDialog({
  expediente,
  clientes,
}: {
  expediente: Expediente;
  clientes: ClienteOpcion[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const actualizar = actualizarExpediente.bind(null, expediente.id);
  const [state, action] = useActionState<ActionResult | null, FormData>(
    actualizar,
    null,
  );

  const [fuero, setFuero] = React.useState(expediente.fuero);
  const [estado, setEstado] = React.useState(expediente.estado);
  const [clienteId, setClienteId] = React.useState(expediente.cliente_id ?? SIN_CLIENTE);
  const [caracter, setCaracter] = React.useState(
    expediente.caracter_cliente ?? SIN_CARACTER,
  );

  React.useEffect(() => {
    if (state?.ok) {
      toast.success("Expediente actualizado.");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  const fieldError = (campo: string) =>
    state && !state.ok ? state.fieldErrors?.[campo] : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar expediente</DialogTitle>
          <DialogDescription>Actualizá los datos de la causa.</DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <FormError>{state && !state.ok ? state.error : undefined}</FormError>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                className="sm:col-span-2"
                label="Carátula"
                htmlFor="edit-caratula"
                required
                error={fieldError("caratula")}
              >
                <Input
                  id="edit-caratula"
                  name="caratula"
                  defaultValue={expediente.caratula}
                />
              </Field>

              <Field label="Número SAC" htmlFor="edit-nro_sac" error={fieldError("nro_sac")}>
                <Input
                  id="edit-nro_sac"
                  name="nro_sac"
                  defaultValue={expediente.nro_sac ?? ""}
                  className="font-mono"
                />
              </Field>

              <Field label="Materia" htmlFor="edit-materia" error={fieldError("materia")}>
                <Input id="edit-materia" name="materia" defaultValue={expediente.materia ?? ""} />
              </Field>

              <Field label="Fuero" htmlFor="edit-fuero" required error={fieldError("fuero")}>
                <input type="hidden" name="fuero" value={fuero} />
                <Select value={fuero} onValueChange={(v) => setFuero(v as typeof fuero)}>
                  <SelectTrigger id="edit-fuero">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FUEROS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Estado" htmlFor="edit-estado" required error={fieldError("estado")}>
                <input type="hidden" name="estado" value={estado} />
                <Select value={estado} onValueChange={(v) => setEstado(v as typeof estado)}>
                  <SelectTrigger id="edit-estado">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_EXPEDIENTE.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Juzgado" htmlFor="edit-juzgado" error={fieldError("juzgado")}>
                <Input id="edit-juzgado" name="juzgado" defaultValue={expediente.juzgado ?? ""} />
              </Field>

              <Field label="Secretaría" htmlFor="edit-secretaria" error={fieldError("secretaria")}>
                <Input
                  id="edit-secretaria"
                  name="secretaria"
                  defaultValue={expediente.secretaria ?? ""}
                />
              </Field>

              <Field
                label="Jurisdicción"
                htmlFor="edit-jurisdiccion"
                error={fieldError("jurisdiccion")}
              >
                <Input
                  id="edit-jurisdiccion"
                  name="jurisdiccion"
                  defaultValue={expediente.jurisdiccion}
                />
              </Field>

              <Field label="Etapa procesal" htmlFor="edit-etapa" error={fieldError("etapa")}>
                <Input id="edit-etapa" name="etapa" defaultValue={expediente.etapa ?? ""} />
              </Field>

              <Field label="Cliente" htmlFor="edit-cliente_id" error={fieldError("cliente_id")}>
                <input
                  type="hidden"
                  name="cliente_id"
                  value={clienteId === SIN_CLIENTE ? "" : clienteId}
                />
                <Select value={clienteId} onValueChange={setClienteId}>
                  <SelectTrigger id="edit-cliente_id">
                    <SelectValue placeholder="Sin cliente asociado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SIN_CLIENTE}>Sin cliente asociado</SelectItem>
                    {clientes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                label="Carácter del cliente"
                htmlFor="edit-caracter_cliente"
                error={fieldError("caracter_cliente")}
              >
                <input
                  type="hidden"
                  name="caracter_cliente"
                  value={caracter === SIN_CARACTER ? "" : caracter}
                />
                <Select value={caracter} onValueChange={setCaracter}>
                  <SelectTrigger id="edit-caracter_cliente">
                    <SelectValue placeholder="Sin carácter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SIN_CARACTER}>Sin carácter</SelectItem>
                    {TIPOS_PARTE.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                label="Fecha de inicio"
                htmlFor="edit-fecha_inicio"
                error={fieldError("fecha_inicio")}
              >
                <Input
                  id="edit-fecha_inicio"
                  name="fecha_inicio"
                  type="date"
                  defaultValue={expediente.fecha_inicio ?? ""}
                />
              </Field>

              <Field
                label="Monto reclamado"
                htmlFor="edit-monto_reclamado"
                error={fieldError("monto_reclamado")}
              >
                <Input
                  id="edit-monto_reclamado"
                  name="monto_reclamado"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={expediente.monto_reclamado ?? ""}
                />
              </Field>

              <Field
                className="sm:col-span-2"
                label="Observaciones"
                htmlFor="edit-observaciones"
                error={fieldError("observaciones")}
              >
                <Textarea
                  id="edit-observaciones"
                  name="observaciones"
                  defaultValue={expediente.observaciones ?? ""}
                />
              </Field>
            </div>
          </ScrollArea>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Enviar />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

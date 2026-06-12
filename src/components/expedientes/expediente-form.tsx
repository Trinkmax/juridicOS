"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Save, Loader2 } from "lucide-react";
import { crearExpediente } from "@/lib/actions/expedientes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FUEROS, ESTADOS_EXPEDIENTE, TIPOS_PARTE } from "@/lib/constants";
import type { ActionResult } from "@/lib/actions/_base";

type ClienteOpcion = { id: string; nombre: string };

const SIN_CLIENTE = "__sin_cliente__";

function Enviar() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Save />}
      {pending ? "Creando…" : "Crear expediente"}
    </Button>
  );
}

/** Alta de expediente. En éxito la action hace redirect al detalle. */
export function ExpedienteForm({
  clientes,
  localidades,
}: {
  clientes: ClienteOpcion[];
  localidades: ComboboxOption[];
}) {
  const [state, action] = useActionState<ActionResult | null, FormData>(
    crearExpediente,
    null,
  );

  const [fuero, setFuero] = React.useState<string>("civil_comercial");
  const [estado, setEstado] = React.useState<string>("en_tramite");
  const [clienteId, setClienteId] = React.useState<string>(SIN_CLIENTE);
  const [caracter, setCaracter] = React.useState<string>("");
  const [localidad, setLocalidad] = React.useState<string>("");

  const fieldError = (campo: string) =>
    state && !state.ok ? state.fieldErrors?.[campo] : undefined;

  return (
    <form action={action} className="space-y-6">
      <FormError>{state && !state.ok ? state.error : undefined}</FormError>

      {/* Identificación */}
      <Card>
        <CardHeader>
          <CardTitle>Identificación</CardTitle>
          <CardDescription>Cómo identificás esta causa en tu estudio.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            className="sm:col-span-2"
            label="Carátula"
            htmlFor="caratula"
            required
            error={fieldError("caratula")}
            hint="Ej.: “Pérez, Juan c/ Aseguradora S.A. - Ordinario - Daños y perjuicios”."
          >
            <Input id="caratula" name="caratula" placeholder="Carátula del expediente" autoFocus />
          </Field>

          <Field label="Número SAC" htmlFor="nro_sac" error={fieldError("nro_sac")}>
            <Input
              id="nro_sac"
              name="nro_sac"
              placeholder="Ej.: 1234567"
              className="font-mono text-data"
            />
          </Field>

          <Field label="Materia" htmlFor="materia" error={fieldError("materia")}>
            <Input id="materia" name="materia" placeholder="Ej.: Daños y perjuicios" />
          </Field>
        </CardContent>
      </Card>

      {/* Radicación */}
      <Card>
        <CardHeader>
          <CardTitle>Radicación</CardTitle>
          <CardDescription>Fuero, juzgado y estado procesal.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Fuero" htmlFor="fuero" required error={fieldError("fuero")}>
            <input type="hidden" name="fuero" value={fuero} />
            <Select value={fuero} onValueChange={setFuero}>
              <SelectTrigger id="fuero">
                <SelectValue placeholder="Seleccioná un fuero" />
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

          <Field label="Estado" htmlFor="estado" required error={fieldError("estado")}>
            <input type="hidden" name="estado" value={estado} />
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger id="estado">
                <SelectValue placeholder="Seleccioná un estado" />
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

          <Field label="Juzgado" htmlFor="juzgado" error={fieldError("juzgado")}>
            <Input id="juzgado" name="juzgado" placeholder="Ej.: Juzgado Civil y Comercial 5° Nom." />
          </Field>

          <Field label="Secretaría" htmlFor="secretaria" error={fieldError("secretaria")}>
            <Input id="secretaria" name="secretaria" placeholder="Ej.: Secretaría única" />
          </Field>

          <input type="hidden" name="jurisdiccion" value="cordoba" />
          <Field
            label="Localidad / Sede judicial"
            htmlFor="localidad"
            error={fieldError("localidad")}
            hint="Localidad de Córdoba donde se radica la causa."
          >
            <Combobox
              id="localidad"
              name="localidad"
              value={localidad}
              onValueChange={setLocalidad}
              options={localidades}
              placeholder="Elegí una localidad"
              searchPlaceholder="Buscar localidad…"
              emptyText="No se encontró la localidad."
            />
          </Field>

          <Field label="Etapa procesal" htmlFor="etapa" error={fieldError("etapa")}>
            <Input id="etapa" name="etapa" placeholder="Ej.: Prueba" />
          </Field>
        </CardContent>
      </Card>

      {/* Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Cliente</CardTitle>
          <CardDescription>Vinculá la causa con un cliente del estudio.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Cliente" htmlFor="cliente_id" error={fieldError("cliente_id")}>
            <input
              type="hidden"
              name="cliente_id"
              value={clienteId === SIN_CLIENTE ? "" : clienteId}
            />
            <Select value={clienteId} onValueChange={setClienteId}>
              <SelectTrigger id="cliente_id">
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
            htmlFor="caracter_cliente"
            error={fieldError("caracter_cliente")}
            hint="Posición procesal de tu cliente en la causa."
          >
            <input type="hidden" name="caracter_cliente" value={caracter} />
            <Select value={caracter} onValueChange={setCaracter}>
              <SelectTrigger id="caracter_cliente">
                <SelectValue placeholder="Seleccioná un carácter" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_PARTE.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      {/* Datos */}
      <Card>
        <CardHeader>
          <CardTitle>Datos adicionales</CardTitle>
          <CardDescription>Fecha de inicio, monto y observaciones.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Fecha de inicio" htmlFor="fecha_inicio" error={fieldError("fecha_inicio")}>
            <Input id="fecha_inicio" name="fecha_inicio" type="date" />
          </Field>

          <Field
            label="Monto reclamado"
            htmlFor="monto_reclamado"
            error={fieldError("monto_reclamado")}
            hint="En pesos (ARS), sin separadores."
          >
            <Input
              id="monto_reclamado"
              name="monto_reclamado"
              type="number"
              min={0}
              step="0.01"
              placeholder="0"
              className="text-data"
            />
          </Field>

          <Field
            className="sm:col-span-2"
            label="Observaciones"
            htmlFor="observaciones"
            error={fieldError("observaciones")}
          >
            <Textarea
              id="observaciones"
              name="observaciones"
              placeholder="Notas internas sobre la causa…"
            />
          </Field>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" asChild>
          <Link href="/expedientes">Cancelar</Link>
        </Button>
        <Enviar />
      </div>
    </form>
  );
}

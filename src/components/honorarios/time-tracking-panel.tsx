"use client";

import * as React from "react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Clock } from "lucide-react";
import { crearTimeEntry, eliminarTimeEntry } from "@/lib/actions/honorarios";
import type { ExpedienteOption } from "./opciones";
import type { ActionResult } from "@/lib/actions/_base";
import { formatFechaCorta } from "@/lib/format";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const SIN_EXPEDIENTE = "__sin_exp__";

export type TimeEntryRow = {
  id: string;
  fecha: string;
  minutos: number;
  descripcion: string | null;
  facturable: boolean;
  expediente: string | null;
  usuario: string | null;
};

function horas(minutos: number) {
  return (minutos / 60).toLocaleString("es-AR", { maximumFractionDigits: 2 });
}

function GuardarBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner /> : <Plus className="size-4" />}
      Registrar tiempo
    </Button>
  );
}

export function TimeTrackingPanel({
  entries,
  expedientes,
}: {
  entries: TimeEntryRow[];
  expedientes: ExpedienteOption[];
}) {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<ActionResult | null, FormData>(
    crearTimeEntry,
    null,
  );

  const hoy = new Date().toISOString().slice(0, 10);
  const [expediente, setExpediente] = useState(SIN_EXPEDIENTE);
  const [facturable, setFacturable] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const fieldError = (campo: string) =>
    state && !state.ok ? state.fieldErrors?.[campo] : undefined;

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message ?? "Tiempo registrado.");
      formRef.current?.reset();
      setExpediente(SIN_EXPEDIENTE);
      setFacturable(true);
      router.refresh();
    }
  }, [state, router]);

  async function borrar(id: string) {
    setPendingId(id);
    const res = await eliminarTimeEntry(id);
    setPendingId(null);
    if (res.ok) {
      toast.success("Entrada eliminada.");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  }

  const totalMinutos = entries.reduce((acc, e) => acc + e.minutos, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Registrar tiempo</CardTitle>
          <CardDescription>Cargá las horas trabajadas en una causa.</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={action} className="space-y-5">
            {/* minutos se calcula desde horas; enviamos un hidden derivado */}
            <input
              type="hidden"
              name="expediente_id"
              value={expediente === SIN_EXPEDIENTE ? "" : expediente}
            />
            <input type="hidden" name="facturable" value={facturable ? "true" : ""} />

            {state && !state.ok && <FormError>{state.error}</FormError>}

            <Field label="Expediente">
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

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Fecha" htmlFor="fecha" error={fieldError("fecha")} required>
                <Input id="fecha" name="fecha" type="date" defaultValue={hoy} required />
              </Field>
              <Field
                label="Horas"
                htmlFor="minutos"
                error={fieldError("minutos")}
                hint="Se guarda en minutos."
                required
              >
                {/* El input expresa horas; lo convertimos a minutos al submit. */}
                <HorasInput />
              </Field>
            </div>

            <Field label="Descripción" htmlFor="descripcion" error={fieldError("descripcion")}>
              <Input
                id="descripcion"
                name="descripcion"
                placeholder="Ej.: Redacción de demanda"
              />
            </Field>

            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <Label htmlFor="facturable-switch" className="cursor-pointer text-sm">
                Facturable
              </Label>
              <Switch id="facturable-switch" checked={facturable} onCheckedChange={setFacturable} />
            </div>

            <GuardarBtn />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Entradas de tiempo</CardTitle>
            <CardDescription>Registro de horas del estudio.</CardDescription>
          </div>
          <Badge tone="primary" className="text-data">
            <Clock className="size-3.5" />
            {horas(totalMinutos)} h
          </Badge>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="Sin registros de tiempo"
              description="Empezá a cargar las horas trabajadas para llevar el control y facturarlas."
            />
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Expediente</TableHead>
                    <TableHead className="text-right">Horas</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((e) => (
                    <TableRow
                      key={e.id}
                      data-pending={pendingId === e.id || undefined}
                      className="data-[pending]:opacity-50"
                    >
                      <TableCell className="text-data whitespace-nowrap text-sm">
                        {formatFechaCorta(e.fecha)}
                      </TableCell>
                      <TableCell className="max-w-[18rem]">
                        <p className="truncate text-sm">{e.descripcion ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.usuario ?? "—"}
                          {!e.facturable && " · No facturable"}
                        </p>
                      </TableCell>
                      <TableCell className="max-w-[14rem]">
                        <span className="truncate text-xs text-muted-foreground">
                          {e.expediente ?? "Sin expediente"}
                        </span>
                      </TableCell>
                      <TableCell className="text-data text-right font-medium">
                        {horas(e.minutos)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={pendingId === e.id}
                          onClick={() => borrar(e.id)}
                          aria-label="Eliminar entrada"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/** Input de horas que escribe el valor en minutos en un campo oculto `minutos`. */
function HorasInput() {
  const [valor, setValor] = useState("");
  const minutos = Math.round((Number(valor) || 0) * 60);
  return (
    <>
      <Input
        id="minutos-horas"
        type="number"
        min={0}
        step="0.25"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Ej.: 1.5"
      />
      <input type="hidden" name="minutos" value={minutos} />
    </>
  );
}

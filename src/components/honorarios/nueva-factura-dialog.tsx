"use client";

import * as React from "react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, FileText } from "lucide-react";
import { crearFactura } from "@/lib/actions/honorarios";
import { TIPOS_COMPROBANTE } from "./opciones";
import type { ClienteOption, ExpedienteOption } from "./opciones";
import type { ActionResult } from "@/lib/actions/_base";
import { formatMoney, tempId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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

const SIN_EXPEDIENTE = "__sin_exp__";

type ItemDraft = {
  key: string;
  descripcion: string;
  cantidad: string;
  precio_unitario: string;
};

function nuevoItem(): ItemDraft {
  return { key: tempId("item"), descripcion: "", cantidad: "1", precio_unitario: "" };
}

function GuardarBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner /> : <FileText className="size-4" />}
      Crear factura
    </Button>
  );
}

export function NuevaFacturaDialog({
  clientes,
  expedientes,
}: {
  clientes: ClienteOption[];
  expedientes: ExpedienteOption[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState<ActionResult | null, FormData>(
    crearFactura,
    null,
  );

  const [cliente, setCliente] = useState("");
  const [expediente, setExpediente] = useState(SIN_EXPEDIENTE);
  const [tipo, setTipo] = useState<"A" | "B" | "C">("B");
  const [items, setItems] = useState<ItemDraft[]>([nuevoItem()]);

  const fieldError = (campo: string) =>
    state && !state.ok ? state.fieldErrors?.[campo] : undefined;

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message ?? "Factura creada.");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  useEffect(() => {
    if (!open) {
      setCliente("");
      setExpediente(SIN_EXPEDIENTE);
      setTipo("B");
      setItems([nuevoItem()]);
    }
  }, [open]);

  function actualizarItem(key: string, campo: keyof ItemDraft, valor: string) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, [campo]: valor } : it)));
  }
  function quitarItem(key: string) {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((it) => it.key !== key)));
  }

  const subtotal = items.reduce(
    (acc, it) => acc + (Number(it.cantidad) || 0) * (Number(it.precio_unitario) || 0),
    0,
  );
  const total = subtotal;

  // Payload normalizado para el server (sin keys de UI).
  const itemsPayload = JSON.stringify(
    items.map((it) => ({
      descripcion: it.descripcion,
      cantidad: Number(it.cantidad) || 0,
      precio_unitario: Number(it.precio_unitario) || 0,
    })),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Nueva factura
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva factura</DialogTitle>
          <DialogDescription>
            Se crea en estado borrador. La emisión ante ARCA/AFIP (CAE) está
            pendiente de integración.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-5">
          <input type="hidden" name="cliente_id" value={cliente} />
          <input
            type="hidden"
            name="expediente_id"
            value={expediente === SIN_EXPEDIENTE ? "" : expediente}
          />
          <input type="hidden" name="tipo_comprobante" value={tipo} />
          <input type="hidden" name="items" value={itemsPayload} />

          {state && !state.ok && <FormError>{state.error}</FormError>}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cliente" error={fieldError("cliente_id")} required>
              <Select value={cliente} onValueChange={setCliente}>
                <SelectTrigger>
                  <SelectValue placeholder="Elegí un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tipo de comprobante">
              <Select value={tipo} onValueChange={(v) => setTipo(v as "A" | "B" | "C")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_COMPROBANTE.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Ítems</Label>
              {fieldError("items") && (
                <span className="text-xs font-medium text-destructive">
                  {fieldError("items")?.[0]}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {items.map((it) => {
                const sub = (Number(it.cantidad) || 0) * (Number(it.precio_unitario) || 0);
                return (
                  <div
                    key={it.key}
                    className="flex flex-wrap items-center gap-2 sm:grid sm:grid-cols-[1fr_4.5rem_7rem_auto]"
                  >
                    <Input
                      value={it.descripcion}
                      onChange={(e) => actualizarItem(it.key, "descripcion", e.target.value)}
                      placeholder="Descripción"
                      className="basis-full sm:basis-auto"
                    />
                    <Input
                      type="number"
                      min={0}
                      step="1"
                      value={it.cantidad}
                      onChange={(e) => actualizarItem(it.key, "cantidad", e.target.value)}
                      placeholder="Cant."
                      className="w-16 flex-1 text-right sm:w-auto sm:flex-none"
                    />
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={it.precio_unitario}
                      onChange={(e) => actualizarItem(it.key, "precio_unitario", e.target.value)}
                      placeholder="Precio"
                      className="w-24 flex-1 text-right sm:w-auto sm:flex-none"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => quitarItem(it.key)}
                      disabled={items.length === 1}
                      aria-label="Quitar ítem"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                    <div className="w-full -mt-1 text-data text-right text-xs text-muted-foreground sm:col-span-4">
                      Subtotal ítem: {formatMoney(sub)}
                    </div>
                  </div>
                );
              })}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setItems((p) => [...p, nuevoItem()])}>
              <Plus className="size-4" />
              Agregar ítem
            </Button>
          </div>

          <div className="space-y-1 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-data">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>IVA</span>
              <span className="text-data">{formatMoney(0)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-1 text-base font-semibold">
              <span>Total</span>
              <span className="text-data">{formatMoney(total)}</span>
            </div>
          </div>

          <Field label="Notas" htmlFor="notas" error={fieldError("notas")}>
            <Textarea id="notas" name="notas" rows={2} placeholder="Observaciones (opcional)" />
          </Field>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <GuardarBtn />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

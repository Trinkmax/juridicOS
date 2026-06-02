"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Sparkles, Wand2, PenLine, Info } from "lucide-react";
import { asistirRedaccion } from "@/lib/actions/ia";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function AsistenteIA({
  iaActiva,
  textoActual,
  expedienteId,
  onGenerar,
  onMejorar,
}: {
  iaActiva: boolean;
  /** Texto presente en el editor (para "mejorar" y para saber si hay base). */
  textoActual: string;
  /** Expediente seleccionado → contexto para la IA. */
  expedienteId: string | null;
  /** Reemplaza todo el contenido del editor (modo generar). */
  onGenerar: (texto: string) => void;
  /** Reemplaza el contenido con la versión mejorada (modo mejorar). */
  onMejorar: (texto: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [instruccion, setInstruccion] = useState("");
  const [pending, startTransition] = useTransition();
  const hayTexto = textoActual.trim().length > 0;

  function ejecutar(modo: "generar" | "mejorar") {
    if (modo === "generar" && instruccion.trim().length === 0) {
      toast.error("Escribí una instrucción para la IA.");
      return;
    }
    startTransition(async () => {
      const res = await asistirRedaccion({
        modo,
        instruccion: instruccion.trim() || "Mejorá la redacción manteniendo el sentido.",
        textoActual: modo === "mejorar" ? textoActual : undefined,
        expedienteId,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      const texto = res.data?.texto ?? "";
      if (modo === "generar") {
        onGenerar(texto);
        toast.success("Borrador generado");
      } else {
        onMejorar(texto);
        toast.success("Texto mejorado");
      }
      setInstruccion("");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" disabled={!iaActiva} className="h-9 sm:h-8">
          <Sparkles className="size-4" />
          Asistente IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Asistente de redacción
          </DialogTitle>
          <DialogDescription>
            Describí qué necesitás. Podés generar un escrito desde cero o mejorar lo
            que ya tenés en el editor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field
            label="Instrucción"
            htmlFor="ia-instruccion"
            hint={
              expedienteId
                ? "La IA usará los datos del expediente seleccionado como contexto."
                : "Seleccioná un expediente para sumar contexto al pedido."
            }
          >
            <Textarea
              id="ia-instruccion"
              value={instruccion}
              onChange={(e) => setInstruccion(e.target.value)}
              rows={4}
              placeholder="Ej.: Redactá un escrito solicitando prórroga del plazo para contestar demanda, fundado en el art. 49 CPCC."
              disabled={pending}
            />
          </Field>

          <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            <p>
              La IA asiste; revisá y aprobá el documento. No constituye asesoramiento
              jurídico. Verificá citas, normas y datos antes de presentar.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={pending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="outline"
            onClick={() => ejecutar("mejorar")}
            disabled={pending || !hayTexto}
            title={!hayTexto ? "Escribí o cargá texto en el editor primero" : undefined}
          >
            {pending ? <Spinner /> : <Wand2 className="size-4" />}
            Mejorar lo escrito
          </Button>
          <Button type="button" onClick={() => ejecutar("generar")} disabled={pending}>
            {pending ? <Spinner /> : <PenLine className="size-4" />}
            {pending ? "Redactando…" : "Generar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

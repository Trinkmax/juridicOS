"use client";

import * as React from "react";
import { useTransition } from "react";
import {
  Sparkles,
  FileText,
  Send,
  User,
  Bot,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { resumirExpediente, responderExpediente } from "@/lib/actions/ia";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Turno = { pregunta: string; respuesta: string };

const SUGERENCIAS = [
  "¿Qué falta presentar?",
  "¿Cuáles son los próximos vencimientos?",
  "Resumí los hechos",
  "¿Hay algún riesgo procesal?",
] as const;

function ChipsSugerencias({
  onPick,
  disabled,
}: {
  onPick: (texto: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGERENCIAS.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onPick(s)}
          className={cn(
            "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground",
            "transition-colors hover:border-foreground/20 hover:bg-accent/60 hover:text-foreground",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export function AsistenteIA({
  expedienteId,
  iaActiva,
}: {
  expedienteId: string;
  iaActiva: boolean;
}) {
  const [resumen, setResumen] = React.useState<string | null>(null);
  const [resumiendo, startResumen] = useTransition();

  const [pregunta, setPregunta] = React.useState("");
  const [historial, setHistorial] = React.useState<Turno[]>([]);
  const [preguntando, startPregunta] = useTransition();

  const conversacionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    conversacionRef.current?.scrollTo({
      top: conversacionRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [historial, preguntando]);

  if (!iaActiva) {
    return (
      <Card className="flex flex-col items-center justify-center gap-4 bg-muted/40 px-6 py-16 text-center shadow-xs">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Sparkles className="size-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-display text-sm font-semibold">Asistente IA no disponible</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Configurá <code className="font-mono text-xs">ANTHROPIC_API_KEY</code> para activar
            el asistente IA.
          </p>
        </div>
      </Card>
    );
  }

  function generarResumen() {
    startResumen(async () => {
      const res = await resumirExpediente(expedienteId);
      if (res.ok) {
        setResumen(res.data?.resumen ?? "");
      } else {
        toast.error(res.error);
      }
    });
  }

  function enviarPregunta(texto: string) {
    const q = texto.trim();
    if (!q || preguntando) return;
    setPregunta("");
    startPregunta(async () => {
      const res = await responderExpediente({ expedienteId, pregunta: q });
      if (res.ok) {
        setHistorial((prev) => [...prev, { pregunta: q, respuesta: res.data?.respuesta ?? "" }]);
      } else {
        toast.error(res.error);
        setPregunta(q);
      }
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    enviarPregunta(pregunta);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      enviarPregunta(pregunta);
    }
  }

  return (
    <div className="space-y-6">
      {/* Resumen con IA */}
      <Card className="p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
              <Sparkles className="size-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-display text-base font-semibold">Copiloto de la causa</h3>
              <p className="text-sm text-muted-foreground">
                Resumí el expediente y consultá lo que necesites.
              </p>
            </div>
          </div>
          <Button onClick={generarResumen} disabled={resumiendo}>
            {resumiendo ? <Spinner /> : resumen ? <RefreshCw /> : <FileText />}
            {resumen ? "Regenerar resumen" : "Resumir causa con IA"}
          </Button>
        </div>

        {resumiendo && !resumen && (
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <Spinner />
            Analizando el expediente…
          </div>
        )}

        {resumen && (
          <div className="rounded-md border border-border bg-primary-soft/30 p-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              Resumen generado por IA
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {resumen}
            </p>
          </div>
        )}
      </Card>

      {/* Preguntas y respuestas */}
      <Card className="flex flex-col p-6 shadow-xs">
        <div className="mb-4 space-y-0.5">
          <h3 className="font-display text-base font-semibold">Preguntale al expediente</h3>
          <p className="text-sm text-muted-foreground">
            Respondo según los datos cargados de la causa.
          </p>
        </div>

        {/* Conversación */}
        {(historial.length > 0 || preguntando) && (
          <div
            ref={conversacionRef}
            className="mb-4 max-h-[28rem] space-y-4 overflow-y-auto pr-1"
          >
            {historial.map((t, i) => (
              <div key={i} className="space-y-3">
                {/* Pregunta del usuario */}
                <div className="flex justify-end gap-2">
                  <div className="max-w-[80%] rounded-lg rounded-tr-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                    {t.pregunta}
                  </div>
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <User className="size-3.5" />
                  </div>
                </div>
                {/* Respuesta de la IA */}
                <div className="flex justify-start gap-2">
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-foreground">
                    <Bot className="size-3.5" />
                  </div>
                  <div className="max-w-[80%] whitespace-pre-wrap rounded-lg rounded-tl-sm border border-border bg-card px-3.5 py-2 text-sm leading-relaxed text-foreground">
                    {t.respuesta}
                  </div>
                </div>
              </div>
            ))}

            {preguntando && (
              <div className="flex justify-start gap-2">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-foreground">
                  <Bot className="size-3.5" />
                </div>
                <div className="flex items-center gap-2 rounded-lg rounded-tl-sm border border-border bg-card px-3.5 py-2 text-sm text-muted-foreground">
                  <Spinner />
                  Pensando…
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sugerencias */}
        {historial.length === 0 && !preguntando && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Probá preguntar</p>
            <ChipsSugerencias onPick={(t) => enviarPregunta(t)} disabled={preguntando} />
          </div>
        )}

        {/* Input */}
        <form onSubmit={onSubmit} className="space-y-2">
          <Textarea
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribí tu pregunta sobre el expediente…"
            rows={2}
            disabled={preguntando}
            className="resize-none"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            {historial.length > 0 && (
              <ChipsSugerencias onPick={(t) => enviarPregunta(t)} disabled={preguntando} />
            )}
            <Button
              type="submit"
              size="sm"
              disabled={preguntando || !pregunta.trim()}
              className="ml-auto"
            >
              {preguntando ? <Spinner /> : <Send />}
              Preguntar
            </Button>
          </div>
        </form>

        <Separator className="my-4" />
        <p className="text-xs text-muted-foreground">
          La IA responde según los datos cargados del expediente; verificá siempre.
        </p>
      </Card>
    </div>
  );
}

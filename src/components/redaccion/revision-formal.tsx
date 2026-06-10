"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  ClipboardCheck,
  CircleCheck,
  CircleAlert,
  CircleHelp,
  CircleMinus,
  RefreshCw,
  Info,
} from "lucide-react";
import { revisarEscrito, type RevisionEscrito } from "@/lib/actions/ia";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ESTADO_UI = {
  ok: { icon: CircleCheck, clase: "text-success", label: "OK" },
  falta: { icon: CircleAlert, clase: "text-destructive", label: "Falta" },
  revisar: { icon: CircleHelp, clase: "text-warning", label: "Revisar" },
  no_aplica: { icon: CircleMinus, clase: "text-muted-foreground", label: "No aplica" },
} as const;

/**
 * Control formal del escrito antes de presentar: la IA actúa como mesa de
 * entradas (checklist de requisitos), el abogado decide. Solo lectura: nunca
 * modifica el texto del editor.
 */
export function RevisionFormal({
  iaActiva,
  texto,
  expedienteId,
}: {
  iaActiva: boolean;
  texto: string;
  expedienteId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [revision, setRevision] = useState<RevisionEscrito | null>(null);
  const [pending, startTransition] = useTransition();
  const hayTexto = texto.trim().length >= 40;

  function revisar() {
    startTransition(async () => {
      const res = await revisarEscrito({ texto, expedienteId });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setRevision(res.data?.revision ?? null);
    });
  }

  function alAbrir(v: boolean) {
    setOpen(v);
    if (v && !pending) {
      setRevision(null);
      revisar();
    }
  }

  return (
    <Dialog open={open} onOpenChange={alAbrir}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!iaActiva || !hayTexto}
          className="h-9 sm:h-8"
          title={
            !iaActiva
              ? "Configurá la IA para usar la revisión formal"
              : !hayTexto
                ? "Escribí el escrito primero"
                : "Checklist formal antes de presentar"
          }
        >
          <ClipboardCheck className="size-4" />
          Revisión formal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88dvh] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="size-4 text-primary" />
            Revisión formal del escrito
          </DialogTitle>
          <DialogDescription>
            Control de requisitos de presentación, como en mesa de entradas. No
            modifica tu texto.
          </DialogDescription>
        </DialogHeader>

        {pending ? (
          <div className="flex flex-col items-center gap-3 py-10 text-sm text-muted-foreground">
            <Spinner />
            Revisando estructura, citas y pendientes…
          </div>
        ) : revision ? (
          <ScrollArea className="-mx-1 max-h-[58dvh] px-1">
            <div className="space-y-4 pb-1">
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3">
                <Badge tone={revision.apto_para_presentar ? "success" : "warning"}>
                  {revision.apto_para_presentar ? "Sin observaciones de forma" : "Con observaciones"}
                </Badge>
                <p className="flex-1 text-sm leading-relaxed">{revision.resumen}</p>
              </div>

              <ul className="space-y-1.5">
                {revision.checklist.map((item, i) => {
                  const ui = ESTADO_UI[item.estado] ?? ESTADO_UI.revisar;
                  const Icono = ui.icon;
                  return (
                    <li key={i} className="flex items-start gap-2.5 rounded-md px-1 py-1 text-sm">
                      <Icono className={`mt-0.5 size-4 shrink-0 ${ui.clase}`} />
                      <div className="min-w-0">
                        <span className="font-medium">{item.requisito}</span>
                        {item.detalle && (
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {item.detalle}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {revision.datos_pendientes.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Datos pendientes ({revision.datos_pendientes.length})
                  </p>
                  <ul className="space-y-1">
                    {revision.datos_pendientes.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-warning" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {revision.citas_a_verificar.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Citas a verificar por el letrado
                  </p>
                  <ul className="space-y-1">
                    {revision.citas_a_verificar.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CircleHelp className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                <p>
                  La revisión es asistencia de IA, no dictamen: el control final y la
                  firma son del letrado.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={revisar}>
                  <RefreshCw className="size-4" />
                  Revisar de nuevo
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No pudimos obtener la revisión.{" "}
            <button type="button" className="underline" onClick={revisar}>
              Reintentar
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import Link from "next/link";
import { CalendarClock, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PlazoUrgenciaBadge, plazoTono } from "@/components/shared/plazo-badge";
import { formatFecha, capitalizar } from "@/lib/format";
import { MODALIDAD_PLAZO, TONE_BORDER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PlazoDetalle } from "@/lib/types/domain";

/** Lista de plazos del expediente (lectura). El alta vive en la calculadora. */
export function PlazosPanel({
  expedienteId,
  plazos,
}: {
  expedienteId: string;
  plazos: PlazoDetalle[];
}) {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-semibold">Plazos</h3>
          <p className="text-sm text-muted-foreground">
            {plazos.length} {plazos.length === 1 ? "plazo asociado" : "plazos asociados"}
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href={`/plazos/calculadora?expediente=${expedienteId}`}>
            <Plus />
            Agregar plazo
          </Link>
        </Button>
      </div>

      {plazos.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="Sin plazos calculados"
          description="Usá la calculadora para computar vencimientos hábiles y corridos de esta causa."
          action={
            <Button asChild>
              <Link href={`/plazos/calculadora?expediente=${expedienteId}`}>
                <Plus />
                Calcular un plazo
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {plazos.map((p) => {
            const estado = p.estado ?? "pendiente";
            const tono = plazoTono(p.dias_restantes, estado);
            const modalidad = p.modalidad ? MODALIDAD_PLAZO[p.modalidad] : null;
            return (
              <div
                key={p.id ?? p.acto_procesal ?? Math.random()}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-md border border-border border-l-4 bg-card p-4 transition-colors hover:bg-accent/40",
                  TONE_BORDER[tono],
                )}
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-medium leading-snug">
                    {p.acto_procesal ?? "Plazo procesal"}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    {p.fecha_vencimiento && (
                      <span>Vence: {capitalizar(formatFecha(p.fecha_vencimiento))}</span>
                    )}
                    {p.dias != null && modalidad && (
                      <span>
                        {p.dias} {modalidad.label.toLowerCase()}
                      </span>
                    )}
                  </div>
                  {p.descripcion && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{p.descripcion}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <PlazoUrgenciaBadge
                    diasRestantes={p.dias_restantes}
                    estado={estado}
                    fechaVencimiento={p.fecha_vencimiento}
                  />
                  {modalidad && (
                    <Badge tone="muted" className="text-[0.7rem]">
                      {modalidad.label}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

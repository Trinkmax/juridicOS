import Link from "next/link";
import { FileText } from "lucide-react";
import type { PlazoDetalle } from "@/lib/types/domain";
import { TONE_BORDER, FUERO, PRIORIDAD, type EstadoPlazo } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { OptionBadge } from "@/components/ui/status-badge";
import { PlazoUrgenciaBadge, plazoTono } from "@/components/shared/plazo-badge";
import { PlazoAcciones } from "@/components/plazos/plazo-acciones";
import { CumplirRapido } from "@/components/plazos/cumplir-rapido";

export function PlazoCard({
  plazo,
  quickAction = false,
}: {
  plazo: PlazoDetalle;
  /** Muestra el botón rápido "Cumplir" (tablero de triaje) en plazos pendientes. */
  quickAction?: boolean;
}) {
  const estado = (plazo.estado ?? "pendiente") as EstadoPlazo;
  const dr = plazo.dias_restantes ?? null;
  const tono = plazoTono(dr, estado);

  return (
    <Card
      className={cn(
        "border-l-[3px] p-4 shadow-xs transition-colors hover:border-foreground/20",
        TONE_BORDER[tono],
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-sm font-semibold leading-snug">
              {plazo.acto_procesal ?? "Plazo procesal"}
            </h3>
            <PlazoUrgenciaBadge
              diasRestantes={dr}
              estado={estado}
              fechaVencimiento={plazo.fecha_vencimiento}
            />
            {plazo.prioridad && estado === "pendiente" && (
              <OptionBadge option={PRIORIDAD[plazo.prioridad]} />
            )}
          </div>

          {plazo.descripcion && (
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {plazo.descripcion}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
            {plazo.expediente_id && plazo.caratula && (
              <Link
                href={`/expedientes/${plazo.expediente_id}`}
                className="inline-flex items-center gap-1.5 font-medium text-foreground/80 transition-colors hover:text-primary hover:underline"
              >
                <FileText className="size-3.5" />
                <span className="max-w-[24rem] truncate">{plazo.caratula}</span>
              </Link>
            )}
            {plazo.fuero && <OptionBadge option={FUERO[plazo.fuero]} />}
            {plazo.nro_sac && (
              <span className="inline-flex items-center gap-1">
                SAC <span className="text-data text-foreground/70">{plazo.nro_sac}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {plazo.responsable_id && (
            <Avatar
              name={plazo.responsable_nombre}
              src={plazo.responsable_avatar}
              size="sm"
            />
          )}
          {quickAction && estado === "pendiente" && plazo.id && (
            <CumplirRapido id={plazo.id} />
          )}
          {plazo.id && <PlazoAcciones plazo={plazo} />}
        </div>
      </div>
    </Card>
  );
}

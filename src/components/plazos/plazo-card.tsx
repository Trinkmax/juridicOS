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

export function PlazoCard({ plazo }: { plazo: PlazoDetalle }) {
  const estado = (plazo.estado ?? "pendiente") as EstadoPlazo;
  const dr = plazo.dias_restantes ?? null;
  const tono = plazoTono(dr, estado);

  return (
    <Card
      className={cn(
        "border-l-4 p-4 transition-colors hover:border-foreground/20",
        TONE_BORDER[tono],
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">
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
            <p className="text-sm text-muted-foreground line-clamp-2">
              {plazo.descripcion}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {plazo.expediente_id && plazo.caratula && (
              <Link
                href={`/expedientes/${plazo.expediente_id}`}
                className="inline-flex items-center gap-1.5 font-medium text-foreground/80 hover:text-primary hover:underline"
              >
                <FileText className="size-3.5" />
                <span className="max-w-[24rem] truncate">{plazo.caratula}</span>
              </Link>
            )}
            {plazo.fuero && <OptionBadge option={FUERO[plazo.fuero]} />}
            {plazo.nro_sac && <span className="text-data">SAC {plazo.nro_sac}</span>}
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
          {plazo.id && <PlazoAcciones id={plazo.id} estado={estado} />}
        </div>
      </div>
    </Card>
  );
}

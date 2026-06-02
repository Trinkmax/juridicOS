import Link from "next/link";
import { CalendarDays, Plus, MapPin, Video, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatFecha, formatHora, capitalizar } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Audiencia } from "@/lib/types/domain";
import type { Tone } from "@/lib/constants";

const ESTADO_AUDIENCIA: Record<string, { label: string; tone: Tone }> = {
  programada: { label: "Programada", tone: "info" },
  confirmada: { label: "Confirmada", tone: "primary" },
  realizada: { label: "Realizada", tone: "success" },
  suspendida: { label: "Suspendida", tone: "warning" },
  cancelada: { label: "Cancelada", tone: "muted" },
};

function estadoBadge(estado: string) {
  return (
    ESTADO_AUDIENCIA[estado] ?? { label: capitalizar(estado), tone: "default" as Tone }
  );
}

const ES_VIRTUAL = new Set(["virtual", "remota", "videollamada", "online"]);

/** Lista de audiencias del expediente (lectura). Agendar va a /agenda. */
export function AudienciasPanel({
  expedienteId,
  audiencias,
}: {
  expedienteId: string;
  audiencias: Audiencia[];
}) {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">Audiencias</h3>
          <p className="text-sm text-muted-foreground">
            {audiencias.length}{" "}
            {audiencias.length === 1 ? "audiencia agendada" : "audiencias agendadas"}
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href={`/agenda?expediente=${expedienteId}&nueva=1`}>
            <Plus />
            Agendar
          </Link>
        </Button>
      </div>

      {audiencias.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Sin audiencias"
          description="Agendá audiencias, comparendos y mediaciones de esta causa."
          action={
            <Button asChild>
              <Link href={`/agenda?expediente=${expedienteId}&nueva=1`}>
                <Plus />
                Agendar audiencia
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {audiencias.map((a) => {
            const est = estadoBadge(a.estado);
            const virtual = ES_VIRTUAL.has(a.modalidad?.toLowerCase());
            return (
              <div
                key={a.id}
                className="flex items-start gap-3 rounded-lg border border-border/70 bg-card p-4 transition-all hover:shadow-sm"
              >
                <div className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-muted/60 py-1.5 text-center">
                  <span className="text-[0.7rem] font-medium uppercase text-muted-foreground">
                    {formatFecha(a.fecha_hora, "MMM")}
                  </span>
                  <span className="text-lg font-semibold leading-none">
                    {formatFecha(a.fecha_hora, "d")}
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{a.titulo}</span>
                    <Badge tone={est.tone}>{est.label}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>
                      {capitalizar(formatFecha(a.fecha_hora))} · {formatHora(a.fecha_hora)}
                    </span>
                    {a.tipo && <span>{capitalizar(a.tipo)}</span>}
                    <span className="inline-flex items-center gap-1">
                      {virtual ? <Video className="size-3" /> : <MapPin className="size-3" />}
                      {capitalizar(a.modalidad)}
                    </span>
                  </div>
                  {a.lugar && <p className="text-xs text-muted-foreground">{a.lugar}</p>}
                  {a.enlace && (
                    <a
                      href={a.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline",
                      )}
                    >
                      <ExternalLink className="size-3" />
                      Enlace de la audiencia
                    </a>
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

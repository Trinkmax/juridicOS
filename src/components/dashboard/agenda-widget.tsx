import Link from "next/link";
import { CalendarDays, MapPin, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatFechaHora, capitalizar } from "@/lib/format";
import type { Audiencia } from "@/lib/types/domain";

/** Audiencia row joined with its expediente caratula (to-one join). */
export type AudienciaConExpediente = Audiencia & {
  expedientes: { caratula: string | null } | null;
};

/**
 * Right rail: upcoming scheduled hearings for the week.
 * Each item shows the moment, title, type and the linked expediente.
 */
export function AgendaWidget({ audiencias }: { audiencias: AudienciaConExpediente[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          Agenda de la semana
        </CardTitle>
        {audiencias.length > 0 && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/agenda">Ver agenda</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {audiencias.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Sin audiencias próximas"
            description="No tenés audiencias programadas para los próximos días."
            className="py-8"
          />
        ) : (
          <ul className="flex flex-col gap-2.5">
            {audiencias.map((a) => {
              const remoto = a.modalidad === "virtual" || a.modalidad === "remota";
              const LugarIcon = remoto ? Video : MapPin;
              const lugar = remoto ? "Virtual" : a.lugar || a.juzgado;
              return (
                <li
                  key={a.id}
                  className="group rounded-lg border border-border/60 bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium tabular-nums text-primary">
                      {capitalizar(formatFechaHora(a.fecha_hora))}
                    </span>
                    {a.tipo && (
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[0.6875rem] font-medium text-muted-foreground">
                        {capitalizar(a.tipo)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm font-medium leading-tight">
                    {a.titulo}
                  </p>
                  {a.expedientes?.caratula && (
                    <Link
                      href={`/expedientes/${a.expediente_id}`}
                      className="mt-0.5 block truncate text-xs text-muted-foreground transition-colors hover:text-primary"
                    >
                      {a.expedientes.caratula}
                    </Link>
                  )}
                  {lugar && (
                    <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                      <LugarIcon className="size-3 shrink-0" />
                      <span className="truncate">{lugar}</span>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

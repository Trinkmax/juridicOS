"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { EventoDetalle } from "@/components/agenda/evento-detalle";
import type { AgendaItem } from "@/components/agenda/tipos";
import { formatFechaHora, capitalizar } from "@/lib/format";
import type { Audiencia } from "@/lib/types/domain";

/** Audiencia row joined with its expediente caratula (to-one join). */
export type AudienciaConExpediente = Audiencia & {
  expedientes: { caratula: string | null } | null;
};

/** Mapea una audiencia del dashboard al ítem unificado de agenda para el popover. */
function audienciaToItem(a: AudienciaConExpediente): AgendaItem {
  return {
    id: a.id,
    fecha: a.fecha_hora,
    hora: a.fecha_hora,
    tipo: "audiencia",
    titulo: a.titulo,
    expedienteId: a.expediente_id,
    expediente: a.expedientes?.caratula ?? null,
    modalidadAud: a.modalidad,
    lugar: a.lugar,
    juzgado: a.juzgado,
    enlace: a.enlace,
    duracionMin: a.duracion_min,
  };
}

/**
 * Right rail: upcoming scheduled hearings for the week.
 * Each row opens the elegant agenda popover (Dialog + EventoDetalle).
 */
export function AgendaWidget({ audiencias }: { audiencias: AudienciaConExpediente[] }) {
  const [sel, setSel] = React.useState<AgendaItem | null>(null);

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
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setSel(audienciaToItem(a))}
                    className="group w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-foreground/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium tabular-nums text-primary">
                        {capitalizar(formatFechaHora(a.fecha_hora))}
                      </span>
                      {a.tipo && (
                        <span className="shrink-0 rounded-sm bg-muted px-2 py-0.5 text-[0.6875rem] font-medium text-muted-foreground">
                          {capitalizar(a.tipo)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm font-medium leading-tight">
                      {a.titulo}
                    </p>
                    {a.expedientes?.caratula && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {a.expedientes.caratula}
                      </p>
                    )}
                    {lugar && (
                      <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                        <LugarIcon className="size-3 shrink-0" />
                        <span className="truncate">{lugar}</span>
                      </p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>

      <Dialog
        open={!!sel}
        onOpenChange={(o) => {
          if (!o) setSel(null);
        }}
      >
        <DialogContent className="max-w-lg">
          {sel && <EventoDetalle item={sel} />}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

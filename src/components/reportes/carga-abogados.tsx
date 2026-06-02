"use client";

import { CalendarClock, CheckSquare, Clock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CHART_COLORS } from "./chart-theme";

export type CargaAbogado = {
  usuarioId: string;
  nombre: string;
  avatarUrl: string | null;
  plazosPendientes: number;
  tareasActivas: number;
  horas: number;
};

/** Formatea horas con 1 decimal cuando hace falta: 12 / 12,5 hs. */
function formatHoras(h: number): string {
  const r = Math.round(h * 10) / 10;
  return `${Number.isInteger(r) ? r : r.toFixed(1).replace(".", ",")} hs`;
}

function Metrica({
  icon: Icon,
  value,
  color,
  label,
}: {
  icon: typeof CalendarClock;
  value: string | number;
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5" title={label}>
      <Icon className="size-3.5 shrink-0" style={{ color }} />
      <span className="text-data text-sm font-semibold">{value}</span>
    </div>
  );
}

export function CargaAbogados({ data }: { data: CargaAbogado[] }) {
  // Escala las barras de carga relativa (plazos + tareas) contra el máximo.
  const maxCarga = Math.max(1, ...data.map((d) => d.plazosPendientes + d.tareasActivas));

  return (
    <div className="flex flex-col gap-2.5">
      {data.map((a) => {
        const carga = a.plazosPendientes + a.tareasActivas;
        const pct = Math.round((carga / maxCarga) * 100);
        return (
          <div
            key={a.usuarioId}
            className={cn(
              "rounded-lg border border-border bg-card p-4",
              "transition-colors hover:border-foreground/20",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar name={a.nombre} src={a.avatarUrl} size="sm" />
                <span className="truncate text-sm font-medium">{a.nombre}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3.5">
                <Metrica
                  icon={CalendarClock}
                  value={a.plazosPendientes}
                  color={CHART_COLORS.warning}
                  label="Plazos pendientes"
                />
                <Metrica
                  icon={CheckSquare}
                  value={a.tareasActivas}
                  color={CHART_COLORS.info}
                  label="Tareas activas"
                />
                <Metrica
                  icon={Clock}
                  value={formatHoras(a.horas)}
                  color={CHART_COLORS.success}
                  label="Horas registradas"
                />
              </div>
            </div>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-sm bg-muted">
              <div
                className="h-full rounded-sm transition-all"
                style={{
                  width: `${Math.max(pct, carga > 0 ? 6 : 0)}%`,
                  background: CHART_COLORS.primary,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

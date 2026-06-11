import Link from "next/link";
import { CalendarClock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { PlazoUrgenciaBadge, plazoTono } from "@/components/shared/plazo-badge";
import { TONE_BORDER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PlazoDetalle } from "@/lib/types/domain";

/**
 * Left column hero: the next pending deadlines, sorted by urgency.
 * Color language is sacred — accent border + PlazoUrgenciaBadge carry the tone.
 */
export function VencimientosList({ plazos }: { plazos: PlazoDetalle[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="size-4 text-primary" />
          Próximos vencimientos
        </CardTitle>
        {plazos.length > 0 && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/plazos">Ver todos</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {plazos.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No tenés plazos pendientes"
            description="Cuando calcules un plazo procesal, los próximos vencimientos van a aparecer acá."
            action={
              <Button asChild>
                <Link href="/plazos/calculadora">Calcular un plazo</Link>
              </Button>
            }
            className="py-10"
          />
        ) : (
          <ul className="flex max-h-80 flex-col overflow-y-auto overscroll-contain">
            {plazos.map((p) => {
              const dias = p.dias_restantes ?? null;
              return (
                <li
                  key={p.id ?? `${p.acto_procesal}-${p.fecha_vencimiento}`}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 transition-colors hover:bg-accent/60",
                    TONE_BORDER[plazoTono(dias, "pendiente")],
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">
                      {p.acto_procesal ?? "Plazo procesal"}
                    </p>
                    {p.caratula && p.expediente_id ? (
                      <Link
                        href={`/expedientes/${p.expediente_id}`}
                        className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground transition-colors hover:text-primary"
                      >
                        <FileText className="size-3 shrink-0" />
                        <span className="truncate">{p.caratula}</span>
                      </Link>
                    ) : (
                      p.cliente_nombre && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {p.cliente_nombre}
                        </p>
                      )
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    <PlazoUrgenciaBadge
                      diasRestantes={dias}
                      estado="pendiente"
                      fechaVencimiento={p.fecha_vencimiento}
                    />
                    {p.responsable_nombre && (
                      <Avatar
                        name={p.responsable_nombre}
                        src={p.responsable_avatar}
                        size="xs"
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

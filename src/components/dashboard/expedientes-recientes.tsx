import Link from "next/link";
import { FolderOpen, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { OptionBadge } from "@/components/ui/status-badge";
import { FUERO } from "@/lib/constants";
import type { Expediente } from "@/lib/types/domain";

/** Expediente row joined with its cliente nombre (to-one join). */
export type ExpedienteConCliente = Expediente & {
  clientes: { nombre: string | null } | null;
};

/**
 * Right rail: most recently touched expedientes — caratula + fuero + cliente.
 */
export function ExpedientesRecientes({
  expedientes,
}: {
  expedientes: ExpedienteConCliente[];
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="size-4 text-primary" />
          Expedientes recientes
        </CardTitle>
        {expedientes.length > 0 && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/expedientes">Ver todos</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {expedientes.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="Todavía no hay expedientes"
            description="Creá tu primer expediente para empezar a gestionar la causa."
            action={
              <Button asChild>
                <Link href="/expedientes/nuevo">Nuevo expediente</Link>
              </Button>
            }
            className="py-8"
          />
        ) : (
          <ul className="-mx-2 flex flex-col">
            {expedientes.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/expedientes/${e.id}`}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/60"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">
                      {e.caratula}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <OptionBadge option={FUERO[e.fuero]} />
                      {e.clientes?.nombre && (
                        <span className="truncate text-xs text-muted-foreground">
                          {e.clientes.nombre}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

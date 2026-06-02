import { Users } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { initials } from "@/lib/utils";

export type CuentaCliente = {
  clienteId: string;
  nombre: string;
  honorariosPendientes: number;
  facturasEmitidas: number;
  facturasPagadas: number;
  adeudado: number;
};

/**
 * Resumen por cliente del total adeudado: honorarios pendientes/facturados
 * + facturas emitidas (no pagadas/anuladas).
 */
export function EstadoCuenta({ cuentas }: { cuentas: CuentaCliente[] }) {
  if (cuentas.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Sin movimientos por cliente"
        description="Cuando registres honorarios o facturas asociados a un cliente, vas a ver acá su estado de cuenta."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cuentas.map((c) => (
        <Card key={c.clienteId} className="transition-colors hover:border-foreground/20">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                {initials(c.nombre)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{c.nombre}</p>
                <p className="text-xs text-muted-foreground">Estado de cuenta</p>
              </div>
              <Badge tone={c.adeudado > 0 ? "warning" : "success"} className="ml-auto">
                {c.adeudado > 0 ? "Con saldo" : "Al día"}
              </Badge>
            </div>

            <dl className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Honorarios pendientes</dt>
                <dd className="text-data">{formatMoney(c.honorariosPendientes)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Facturas emitidas (impagas)</dt>
                <dd className="text-data">{formatMoney(c.facturasEmitidas)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Facturas pagadas</dt>
                <dd className="text-data text-success">{formatMoney(c.facturasPagadas)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-1.5 font-semibold">
                <dt>Total adeudado</dt>
                <dd className="text-data">{formatMoney(c.adeudado)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

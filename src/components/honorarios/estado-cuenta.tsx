import { Users } from "lucide-react";
import { formatMoney, initials } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export type CuentaCliente = {
  clienteId: string;
  nombre: string;
  honorariosPendientes: number;
  facturasEmitidas: number;
  facturasPagadas: number;
  adeudado: number;
};

/** Porcentaje seguro de `part` sobre `total` (0 si total ≤ 0). */
function pct(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (part / total) * 100));
}

/**
 * Estado de cuenta visual: resumen global (facturado vs cobrado vs pendiente)
 * con barra proporcional apilada, y tarjetas por cliente con barra de progreso
 * de cobro. El resumen global se deriva de las cuentas recibidas.
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

  /* ── Resumen global (derivado de las cuentas) ───────────────── */
  const totalPagado = cuentas.reduce((acc, c) => acc + c.facturasPagadas, 0);
  const totalEmitido = cuentas.reduce((acc, c) => acc + c.facturasEmitidas, 0);
  const totalPorFacturar = cuentas.reduce((acc, c) => acc + c.honorariosPendientes, 0);
  const totalAdeudado = cuentas.reduce((acc, c) => acc + c.adeudado, 0);
  const granTotal = totalPagado + totalAdeudado;

  // Las cuentas ya vienen ordenadas por adeudado DESC desde el page; reordenamos
  // de forma defensiva para que la garantía sea local a este componente.
  const ordenadas = [...cuentas].sort((a, b) => b.adeudado - a.adeudado);

  const cifras = [
    { label: "Cobrado", value: totalPagado, valueClass: "text-success", dot: "bg-success" },
    {
      label: "Por cobrar (emitido)",
      value: totalEmitido,
      valueClass: "text-warning-foreground",
      dot: "bg-warning",
    },
    {
      label: "Por facturar",
      value: totalPorFacturar,
      valueClass: "text-muted-foreground",
      dot: "bg-muted-foreground/40",
    },
    {
      label: "Adeudado total",
      value: totalAdeudado,
      valueClass: "text-foreground",
      dot: "bg-foreground/60",
    },
  ];

  const segmentos = [
    { label: "Cobrado", value: totalPagado, bar: "bg-success" },
    { label: "Emitido", value: totalEmitido, bar: "bg-warning" },
    { label: "Por facturar", value: totalPorFacturar, bar: "bg-muted-foreground/40" },
  ];

  return (
    <div className="space-y-5">
      {/* ── Resumen global ───────────────────────────────────────── */}
      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[1.0625rem] font-semibold leading-snug">
              Resumen general
            </h3>
            <span className="text-data text-xs text-muted-foreground">
              {formatMoney(granTotal)} total
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
            {cifras.map((c) => (
              <div key={c.label} className="space-y-1">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`size-1.5 shrink-0 rounded-full ${c.dot}`} aria-hidden />
                  {c.label}
                </dt>
                <dd className={`font-display text-data text-2xl font-semibold tracking-tight ${c.valueClass}`}>
                  {formatMoney(c.value)}
                </dd>
              </div>
            ))}
          </dl>

          {/* Barra proporcional apilada sobre granTotal */}
          {granTotal > 0 ? (
            <div className="space-y-2">
              <div
                className="flex h-2.5 w-full overflow-hidden rounded-sm bg-muted"
                role="img"
                aria-label={`Cobrado ${formatMoney(totalPagado)}, por cobrar emitido ${formatMoney(
                  totalEmitido,
                )}, por facturar ${formatMoney(totalPorFacturar)}`}
              >
                {segmentos.map((s) =>
                  s.value > 0 ? (
                    <div
                      key={s.label}
                      className={s.bar}
                      style={{ width: `${pct(s.value, granTotal)}%` }}
                    />
                  ) : null,
                )}
              </div>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {segmentos.map((s) => (
                  <li key={s.label} className="flex items-center gap-1.5">
                    <span className={`size-1.5 shrink-0 rounded-full ${s.bar}`} aria-hidden />
                    <span>{s.label}</span>
                    <span className="text-data text-foreground">
                      {Math.round(pct(s.value, granTotal))}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* ── Tarjetas por cliente ─────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2">
        {ordenadas.map((c) => {
          const baseCobro = c.facturasPagadas + c.adeudado;
          const cobroPct = baseCobro <= 0 ? 100 : pct(c.facturasPagadas, baseCobro);
          const conSaldo = c.adeudado > 0;

          return (
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
                  <Badge tone={conSaldo ? "warning" : "success"} className="ml-auto">
                    {conSaldo ? "Con saldo" : "Al día"}
                  </Badge>
                </div>

                {/* Barra de progreso de cobro */}
                <div className="space-y-1.5">
                  <div
                    className="h-2 w-full overflow-hidden rounded-sm bg-muted"
                    role="img"
                    aria-label={`Cobro: ${Math.round(cobroPct)}% (${formatMoney(
                      c.facturasPagadas,
                    )} de ${formatMoney(baseCobro)})`}
                  >
                    <div
                      className="h-full rounded-sm bg-success transition-[width] duration-500 ease-out"
                      style={{ width: `${cobroPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Cobrado</span>
                    <span className="text-data">{Math.round(cobroPct)}%</span>
                  </div>
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
          );
        })}
      </div>
    </div>
  );
}

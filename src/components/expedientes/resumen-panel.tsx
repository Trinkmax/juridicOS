import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { OptionBadge } from "@/components/ui/status-badge";
import { formatFecha, capitalizar } from "@/lib/format";
import { formatMoney } from "@/lib/utils";
import { TIPO_PARTE } from "@/lib/constants";
import type { Expediente } from "@/lib/types/domain";

type ClienteMin = { id: string; nombre: string } | null;

function Dato({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <Card className="p-4">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}

export function ResumenPanel({
  expediente,
  cliente,
  stats,
}: {
  expediente: Expediente;
  cliente: ClienteMin;
  stats: { partes: number; movimientos: number; plazos: number; audiencias: number };
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat value={stats.partes} label="Partes" />
        <MiniStat value={stats.movimientos} label="Movimientos" />
        <MiniStat value={stats.plazos} label="Plazos" />
        <MiniStat value={stats.audiencias} label="Audiencias" />
      </div>

      <Card className="p-5">
        <h3 className="mb-4 text-base font-semibold">Datos de la causa</h3>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <Dato label="Materia">{expediente.materia ?? "—"}</Dato>
          <Dato label="Jurisdicción">{capitalizar(expediente.jurisdiccion) || "—"}</Dato>
          <Dato label="Etapa procesal">{expediente.etapa ?? "—"}</Dato>
          <Dato label="Juzgado">{expediente.juzgado ?? "—"}</Dato>
          <Dato label="Secretaría">{expediente.secretaria ?? "—"}</Dato>
          <Dato label="Fecha de inicio">{formatFecha(expediente.fecha_inicio)}</Dato>
          <Dato label="Cliente">
            {cliente ? (
              <Link
                href={`/clientes/${cliente.id}`}
                className="text-primary hover:underline underline-offset-4"
              >
                {cliente.nombre}
              </Link>
            ) : (
              "—"
            )}
          </Dato>
          <Dato label="Carácter del cliente">
            {expediente.caracter_cliente ? (
              <OptionBadge option={TIPO_PARTE[expediente.caracter_cliente]} />
            ) : (
              "—"
            )}
          </Dato>
          <Dato label="Monto reclamado">
            {expediente.monto_reclamado != null
              ? formatMoney(expediente.monto_reclamado)
              : "—"}
          </Dato>
        </dl>
      </Card>

      {expediente.observaciones && (
        <Card className="p-5">
          <h3 className="mb-2 text-base font-semibold">Observaciones</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {expediente.observaciones}
          </p>
        </Card>
      )}
    </div>
  );
}

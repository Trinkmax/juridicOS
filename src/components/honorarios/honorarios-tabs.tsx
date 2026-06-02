"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NuevoHonorarioDialog } from "./nuevo-honorario-dialog";
import { NuevaFacturaDialog } from "./nueva-factura-dialog";
import { HonorariosTabla, type HonorarioRow } from "./honorarios-tabla";
import { TimeTrackingPanel, type TimeEntryRow } from "./time-tracking-panel";
import { FacturasTabla, type FacturaRow } from "./facturas-tabla";
import { EstadoCuenta, type CuentaCliente } from "./estado-cuenta";
import type { ClienteOption, ExpedienteOption } from "./opciones";

export function HonorariosTabs({
  honorarios,
  entries,
  facturas,
  cuentas,
  clientes,
  expedientes,
  valorJus,
}: {
  honorarios: HonorarioRow[];
  entries: TimeEntryRow[];
  facturas: FacturaRow[];
  cuentas: CuentaCliente[];
  clientes: ClienteOption[];
  expedientes: ExpedienteOption[];
  valorJus: number;
}) {
  return (
    <Tabs defaultValue="honorarios" className="space-y-5">
      <TabsList>
        <TabsTrigger value="honorarios">Honorarios</TabsTrigger>
        <TabsTrigger value="tiempo">Registro de tiempo</TabsTrigger>
        <TabsTrigger value="facturas">Facturas</TabsTrigger>
        <TabsTrigger value="cuenta">Estado de cuenta</TabsTrigger>
      </TabsList>

      <TabsContent value="honorarios" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {honorarios.length} honorario{honorarios.length === 1 ? "" : "s"} registrado
            {honorarios.length === 1 ? "" : "s"}.
          </p>
          <NuevoHonorarioDialog
            clientes={clientes}
            expedientes={expedientes}
            valorJus={valorJus}
          />
        </div>
        <HonorariosTabla honorarios={honorarios} />
      </TabsContent>

      <TabsContent value="tiempo">
        <TimeTrackingPanel entries={entries} expedientes={expedientes} />
      </TabsContent>

      <TabsContent value="facturas" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {facturas.length} factura{facturas.length === 1 ? "" : "s"} registrada
            {facturas.length === 1 ? "" : "s"}.
          </p>
          <NuevaFacturaDialog clientes={clientes} expedientes={expedientes} />
        </div>
        <FacturasTabla facturas={facturas} />
      </TabsContent>

      <TabsContent value="cuenta">
        <EstadoCuenta cuentas={cuentas} />
      </TabsContent>
    </Tabs>
  );
}

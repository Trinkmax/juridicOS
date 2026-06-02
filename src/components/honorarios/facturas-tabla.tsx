"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Send,
  CheckCircle2,
  Ban,
  Receipt,
  ShieldCheck,
  Info,
} from "lucide-react";
import {
  actualizarEstadoFactura,
  solicitarCAE,
} from "@/lib/actions/honorarios";
import type { EstadoFactura } from "@/lib/validations/honorarios";
import { ESTADO_FACTURA } from "./opciones";
import { formatMoney } from "@/lib/utils";
import { formatFechaCorta } from "@/lib/format";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OptionBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export type FacturaRow = {
  id: string;
  numero: string | null;
  tipo_comprobante: string;
  fecha: string;
  total: number;
  estado: string;
  cae: string | null;
  cae_vencimiento: string | null;
  cliente: string | null;
};

const TRANSICIONES: {
  value: EstadoFactura;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "emitida", label: "Marcar emitida", icon: <Send /> },
  { value: "pagada", label: "Marcar pagada", icon: <CheckCircle2 /> },
  { value: "anulada", label: "Anular", icon: <Ban /> },
];

export function FacturasTabla({ facturas }: { facturas: FacturaRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  async function cambiarEstado(id: string, estado: EstadoFactura) {
    setPendingId(id);
    const res = await actualizarEstadoFactura(id, estado);
    setPendingId(null);
    if (res.ok) {
      toast.success("Estado de la factura actualizado.");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  }

  async function pedirCAE(id: string) {
    setPendingId(id);
    const res = await solicitarCAE(id);
    setPendingId(null);
    if (res.ok) {
      toast.success(res.message ?? "CAE de demostración generado.", {
        description: "Integración real con ARCA/AFIP pendiente.",
      });
      router.refresh();
    } else {
      toast.error(res.error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning-soft px-4 py-3 text-sm text-warning-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          Facturación electrónica ARCA/AFIP (CAE): integración pendiente — por
          ahora se registra internamente.
        </p>
      </div>

      {facturas.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Todavía no emitiste facturas"
          description="Creá una factura interna, cargá sus ítems y, cuando esté la integración, solicitá el CAE ante ARCA."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>CAE</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturas.map((f) => {
                const estadoOpt = ESTADO_FACTURA[f.estado as EstadoFactura];
                return (
                  <TableRow
                    key={f.id}
                    data-pending={pendingId === f.id || undefined}
                    className="data-[pending]:opacity-50"
                  >
                    <TableCell className="font-medium tabular-nums">
                      {f.numero ?? "—"}
                    </TableCell>
                    <TableCell className="max-w-[14rem]">
                      <span className="truncate text-sm">{f.cliente ?? "—"}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {formatFechaCorta(f.fecha)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatMoney(f.total)}
                    </TableCell>
                    <TableCell>
                      <OptionBadge option={estadoOpt} dot />
                    </TableCell>
                    <TableCell className="text-xs">
                      {f.cae ? (
                        <div>
                          <p className="font-mono text-foreground">{f.cae}</p>
                          {f.cae_vencimiento && (
                            <p className="text-muted-foreground">
                              Vto. {formatFechaCorta(f.cae_vencimiento)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sin CAE</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" disabled={pendingId === f.id}>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60">
                          <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                          {TRANSICIONES.filter((t) => t.value !== f.estado).map((t) => (
                            <DropdownMenuItem
                              key={t.value}
                              onSelect={() => cambiarEstado(f.id, t.value)}
                            >
                              {t.icon}
                              {t.label}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuLabel>AFIP / ARCA</DropdownMenuLabel>
                          <DropdownMenuItem
                            onSelect={() => pedirCAE(f.id)}
                            disabled={f.estado === "anulada"}
                          >
                            <ShieldCheck />
                            Solicitar CAE (AFIP)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

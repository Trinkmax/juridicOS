"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Trash2, FileText, CheckCircle2, Ban } from "lucide-react";
import {
  actualizarEstadoHonorario,
  eliminarHonorario,
} from "@/lib/actions/honorarios";
import type { EstadoHonorario } from "@/lib/validations/honorarios";
import { ESTADO_HONORARIO, BASE_HONORARIO } from "./opciones";
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
import { Badge } from "@/components/ui/badge";
import { OptionBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Receipt } from "lucide-react";

export type HonorarioRow = {
  id: string;
  concepto: string;
  base: string;
  monto: number;
  estado: string;
  porcentaje: number | null;
  jus_cantidad: number | null;
  created_at: string;
  expediente: string | null;
  cliente: string | null;
};

const TRANSICIONES: { value: EstadoHonorario; label: string; icon: React.ReactNode }[] = [
  { value: "pendiente", label: "Marcar pendiente", icon: <FileText /> },
  { value: "facturado", label: "Marcar facturado", icon: <FileText /> },
  { value: "cobrado", label: "Marcar cobrado", icon: <CheckCircle2 /> },
  { value: "anulado", label: "Anular", icon: <Ban /> },
];

export function HonorariosTabla({ honorarios }: { honorarios: HonorarioRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  async function cambiarEstado(id: string, estado: EstadoHonorario) {
    setPendingId(id);
    const res = await actualizarEstadoHonorario(id, estado);
    setPendingId(null);
    if (res.ok) {
      toast.success("Estado actualizado.");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  }

  async function borrar(id: string) {
    setPendingId(id);
    const res = await eliminarHonorario(id);
    setPendingId(null);
    if (res.ok) {
      toast.success("Honorario eliminado.");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  }

  if (honorarios.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="Todavía no hay honorarios"
        description="Registrá honorarios por unidades JUS, monto fijo, pacto de cuota litis o por tiempo trabajado."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Concepto</TableHead>
            <TableHead>Cliente / Expediente</TableHead>
            <TableHead>Base</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {honorarios.map((h) => {
            const baseOpt = BASE_HONORARIO[h.base as keyof typeof BASE_HONORARIO];
            const estadoOpt = ESTADO_HONORARIO[h.estado as EstadoHonorario];
            return (
              <TableRow key={h.id} data-pending={pendingId === h.id || undefined} className="data-[pending]:opacity-50">
                <TableCell>
                  <p className="font-medium text-foreground">{h.concepto}</p>
                  <p className="text-data text-xs text-muted-foreground">{formatFechaCorta(h.created_at)}</p>
                </TableCell>
                <TableCell className="max-w-[16rem]">
                  <p className="truncate text-sm">{h.cliente ?? "—"}</p>
                  <p className="truncate text-xs text-muted-foreground">{h.expediente ?? "Sin expediente"}</p>
                </TableCell>
                <TableCell>
                  <Badge tone={baseOpt?.tone ?? "muted"}>{baseOpt?.label ?? h.base}</Badge>
                  {h.base === "pacto_cuota_litis" && h.porcentaje != null && (
                    <span className="text-data ml-1.5 text-xs text-muted-foreground">{h.porcentaje}%</span>
                  )}
                  {h.base === "jus" && h.jus_cantidad != null && (
                    <span className="text-data ml-1.5 text-xs text-muted-foreground">{h.jus_cantidad} JUS</span>
                  )}
                </TableCell>
                <TableCell className="text-data text-right font-medium">
                  {formatMoney(h.monto)}
                </TableCell>
                <TableCell>
                  <OptionBadge option={estadoOpt} dot />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" disabled={pendingId === h.id}>
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                      {TRANSICIONES.filter((t) => t.value !== h.estado).map((t) => (
                        <DropdownMenuItem key={t.value} onSelect={() => cambiarEstado(h.id, t.value)}>
                          {t.icon}
                          {t.label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive [&_svg]:text-destructive"
                        onSelect={() => borrar(h.id)}
                      >
                        <Trash2 />
                        Eliminar
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
  );
}

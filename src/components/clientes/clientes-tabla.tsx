import Link from "next/link";
import { Mail, Phone, Folder } from "lucide-react";
import type { Cliente } from "@/lib/types/domain";
import { TIPO_CLIENTE } from "@/lib/constants";
import { Avatar } from "@/components/ui/avatar";
import { OptionBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";

export type ClienteConCausas = Cliente & { causas: number };

/** Tabla en desktop, tarjetas en mobile. Cada fila linkea al detalle. */
export function ClientesTabla({ clientes }: { clientes: ClienteConCausas[] }) {
  return (
    <FadeIn>
      {/* Desktop */}
      <Card className="hidden overflow-hidden p-0 md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead className="text-right">Causas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((c) => (
              <TableRow key={c.id} className="cursor-pointer">
                <TableCell>
                  <Link
                    href={`/clientes/${c.id}`}
                    className="flex items-center gap-3 font-medium"
                  >
                    <Avatar name={c.nombre} size="sm" />
                    <span className="truncate">{c.nombre}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <OptionBadge option={TIPO_CLIENTE[c.tipo]} dot />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {c.documento || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
                    {c.email && (
                      <span className="flex items-center gap-1.5 truncate">
                        <Mail className="size-3.5 shrink-0" />
                        {c.email}
                      </span>
                    )}
                    {c.telefono && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="size-3.5 shrink-0" />
                        {c.telefono}
                      </span>
                    )}
                    {!c.email && !c.telefono && <span>—</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge tone={c.causas > 0 ? "primary" : "muted"}>
                    {c.causas}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile */}
      <div className="grid gap-3 md:hidden">
        {clientes.map((c) => (
          <Link key={c.id} href={`/clientes/${c.id}`}>
            <Card className="flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <Avatar name={c.nombre} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{c.nombre}</p>
                  <OptionBadge option={TIPO_CLIENTE[c.tipo]} />
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {c.documento || c.email || c.telefono || "Sin datos de contacto"}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                <Folder className="size-4" />
                {c.causas}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </FadeIn>
  );
}

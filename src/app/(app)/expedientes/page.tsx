import Link from "next/link";
import { FolderOpen, Plus, Scale } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { OptionBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { FadeIn } from "@/components/motion/fade-in";
import { ExpedientesFiltros } from "@/components/expedientes/expedientes-filtros";
import { FUERO, ESTADO_EXPEDIENTE } from "@/lib/constants";
import type { Fuero, EstadoExpediente } from "@/lib/constants";
import type { Expediente } from "@/lib/types/domain";

export const metadata = { title: "Expedientes" };

type Search = { q?: string; fuero?: string; estado?: string };
type Fila = Expediente & { clientes: { nombre: string } | null };

export default async function ExpedientesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { q, fuero, estado } = await searchParams;
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();

  let query = supabase
    .from("expedientes")
    .select("*, clientes(nombre)")
    .eq("estudio_id", activeEstudio.id);

  if (q) query = query.or(`caratula.ilike.%${q}%,nro_sac.ilike.%${q}%`);
  if (fuero) query = query.eq("fuero", fuero as Fuero);
  if (estado) query = query.eq("estado", estado as EstadoExpediente);

  const { data } = await query.order("updated_at", { ascending: false });
  const expedientes = (data ?? []) as Fila[];

  const hayFiltros = Boolean(q || fuero || estado);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expedientes"
        description="Todas las causas del estudio en un solo lugar."
        icon={<FolderOpen className="size-5" />}
      >
        <Button asChild>
          <Link href="/expedientes/nuevo">
            <Plus />
            Nuevo expediente
          </Link>
        </Button>
      </PageHeader>

      <ExpedientesFiltros />

      {expedientes.length === 0 ? (
        hayFiltros ? (
          <EmptyState
            icon={Scale}
            title="Sin resultados"
            description="No encontramos expedientes con esos filtros. Probá ajustar la búsqueda."
          />
        ) : (
          <EmptyState
            icon={FolderOpen}
            title="Todavía no hay expedientes"
            description="Creá tu primer expediente para empezar a gestionar causas, plazos y audiencias."
            action={
              <Button asChild>
                <Link href="/expedientes/nuevo">
                  <Plus />
                  Nuevo expediente
                </Link>
              </Button>
            }
          />
        )
      ) : (
        <FadeIn>
          <Card className="overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Carátula</TableHead>
                  <TableHead className="hidden md:table-cell">Nº SAC</TableHead>
                  <TableHead className="hidden sm:table-cell">Fuero</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden lg:table-cell">Cliente</TableHead>
                  <TableHead className="hidden xl:table-cell">Juzgado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expedientes.map((e) => (
                  <TableRow key={e.id} className="group">
                    <TableCell className="max-w-[60vw] sm:max-w-[24rem]">
                      <Link
                        href={`/expedientes/${e.id}`}
                        className="font-medium text-foreground hover:text-primary hover:underline underline-offset-4 line-clamp-2"
                      >
                        {e.caratula}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground text-data">
                      {e.nro_sac ?? "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <OptionBadge option={FUERO[e.fuero]} />
                    </TableCell>
                    <TableCell>
                      <OptionBadge option={ESTADO_EXPEDIENTE[e.estado]} dot />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {e.clientes?.nombre ?? "—"}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-sm text-muted-foreground max-w-[16rem] truncate">
                      {e.juzgado ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}

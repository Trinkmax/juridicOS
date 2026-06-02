import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Archive } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptionBadge } from "@/components/ui/status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FadeIn } from "@/components/motion/fade-in";
import { FUERO, ESTADO_EXPEDIENTE } from "@/lib/constants";
import { ResumenPanel } from "@/components/expedientes/resumen-panel";
import { PartesPanel } from "@/components/expedientes/partes-panel";
import { MovimientosPanel } from "@/components/expedientes/movimientos-panel";
import { PlazosPanel } from "@/components/expedientes/plazos-panel";
import { AudienciasPanel } from "@/components/expedientes/audiencias-panel";
import { AsistenteIA } from "@/components/expedientes/asistente-ia";
import { EditarExpedienteDialog } from "@/components/expedientes/editar-expediente-dialog";
import { ExpedienteAcciones } from "@/components/expedientes/expediente-acciones";
import { iaActivaEstudio } from "@/lib/actions/ia";
import type {
  Expediente,
  Parte,
  Movimiento,
  PlazoDetalle,
  Audiencia,
} from "@/lib/types/domain";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();
  const { data } = await supabase
    .from("expedientes")
    .select("caratula")
    .eq("id", id)
    .eq("estudio_id", activeEstudio.id)
    .maybeSingle();
  return { title: data?.caratula ?? "Expediente" };
}

type ExpedienteConCliente = Expediente & { clientes: { id: string; nombre: string } | null };

export default async function ExpedienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();

  const { data: expediente } = await supabase
    .from("expedientes")
    .select("*, clientes(id, nombre)")
    .eq("id", id)
    .eq("estudio_id", activeEstudio.id)
    .maybeSingle<ExpedienteConCliente>();

  if (!expediente) notFound();

  const [
    { data: clientesData },
    { data: partesData },
    { data: movimientosData },
    { data: plazosData },
    { data: audienciasData },
  ] = await Promise.all([
    supabase
      .from("clientes")
      .select("id, nombre")
      .eq("estudio_id", activeEstudio.id)
      .eq("activo", true)
      .order("nombre", { ascending: true }),
    supabase
      .from("partes")
      .select("*")
      .eq("expediente_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("movimientos")
      .select("*")
      .eq("expediente_id", id)
      .order("fecha", { ascending: false }),
    supabase
      .from("v_plazos_detalle")
      .select("*")
      .eq("expediente_id", id)
      .order("fecha_vencimiento", { ascending: true }),
    supabase
      .from("audiencias")
      .select("*")
      .eq("expediente_id", id)
      .order("fecha_hora", { ascending: true }),
  ]);

  const clientes = clientesData ?? [];
  const partes = (partesData ?? []) as Parte[];
  const movimientos = (movimientosData ?? []) as Movimiento[];
  const plazos = (plazosData ?? []) as PlazoDetalle[];
  const audiencias = (audienciasData ?? []) as Audiencia[];

  const cliente = expediente.clientes ?? null;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
        <Link href="/expedientes">
          <ArrowLeft />
          Volver a expedientes
        </Link>
      </Button>

      {/* Header */}
      <FadeIn>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <OptionBadge option={FUERO[expediente.fuero]} />
              <OptionBadge option={ESTADO_EXPEDIENTE[expediente.estado]} dot />
              {expediente.archivado && (
                <Badge tone="muted" className="gap-1">
                  <Archive className="size-3" />
                  Archivado
                </Badge>
              )}
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-balance">
              {expediente.caratula}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {expediente.nro_sac && (
                <span>
                  SAC{" "}
                  <span className="font-mono text-data font-medium text-foreground">
                    {expediente.nro_sac}
                  </span>
                </span>
              )}
              {expediente.juzgado && <span>{expediente.juzgado}</span>}
              {expediente.secretaria && <span>{expediente.secretaria}</span>}
              {cliente && (
                <span>
                  Cliente:{" "}
                  <Link
                    href={`/clientes/${cliente.id}`}
                    className="font-medium text-primary hover:underline underline-offset-4"
                  >
                    {cliente.nombre}
                  </Link>
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <EditarExpedienteDialog expediente={expediente} clientes={clientes} />
            <ExpedienteAcciones id={expediente.id} archivado={expediente.archivado} />
          </div>
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.05}>
        <Tabs defaultValue="resumen">
          <TabsList className="flex-wrap">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="partes">Partes ({partes.length})</TabsTrigger>
            <TabsTrigger value="movimientos">Movimientos ({movimientos.length})</TabsTrigger>
            <TabsTrigger value="plazos">Plazos ({plazos.length})</TabsTrigger>
            <TabsTrigger value="audiencias">Audiencias ({audiencias.length})</TabsTrigger>
            <TabsTrigger value="asistente">Asistente IA</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen">
            <ResumenPanel
              expediente={expediente}
              cliente={cliente}
              stats={{
                partes: partes.length,
                movimientos: movimientos.length,
                plazos: plazos.length,
                audiencias: audiencias.length,
              }}
            />
          </TabsContent>

          <TabsContent value="partes">
            <PartesPanel expedienteId={expediente.id} partes={partes} />
          </TabsContent>

          <TabsContent value="movimientos">
            <MovimientosPanel expedienteId={expediente.id} movimientos={movimientos} />
          </TabsContent>

          <TabsContent value="plazos">
            <PlazosPanel expedienteId={expediente.id} plazos={plazos} />
          </TabsContent>

          <TabsContent value="audiencias">
            <AudienciasPanel expedienteId={expediente.id} audiencias={audiencias} />
          </TabsContent>

          <TabsContent value="asistente">
            <AsistenteIA expedienteId={expediente.id} iaActiva={await iaActivaEstudio(activeEstudio.id)} />
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  );
}

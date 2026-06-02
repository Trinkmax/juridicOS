import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  AtSign,
  FileText,
  Folder,
  IdCard,
  Building2,
  History,
} from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type {
  Cliente,
  Expediente,
  Movimiento,
  Audiencia,
  PlazoDetalle,
} from "@/lib/types/domain";
import { TIPO_CLIENTE, FUERO, ESTADO_EXPEDIENTE } from "@/lib/constants";
import { formatFechaCorta } from "@/lib/format";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptionBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn } from "@/components/motion/fade-in";
import { EditarClienteDialog } from "@/components/clientes/editar-cliente-dialog";
import { ClienteActividad } from "@/components/clientes/cliente-actividad";

function MetricaTile({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="font-display text-data text-2xl font-semibold tracking-tight">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

export const metadata = { title: "Cliente" };

type DatoProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
};

function Dato({ icon: Icon, label, value }: DatoProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}

export default async function ClienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();

  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .eq("estudio_id", activeEstudio.id)
    .maybeSingle<Cliente>();

  if (!cliente) notFound();

  const { data: expedientesData } = await supabase
    .from("expedientes")
    .select("id, caratula, fuero, estado, nro_sac, fecha_inicio")
    .eq("estudio_id", activeEstudio.id)
    .eq("cliente_id", id)
    .order("created_at", { ascending: false });

  const expedientes = (expedientesData ?? []) as Pick<
    Expediente,
    "id" | "caratula" | "fuero" | "estado" | "nro_sac" | "fecha_inicio"
  >[];

  const expedienteIds = expedientes.map((e) => e.id);
  const caratulaPorExpediente: Record<string, string> = Object.fromEntries(
    expedientes.map((e) => [e.id, e.caratula]),
  );

  // Actividad reciente unificada de las causas del cliente (sólo si hay causas).
  let movimientos: Movimiento[] = [];
  let audiencias: Audiencia[] = [];
  let plazos: PlazoDetalle[] = [];

  if (expedienteIds.length > 0) {
    const [
      { data: movimientosData },
      { data: audienciasData },
      { data: plazosData },
    ] = await Promise.all([
      supabase
        .from("movimientos")
        .select("id, expediente_id, titulo, descripcion, fecha, tipo, origen")
        .eq("estudio_id", activeEstudio.id)
        .in("expediente_id", expedienteIds)
        .order("fecha", { ascending: false })
        .limit(12),
      supabase
        .from("audiencias")
        .select(
          "id, expediente_id, titulo, fecha_hora, estado, modalidad, lugar, juzgado, enlace, duracion_min, tipo",
        )
        .eq("estudio_id", activeEstudio.id)
        .in("expediente_id", expedienteIds)
        .order("fecha_hora", { ascending: false })
        .limit(12),
      supabase
        .from("v_plazos_detalle")
        .select("*")
        .eq("estudio_id", activeEstudio.id)
        .in("expediente_id", expedienteIds)
        .order("fecha_vencimiento", { ascending: false })
        .limit(12),
    ]);

    movimientos = (movimientosData ?? []) as Movimiento[];
    audiencias = (audienciasData ?? []) as Audiencia[];
    plazos = (plazosData ?? []) as PlazoDetalle[];
  }

  // Métricas.
  const totalCausas = expedientes.length;
  const causasActivas = expedientes.filter(
    (e) => e.estado !== "archivado",
  ).length;
  const plazosPendientes = plazos.filter(
    (p) => p.estado === "pendiente",
  ).length;
  const ahora = new Date().getTime();
  const proximaAudiencia = audiencias
    .filter(
      (a) =>
        a.estado === "programada" &&
        new Date(a.fecha_hora).getTime() >= ahora,
    )
    .sort(
      (a, b) =>
        new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime(),
    )[0];

  const esJuridica = cliente.tipo === "juridica";

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/clientes">
          <ArrowLeft className="size-4" />
          Clientes
        </Link>
      </Button>

      <FadeIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar name={cliente.nombre} size="lg" />
            <div className="min-w-0">
              <h1 className="truncate font-display text-xl font-semibold tracking-tight sm:text-2xl">
                {cliente.nombre}
              </h1>
              <div className="mt-1.5 flex items-center gap-2">
                <OptionBadge option={TIPO_CLIENTE[cliente.tipo]} dot />
                {cliente.localidad && (
                  <span className="text-sm text-muted-foreground">
                    {cliente.localidad}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <EditarClienteDialog cliente={cliente} />
          </div>
        </div>
      </FadeIn>

      {/* Métricas */}
      <FadeIn delay={0.03}>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <MetricaTile label="Causas activas" value={causasActivas} />
          <MetricaTile label="Total causas" value={totalCausas} />
          <MetricaTile label="Plazos pendientes" value={plazosPendientes} />
          <MetricaTile
            label="Próxima audiencia"
            value={
              proximaAudiencia
                ? formatFechaCorta(proximaAudiencia.fecha_hora)
                : "—"
            }
          />
        </div>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ficha */}
        <FadeIn delay={0.05} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Datos del cliente</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <Dato
                icon={esJuridica ? Building2 : IdCard}
                label={esJuridica ? "CUIT" : "DNI"}
                value={cliente.documento}
              />
              <Dato icon={Mail} label="Email" value={cliente.email} />
              <Dato icon={Phone} label="Teléfono" value={cliente.telefono} />
              <Dato
                icon={MapPin}
                label="Domicilio real"
                value={cliente.domicilio_real}
              />
              <Dato
                icon={AtSign}
                label="Domicilio electrónico"
                value={cliente.domicilio_electronico}
              />
              <Dato icon={MapPin} label="Localidad" value={cliente.localidad} />
            </CardContent>
          </Card>
        </FadeIn>

        {/* Notas */}
        <FadeIn delay={0.1}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                Notas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cliente.notas ? (
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {cliente.notas}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground/70">
                  Sin notas. Editá el cliente para agregar observaciones internas.
                </p>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Causas */}
      <FadeIn delay={0.15}>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Folder className="size-4 text-muted-foreground" />
              Causas
              <Badge tone={expedientes.length > 0 ? "primary" : "muted"}>
                {expedientes.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expedientes.length === 0 ? (
              <EmptyState
                icon={Folder}
                title="Sin causas vinculadas"
                description="Cuando crees un expediente para este cliente vas a verlo acá."
              />
            ) : (
              <ul className="divide-y divide-border">
                {expedientes.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/expedientes/${e.id}`}
                      className="-mx-3 flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {e.caratula}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {e.nro_sac ? `SAC ${e.nro_sac} · ` : ""}
                          {e.fecha_inicio
                            ? `Iniciada ${formatFechaCorta(e.fecha_inicio)}`
                            : "Sin fecha de inicio"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <OptionBadge option={FUERO[e.fuero]} />
                        <OptionBadge option={ESTADO_EXPEDIENTE[e.estado]} dot />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Actividad reciente */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="size-4 text-muted-foreground" />
              Actividad reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expedientes.length === 0 ? (
              <EmptyState
                icon={History}
                title="Sin actividad"
                description="Cuando este cliente tenga causas con movimientos, audiencias o plazos, vas a ver su actividad reciente acá."
              />
            ) : (
              <ClienteActividad
                movimientos={movimientos}
                audiencias={audiencias}
                plazos={plazos}
                caratulaPorExpediente={caratulaPorExpediente}
              />
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}

import {
  BarChart3,
  Banknote,
  Wallet,
  FolderOpen,
  Clock,
  CalendarClock,
  Users2,
  TrendingUp,
} from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils";
import { FUERO, type Fuero, type EstadoExpediente } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  CausasFueroChart,
  type FueroDatum,
} from "@/components/reportes/causas-fuero-chart";
import {
  PlazosEstadoChart,
  type PlazoEstadoDatum,
} from "@/components/reportes/plazos-estado-chart";
import {
  FacturadoMesChart,
  type FacturadoMesDatum,
} from "@/components/reportes/facturado-mes-chart";
import {
  CargaAbogados,
  type CargaAbogado,
} from "@/components/reportes/carga-abogados";
import { CHART_COLORS } from "@/components/reportes/chart-theme";

export const metadata = { title: "Reportes" };

/* ── Tipos de filas usadas para los agregados ───────────────────────── */
type ExpedienteRow = { fuero: Fuero; estado: EstadoExpediente; archivado: boolean };
type PlazoRow = { estado: string; fecha_vencimiento: string | null };
type HonorarioRow = { estado: string; monto: number | null };
type FacturaRow = { estado: string; fecha: string; total: number | null };
type TimeEntryRow = { usuario_id: string | null; minutos: number | null; fecha: string };
type TareaRow = { asignado_a: string | null };
type PlazoResponsableRow = { responsable_id: string | null };
type MiembroRow = {
  usuario_id: string;
  usuarios: {
    id: string;
    nombre: string | null;
    apellido: string | null;
    nombre_completo: string | null;
    avatar_url: string | null;
  } | null;
};

const ESTADOS_TAREA_ACTIVA = ["pendiente", "en_curso", "en_revision"];

/** Etiqueta de mes corta y capitalizada: "ene 25". */
const MES_FMT = new Intl.DateTimeFormat("es-AR", { month: "short", year: "2-digit" });

export default async function ReportesPage() {
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();
  const estudioId = activeEstudio.id;

  const hoy = new Date();
  const hoyISO = hoy.toISOString().slice(0, 10); // YYYY-MM-DD (comparable con fecha_vencimiento)

  // Inicio del mes actual y de la ventana de 6 meses, para facturado + horas del mes.
  const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const inicioVentana = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);
  const inicioMesISO = inicioMesActual.toISOString().slice(0, 10);
  const inicioVentanaISO = inicioVentana.toISOString().slice(0, 10);

  const [
    expedientesRes,
    plazosRes,
    honorariosRes,
    facturasRes,
    timeEntriesRes,
    tareasRes,
    plazosRespRes,
    miembrosRes,
  ] = await Promise.all([
    supabase
      .from("expedientes")
      .select("fuero, estado, archivado")
      .eq("estudio_id", estudioId),
    supabase
      .from("plazos")
      .select("estado, fecha_vencimiento")
      .eq("estudio_id", estudioId),
    supabase.from("honorarios").select("estado, monto").eq("estudio_id", estudioId),
    supabase
      .from("facturas")
      .select("estado, fecha, total")
      .eq("estudio_id", estudioId)
      .gte("fecha", inicioVentanaISO),
    supabase
      .from("time_entries")
      .select("usuario_id, minutos, fecha")
      .eq("estudio_id", estudioId),
    supabase
      .from("tareas")
      .select("asignado_a")
      .eq("estudio_id", estudioId)
      .in(
        "estado",
        ESTADOS_TAREA_ACTIVA as ("pendiente" | "en_curso" | "en_revision" | "completada" | "cancelada")[],
      ),
    supabase
      .from("plazos")
      .select("responsable_id")
      .eq("estudio_id", estudioId)
      .eq("estado", "pendiente"),
    supabase
      .from("miembros_estudio")
      .select(
        "usuario_id, usuarios!miembros_estudio_usuario_id_fkey(id, nombre, apellido, nombre_completo, avatar_url)",
      )
      .eq("estudio_id", estudioId)
      .eq("activo", true),
  ]);

  const expedientes = (expedientesRes.data ?? []) as ExpedienteRow[];
  const plazos = (plazosRes.data ?? []) as PlazoRow[];
  const honorarios = (honorariosRes.data ?? []) as HonorarioRow[];
  const facturas = (facturasRes.data ?? []) as FacturaRow[];
  const timeEntries = (timeEntriesRes.data ?? []) as TimeEntryRow[];
  const tareas = (tareasRes.data ?? []) as TareaRow[];
  const plazosResp = (plazosRespRes.data ?? []) as PlazoResponsableRow[];
  const miembros = (miembrosRes.data ?? []) as unknown as MiembroRow[];

  /* ── Expedientes por fuero (solo activos) ─────────────────────────── */
  const activos = expedientes.filter((e) => !e.archivado);
  const porFuero = new Map<Fuero, number>();
  for (const e of activos) porFuero.set(e.fuero, (porFuero.get(e.fuero) ?? 0) + 1);
  const fueroData: FueroDatum[] = [...porFuero.entries()]
    .map(([fuero, value]) => ({ label: FUERO[fuero]?.label ?? fuero, value }))
    .sort((a, b) => b.value - a.value);

  const causasActivas = activos.length;

  /* ── Plazos por estado (vencido = pendiente con vto < hoy) ────────── */
  let plazosPendientes = 0;
  let plazosCumplidos = 0;
  let plazosVencidos = 0;
  let plazosOtros = 0;
  for (const p of plazos) {
    if (p.estado === "cumplido") plazosCumplidos += 1;
    else if (p.estado === "pendiente") {
      const vencido = p.fecha_vencimiento != null && p.fecha_vencimiento < hoyISO;
      if (vencido) plazosVencidos += 1;
      else plazosPendientes += 1;
    } else if (p.estado === "vencido") plazosVencidos += 1;
    else plazosOtros += 1; // suspendido / cancelado
  }
  const plazosData: PlazoEstadoDatum[] = [
    { label: "Pendientes", value: plazosPendientes, color: CHART_COLORS.info },
    { label: "Cumplidos", value: plazosCumplidos, color: CHART_COLORS.success },
    { label: "Vencidos", value: plazosVencidos, color: CHART_COLORS.destructive },
    { label: "Otros", value: plazosOtros, color: CHART_COLORS.muted },
  ].filter((d) => d.value > 0);

  /* ── Honorarios por estado (Σ monto) ──────────────────────────────── */
  const honPorEstado = { pendiente: 0, facturado: 0, cobrado: 0 };
  for (const h of honorarios) {
    const monto = h.monto ?? 0;
    if (h.estado === "pendiente") honPorEstado.pendiente += monto;
    else if (h.estado === "facturado") honPorEstado.facturado += monto;
    else if (h.estado === "cobrado") honPorEstado.cobrado += monto;
  }

  /* ── Facturado por mes (emitida/pagada), últimos 6 meses ──────────── */
  const mesesOrden: { key: string; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    mesesOrden.push({ key, label: MES_FMT.format(d).replace(/\./g, "") });
  }
  const facturadoPorMes = new Map<string, number>();
  let totalFacturado = 0;
  for (const f of facturas) {
    if (f.estado !== "emitida" && f.estado !== "pagada") continue;
    const key = f.fecha.slice(0, 7); // YYYY-MM
    const monto = f.total ?? 0;
    facturadoPorMes.set(key, (facturadoPorMes.get(key) ?? 0) + monto);
    totalFacturado += monto;
  }
  const facturadoData: FacturadoMesDatum[] = mesesOrden.map((m) => ({
    label: m.label,
    value: facturadoPorMes.get(m.key) ?? 0,
  }));

  /* ── Horas del mes (Σ minutos / 60 del mes actual) ────────────────── */
  let minutosMes = 0;
  for (const t of timeEntries) {
    if (t.fecha >= inicioMesISO) minutosMes += t.minutos ?? 0;
  }
  const horasMes = Math.round((minutosMes / 60) * 10) / 10;

  /* ── Carga por abogado ────────────────────────────────────────────── */
  const plazosPorUsuario = new Map<string, number>();
  for (const p of plazosResp) {
    if (p.responsable_id) {
      plazosPorUsuario.set(
        p.responsable_id,
        (plazosPorUsuario.get(p.responsable_id) ?? 0) + 1,
      );
    }
  }
  const tareasPorUsuario = new Map<string, number>();
  for (const t of tareas) {
    if (t.asignado_a) {
      tareasPorUsuario.set(t.asignado_a, (tareasPorUsuario.get(t.asignado_a) ?? 0) + 1);
    }
  }
  const minutosPorUsuario = new Map<string, number>();
  for (const t of timeEntries) {
    if (t.usuario_id) {
      minutosPorUsuario.set(
        t.usuario_id,
        (minutosPorUsuario.get(t.usuario_id) ?? 0) + (t.minutos ?? 0),
      );
    }
  }

  const cargaData: CargaAbogado[] = miembros
    .map((m) => {
      const u = m.usuarios;
      const nombre =
        u?.nombre_completo ||
        [u?.nombre, u?.apellido].filter(Boolean).join(" ") ||
        "Sin nombre";
      const horas = Math.round(((minutosPorUsuario.get(m.usuario_id) ?? 0) / 60) * 10) / 10;
      return {
        usuarioId: m.usuario_id,
        nombre,
        avatarUrl: u?.avatar_url ?? null,
        plazosPendientes: plazosPorUsuario.get(m.usuario_id) ?? 0,
        tareasActivas: tareasPorUsuario.get(m.usuario_id) ?? 0,
        horas,
      };
    })
    .filter((c) => c.plazosPendientes > 0 || c.tareasActivas > 0 || c.horas > 0)
    .sort(
      (a, b) =>
        b.plazosPendientes + b.tareasActivas - (a.plazosPendientes + a.tareasActivas) ||
        b.horas - a.horas,
    );

  /* ── ¿Hay algo para mostrar? ──────────────────────────────────────── */
  const sinDatos =
    expedientes.length === 0 &&
    plazos.length === 0 &&
    honorarios.length === 0 &&
    facturas.length === 0 &&
    timeEntries.length === 0;

  const stats = [
    {
      icon: Banknote,
      label: "Total facturado",
      value: formatMoney(totalFacturado),
      hint: "Emitido y cobrado · últimos 6 meses",
    },
    {
      icon: Wallet,
      label: "Honorarios pendientes",
      value: formatMoney(honPorEstado.pendiente),
      hint: "Por facturar",
    },
    {
      icon: FolderOpen,
      label: "Causas activas",
      value: causasActivas,
      hint: "Expedientes en curso",
    },
    {
      icon: Clock,
      label: "Horas del mes",
      value: `${horasMes} hs`,
      hint: "Tiempo registrado",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <FadeIn>
        <PageHeader
          title="Reportes"
          description="Panel ejecutivo del estudio: facturación, plazos y carga del equipo."
          icon={<BarChart3 className="size-5" />}
        />
      </FadeIn>

      {sinDatos ? (
        <FadeIn delay={0.05}>
          <EmptyState
            icon={TrendingUp}
            title="Todavía no hay datos para reportar"
            description="Cuando cargues expedientes, plazos, horas y honorarios, vas a ver acá los indicadores del estudio."
          />
        </FadeIn>
      ) : (
        <>
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <StatCard icon={s.icon} label={s.label} value={s.value} hint={s.hint} />
              </StaggerItem>
            ))}
          </Stagger>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FadeIn delay={0.05}>
              <Card>
                <CardHeader>
                  <CardTitle>Causas por fuero</CardTitle>
                  <CardDescription>Expedientes activos según el fuero.</CardDescription>
                </CardHeader>
                <CardContent>
                  {fueroData.length > 0 ? (
                    <CausasFueroChart data={fueroData} />
                  ) : (
                    <EmptyState
                      icon={FolderOpen}
                      title="Sin causas activas"
                      className="py-10"
                    />
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle>Plazos por estado</CardTitle>
                  <CardDescription>
                    Vencido = pendiente con vencimiento anterior a hoy.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {plazosData.length > 0 ? (
                    <PlazosEstadoChart data={plazosData} />
                  ) : (
                    <EmptyState
                      icon={CalendarClock}
                      title="Sin plazos cargados"
                      className="py-10"
                    />
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.15}>
              <Card>
                <CardHeader>
                  <CardTitle>Facturado por mes</CardTitle>
                  <CardDescription>
                    Total emitido y cobrado en los últimos 6 meses.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FacturadoMesChart data={facturadoData} />
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>Honorarios por estado</CardTitle>
                  <CardDescription>Cartera de honorarios del estudio.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-1">
                  <DesgloseHonorario
                    label="Pendientes"
                    value={honPorEstado.pendiente}
                    color={CHART_COLORS.warning}
                  />
                  <DesgloseHonorario
                    label="Facturados"
                    value={honPorEstado.facturado}
                    color={CHART_COLORS.info}
                  />
                  <DesgloseHonorario
                    label="Cobrados"
                    value={honPorEstado.cobrado}
                    color={CHART_COLORS.success}
                  />
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          <FadeIn delay={0.25}>
            <Card>
              <CardHeader>
                <CardTitle>Carga por abogado</CardTitle>
                <CardDescription>
                  Plazos pendientes, tareas activas y horas registradas por integrante.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cargaData.length > 0 ? (
                  <CargaAbogados data={cargaData} />
                ) : (
                  <EmptyState
                    icon={Users2}
                    title="Sin carga asignada"
                    description="Asigná plazos y tareas al equipo para ver la distribución de trabajo."
                    className="py-10"
                  />
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </>
      )}
    </div>
  );
}

/** Fila de desglose de honorarios con monto y punto de color. Server-rendered. */
function DesgloseHonorario({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3.5 py-3">
      <div className="flex items-center gap-2.5">
        <span className="size-2.5 shrink-0 rounded-full" style={{ background: color }} />
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-data text-sm font-semibold">{formatMoney(value)}</span>
    </div>
  );
}

import { LayoutDashboard, CalendarClock, CalendarDays, FolderOpen, Users } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { formatFecha, capitalizar } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { StatCard } from "@/components/dashboard/stat-card";
import { VencimientosList } from "@/components/dashboard/vencimientos-list";
import {
  AgendaWidget,
  type AudienciaConExpediente,
} from "@/components/dashboard/agenda-widget";
import {
  ExpedientesRecientes,
  type ExpedienteConCliente,
} from "@/components/dashboard/expedientes-recientes";
import { AccesosRapidos } from "@/components/dashboard/accesos-rapidos";
import type { DashboardResumen, PlazoDetalle } from "@/lib/types/domain";

export const metadata = { title: "Inicio" };

const RESUMEN_VACIO: DashboardResumen = {
  plazos_pendientes: 0,
  plazos_vencidos: 0,
  plazos_hoy: 0,
  plazos_semana: 0,
  audiencias_semana: 0,
  tareas_pendientes: 0,
  expedientes_activos: 0,
  clientes_total: 0,
};

export default async function DashboardPage() {
  const { activeEstudio, profile } = await requireEstudio();
  const supabase = await createClient();
  const estudioId = activeEstudio.id;
  const ahoraISO = new Date().toISOString();

  const [resumenRes, plazosRes, audienciasRes, expedientesRes] = await Promise.all([
    supabase.rpc("dashboard_resumen", { _estudio: estudioId }),
    supabase
      .from("v_plazos_detalle")
      .select("*")
      .eq("estudio_id", estudioId)
      .eq("estado", "pendiente")
      .order("fecha_vencimiento", { ascending: true })
      .limit(8),
    supabase
      .from("audiencias")
      .select("*, expedientes(caratula)")
      .eq("estudio_id", estudioId)
      .eq("estado", "programada")
      .gte("fecha_hora", ahoraISO)
      .order("fecha_hora", { ascending: true })
      .limit(6),
    supabase
      .from("expedientes")
      .select("*, clientes(nombre)")
      .eq("estudio_id", estudioId)
      .eq("archivado", false)
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  const resumen: DashboardResumen =
    (resumenRes.data as unknown as DashboardResumen | null) ?? RESUMEN_VACIO;
  const plazos = (plazosRes.data ?? []) as PlazoDetalle[];
  const audiencias = (audienciasRes.data ?? []) as AudienciaConExpediente[];
  const expedientes = (expedientesRes.data ?? []) as ExpedienteConCliente[];

  const nombre = profile?.nombre || profile?.nombre_completo?.split(" ")[0] || "";
  const saludo = nombre ? `Hola, ${nombre}` : "Hola";
  const hoy = capitalizar(formatFecha(new Date(), "EEEE d 'de' MMMM"));

  const stats = [
    {
      icon: CalendarClock,
      label: "Plazos pendientes",
      value: resumen.plazos_pendientes,
      hint:
        resumen.plazos_hoy > 0
          ? `${resumen.plazos_hoy} vence${resumen.plazos_hoy === 1 ? "" : "n"} hoy`
          : "Al día con los plazos",
      alerta:
        resumen.plazos_vencidos > 0
          ? `${resumen.plazos_vencidos} vencido${resumen.plazos_vencidos === 1 ? "" : "s"}`
          : undefined,
    },
    {
      icon: CalendarDays,
      label: "Audiencias esta semana",
      value: resumen.audiencias_semana,
      hint: "Próximos 7 días",
    },
    {
      icon: FolderOpen,
      label: "Expedientes activos",
      value: resumen.expedientes_activos,
      hint: "Causas en curso",
    },
    {
      icon: Users,
      label: "Clientes",
      value: resumen.clientes_total,
      hint: "Cartera del estudio",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <FadeIn>
        <PageHeader
          title={saludo}
          description={hoy}
          icon={<LayoutDashboard className="size-5" />}
        />
      </FadeIn>

      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <StatCard
              icon={s.icon}
              label={s.label}
              value={s.value}
              hint={s.hint}
              alerta={s.alerta}
            />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <FadeIn delay={0.05} className="lg:col-span-2">
          <VencimientosList plazos={plazos} />
        </FadeIn>

        <div className="flex flex-col gap-6">
          <FadeIn delay={0.1}>
            <AgendaWidget audiencias={audiencias} />
          </FadeIn>
          <FadeIn delay={0.15}>
            <ExpedientesRecientes expedientes={expedientes} />
          </FadeIn>
        </div>
      </div>

      <FadeIn delay={0.2}>
        <AccesosRapidos />
      </FadeIn>
    </div>
  );
}

import { LayoutDashboard, CalendarClock, CalendarDays, FolderOpen, Users } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format as fmtDate,
} from "date-fns";
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
import { MiniCalendario } from "@/components/dashboard/mini-calendario";
import {
  ExpedientesRecientes,
  type ExpedienteConCliente,
} from "@/components/dashboard/expedientes-recientes";
import { AccesosRapidos } from "@/components/dashboard/accesos-rapidos";
import type { AgendaItem } from "@/components/agenda/tipos";
import type { DashboardResumen, PlazoDetalle } from "@/lib/types/domain";

/** Normaliza una relación to-one embebida (objeto o array) a un objeto o null. */
function toOne<T>(rel: T | T[] | null | undefined): T | null {
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel ?? null;
}

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

  // Rango de la grilla del mes actual (semanas completas) para el mini-calendario.
  const ahora = new Date();
  const mesAnchor = new Date(ahora.getFullYear(), ahora.getMonth(), 1, 12);
  const gridStart = startOfWeek(startOfMonth(mesAnchor), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(mesAnchor), { weekStartsOn: 1 });
  // Buffer de ±1-2 días para evitar cortes por zona horaria.
  const fetchDesde = addDays(gridStart, -1);
  const fetchHasta = addDays(gridEnd, 2);
  const mesDesdeISO = fetchDesde.toISOString();
  const mesHastaISO = fetchHasta.toISOString();
  const mesDesdeFecha = fmtDate(fetchDesde, "yyyy-MM-dd");
  const mesHastaFecha = fmtDate(fetchHasta, "yyyy-MM-dd");

  const [
    resumenRes,
    plazosRes,
    audienciasRes,
    expedientesRes,
    mesAudienciasRes,
    mesPlazosRes,
    mesEventosRes,
  ] = await Promise.all([
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
    supabase
      .from("audiencias")
      .select(
        "id, titulo, fecha_hora, duracion_min, modalidad, lugar, juzgado, enlace, expediente_id, expedientes(caratula)",
      )
      .eq("estudio_id", estudioId)
      .eq("estado", "programada")
      .gte("fecha_hora", mesDesdeISO)
      .lte("fecha_hora", mesHastaISO)
      .order("fecha_hora", { ascending: true }),
    supabase
      .from("v_plazos_detalle")
      .select("*")
      .eq("estudio_id", estudioId)
      .eq("estado", "pendiente")
      .gte("fecha_vencimiento", mesDesdeFecha)
      .lte("fecha_vencimiento", mesHastaFecha)
      .order("fecha_vencimiento", { ascending: true }),
    supabase
      .from("eventos_agenda")
      .select(
        "id, titulo, inicio, fin, todo_el_dia, descripcion, expediente_id, expedientes(caratula)",
      )
      .eq("estudio_id", estudioId)
      .gte("inicio", mesDesdeISO)
      .lte("inicio", mesHastaISO)
      .order("inicio", { ascending: true }),
  ]);

  const resumen: DashboardResumen =
    (resumenRes.data as unknown as DashboardResumen | null) ?? RESUMEN_VACIO;
  const plazos = (plazosRes.data ?? []) as PlazoDetalle[];
  const audiencias = (audienciasRes.data ?? []) as AudienciaConExpediente[];
  const expedientes = (expedientesRes.data ?? []) as ExpedienteConCliente[];

  // Ítems del mes para el mini-calendario (mismo mapeo que la agenda).
  const mesItems: AgendaItem[] = [];
  for (const a of mesAudienciasRes.data ?? []) {
    const exp = toOne(a.expedientes);
    mesItems.push({
      id: a.id,
      fecha: a.fecha_hora,
      hora: a.fecha_hora,
      tipo: "audiencia",
      titulo: a.titulo,
      expedienteId: a.expediente_id,
      expediente: exp?.caratula ?? null,
      modalidadAud: a.modalidad,
      lugar: a.lugar,
      juzgado: a.juzgado,
      enlace: a.enlace,
      duracionMin: a.duracion_min,
    });
  }
  for (const p of (mesPlazosRes.data as PlazoDetalle[]) ?? []) {
    if (!p.id || !p.fecha_vencimiento) continue;
    mesItems.push({
      id: p.id,
      fecha: p.fecha_vencimiento,
      tipo: "plazo",
      titulo: p.acto_procesal ?? "Vencimiento de plazo",
      expedienteId: p.expediente_id,
      expediente: p.caratula,
      diasRestantes: p.dias_restantes,
      prioridad: p.prioridad,
      modalidadPlazo: p.modalidad,
      fuero: p.fuero,
    });
  }
  for (const e of mesEventosRes.data ?? []) {
    const exp = toOne(e.expedientes);
    mesItems.push({
      id: e.id,
      fecha: e.inicio,
      hora: e.todo_el_dia ? null : e.inicio,
      tipo: "evento",
      titulo: e.titulo,
      expedienteId: e.expediente_id,
      expediente: exp?.caratula ?? null,
      descripcion: e.descripcion,
      fin: e.fin,
      todoElDia: e.todo_el_dia,
    });
  }

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
      href: "/plazos",
    },
    {
      icon: CalendarDays,
      label: "Audiencias esta semana",
      value: resumen.audiencias_semana,
      hint: "Próximos 7 días",
      href: "/agenda",
    },
    {
      icon: FolderOpen,
      label: "Expedientes activos",
      value: resumen.expedientes_activos,
      hint: "Causas en curso",
      href: "/expedientes",
    },
    {
      icon: Users,
      label: "Clientes",
      value: resumen.clientes_total,
      hint: "Cartera del estudio",
      href: "/clientes",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <FadeIn>
        <PageHeader
          title={saludo}
          description={hoy}
          icon={<LayoutDashboard className="size-5" />}
        />
      </FadeIn>

      <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <StatCard
              icon={s.icon}
              label={s.label}
              value={s.value}
              hint={s.hint}
              alerta={s.alerta}
              href={s.href}
            />
          </StaggerItem>
        ))}
      </Stagger>

      {/* Hero a todo el ancho: próximos vencimientos (con scroll propio). */}
      <FadeIn delay={0.05}>
        <VencimientosList plazos={plazos} />
      </FadeIn>

      {/* Tres columnas simétricas: calendario · agenda · expedientes. */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <FadeIn delay={0.1}>
          <MiniCalendario items={mesItems} />
        </FadeIn>
        <FadeIn delay={0.15}>
          <AgendaWidget audiencias={audiencias} />
        </FadeIn>
        <FadeIn delay={0.2}>
          <ExpedientesRecientes expedientes={expedientes} />
        </FadeIn>
      </div>

      <FadeIn delay={0.25}>
        <AccesosRapidos />
      </FadeIn>
    </div>
  );
}

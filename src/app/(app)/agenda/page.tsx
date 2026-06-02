import { Calendar } from "lucide-react";
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
import type { PlazoDetalle } from "@/lib/types/domain";
import { PageHeader } from "@/components/ui/page-header";
import { NuevaAudienciaDialog } from "@/components/agenda/nueva-audiencia-dialog";
import { AgendaVista } from "@/components/agenda/agenda-vista";
import type { AgendaItem } from "@/components/agenda/tipos";

export const metadata = { title: "Agenda" };

/** Normaliza una relación to-one embebida (objeto o array) a un objeto o null. */
function toOne<T>(rel: T | T[] | null | undefined): T | null {
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel ?? null;
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ nueva?: string; expediente?: string; mes?: string; vista?: string }>;
}) {
  const sp = await searchParams;
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();

  // Mes visible (YYYY-MM) y rango de la grilla del calendario (semanas completas).
  const mesValido = typeof sp.mes === "string" && /^\d{4}-\d{2}$/.test(sp.mes);
  const anchor = mesValido
    ? new Date(`${sp.mes}-01T12:00:00`)
    : (() => {
        const n = new Date();
        return new Date(n.getFullYear(), n.getMonth(), 1, 12);
      })();
  const mes = fmtDate(anchor, "yyyy-MM");
  const vista: "mes" | "lista" = sp.vista === "lista" ? "lista" : "mes";

  const gridStart = startOfWeek(startOfMonth(anchor), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(anchor), { weekStartsOn: 1 });
  // Buffer de ±1-2 días para evitar cortes por zona horaria.
  const fetchDesde = addDays(gridStart, -1);
  const fetchHasta = addDays(gridEnd, 2);
  const desdeISO = fetchDesde.toISOString();
  const hastaISO = fetchHasta.toISOString();
  const desdeFecha = fmtDate(fetchDesde, "yyyy-MM-dd");
  const hastaFecha = fmtDate(fetchHasta, "yyyy-MM-dd");

  const [{ data: audiencias }, { data: plazos }, { data: eventos }, { data: expedientes }] =
    await Promise.all([
      supabase
        .from("audiencias")
        .select(
          "id, titulo, fecha_hora, duracion_min, modalidad, lugar, juzgado, enlace, expediente_id, expedientes(caratula)",
        )
        .eq("estudio_id", activeEstudio.id)
        .eq("estado", "programada")
        .gte("fecha_hora", desdeISO)
        .lte("fecha_hora", hastaISO)
        .order("fecha_hora", { ascending: true }),
      supabase
        .from("v_plazos_detalle")
        .select("*")
        .eq("estudio_id", activeEstudio.id)
        .eq("estado", "pendiente")
        .gte("fecha_vencimiento", desdeFecha)
        .lte("fecha_vencimiento", hastaFecha)
        .order("fecha_vencimiento", { ascending: true }),
      supabase
        .from("eventos_agenda")
        .select(
          "id, titulo, inicio, fin, todo_el_dia, descripcion, expediente_id, expedientes(caratula)",
        )
        .eq("estudio_id", activeEstudio.id)
        .gte("inicio", desdeISO)
        .lte("inicio", hastaISO)
        .order("inicio", { ascending: true }),
      supabase
        .from("expedientes")
        .select("id, caratula")
        .eq("estudio_id", activeEstudio.id)
        .eq("archivado", false)
        .order("created_at", { ascending: false }),
    ]);

  const items: AgendaItem[] = [];

  for (const a of audiencias ?? []) {
    const exp = toOne(a.expedientes);
    items.push({
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

  for (const p of (plazos as PlazoDetalle[]) ?? []) {
    if (!p.id || !p.fecha_vencimiento) continue;
    items.push({
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

  for (const e of eventos ?? []) {
    const exp = toOne(e.expedientes);
    items.push({
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

  const expedientesLite = expedientes ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Audiencias, plazos y eventos del estudio en un solo calendario."
        icon={<Calendar className="size-5" />}
      >
        <NuevaAudienciaDialog
          expedientes={expedientesLite}
          abrirAlInicio={sp.nueva === "1"}
          expedientePreseleccionado={sp.expediente}
        />
      </PageHeader>

      <AgendaVista items={items} mes={mes} vista={vista} />
    </div>
  );
}

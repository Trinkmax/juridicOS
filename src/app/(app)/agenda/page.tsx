import { Calendar } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { PlazoDetalle } from "@/lib/types/domain";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { NuevaAudienciaDialog } from "@/components/agenda/nueva-audiencia-dialog";
import { AgendaLista, type AgendaItem } from "@/components/agenda/agenda-lista";

export const metadata = { title: "Agenda" };

const HORIZONTE_DIAS = 30;

/** Normaliza una relación to-one embebida (objeto o array) a un objeto o null. */
function toOne<T>(rel: T | T[] | null | undefined): T | null {
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel ?? null;
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ nueva?: string; expediente?: string }>;
}) {
  const sp = await searchParams;
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();

  const ahora = new Date();
  const desde = new Date(ahora);
  desde.setHours(0, 0, 0, 0);
  const hasta = new Date(desde);
  hasta.setDate(hasta.getDate() + HORIZONTE_DIAS);

  const desdeISO = desde.toISOString();
  const hastaISO = hasta.toISOString();
  const hoyFecha = desde.toISOString().slice(0, 10);
  const hastaFecha = hasta.toISOString().slice(0, 10);

  const [{ data: audiencias }, { data: plazos }, { data: eventos }, { data: expedientes }] =
    await Promise.all([
      supabase
        .from("audiencias")
        .select("id, titulo, fecha_hora, expediente_id, expedientes(caratula)")
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
        .gte("fecha_vencimiento", hoyFecha)
        .lte("fecha_vencimiento", hastaFecha)
        .order("fecha_vencimiento", { ascending: true }),
      supabase
        .from("eventos_agenda")
        .select("id, titulo, inicio, expediente_id, expedientes(caratula)")
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
    });
  }

  for (const e of eventos ?? []) {
    const exp = toOne(e.expedientes);
    items.push({
      id: e.id,
      fecha: e.inicio,
      hora: e.inicio,
      tipo: "evento",
      titulo: e.titulo,
      expedienteId: e.expediente_id,
      expediente: exp?.caratula ?? null,
    });
  }

  const expedientesLite = expedientes ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description={`Audiencias, plazos y eventos de los próximos ${HORIZONTE_DIAS} días.`}
        icon={<Calendar className="size-5" />}
      >
        <NuevaAudienciaDialog
          expedientes={expedientesLite}
          abrirAlInicio={sp.nueva === "1"}
          expedientePreseleccionado={sp.expediente}
        />
      </PageHeader>

      {items.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Agenda despejada"
          description="No hay audiencias, plazos ni eventos en los próximos días. Cuando agendes algo, va a aparecer acá."
        />
      ) : (
        <AgendaLista items={items} />
      )}
    </div>
  );
}

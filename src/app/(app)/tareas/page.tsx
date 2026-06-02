import { ListTodo } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { FadeIn } from "@/components/motion/fade-in";
import {
  KanbanBoard,
  type TareaConRelaciones,
} from "@/components/tareas/kanban-board";
import { NuevaTareaDialog } from "@/components/tareas/nueva-tarea-dialog";
import type {
  MiembroOption,
  ExpedienteOption,
} from "@/components/tareas/tarea-form";

export const metadata = { title: "Tareas" };

/** Joins to-one de Supabase pueden llegar como objeto o array de 1. */
function toOne<T>(rel: T | T[] | null | undefined): T | null {
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel ?? null;
}

export default async function TareasPage() {
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();

  const [{ data: tareasRaw }, { data: miembrosRaw }, { data: expedientesRaw }] =
    await Promise.all([
      supabase
        .from("tareas")
        .select(
          "*, expedientes(caratula), asignado:usuarios!tareas_asignado_a_fkey(nombre_completo, avatar_url)",
        )
        .eq("estudio_id", activeEstudio.id)
        .neq("estado", "cancelada")
        .order("orden", { ascending: true }),
      supabase
        .from("miembros_estudio")
        .select(
          "usuario_id, rol, usuarios!miembros_estudio_usuario_id_fkey(nombre_completo, nombre)",
        )
        .eq("estudio_id", activeEstudio.id)
        .eq("activo", true)
        .neq("rol", "cliente"),
      supabase
        .from("expedientes")
        .select("id, caratula")
        .eq("estudio_id", activeEstudio.id)
        .eq("archivado", false)
        .order("caratula", { ascending: true }),
    ]);

  const tareas: TareaConRelaciones[] = (tareasRaw ?? []).map((row) => {
    const { expedientes, asignado, ...tarea } = row;
    return {
      ...tarea,
      expediente: toOne(expedientes),
      asignado: toOne(asignado),
    };
  });

  const miembros: MiembroOption[] = (miembrosRaw ?? [])
    .map((m) => {
      const u = toOne(m.usuarios);
      return {
        id: m.usuario_id,
        nombre: u?.nombre_completo || u?.nombre || "Sin nombre",
      };
    })
    .filter((m) => m.nombre !== "Sin nombre");

  const expedientes: ExpedienteOption[] = (expedientesRaw ?? []).map((e) => ({
    id: e.id,
    caratula: e.caratula,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tareas"
        description="El tablero del estudio: arrastrá tareas entre columnas para avanzarlas."
        icon={<ListTodo className="size-5" />}
      >
        <NuevaTareaDialog miembros={miembros} expedientes={expedientes} />
      </PageHeader>

      <FadeIn>
        <KanbanBoard
          tareasIniciales={tareas}
          miembros={miembros}
          expedientes={expedientes}
        />
      </FadeIn>
    </div>
  );
}

import { UsersRound, Scale, ShieldCheck, Mail } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import {
  MiembroCard,
  type MiembroConCarga,
} from "@/components/equipo/miembro-card";
import type { Rol } from "@/lib/constants";

export const metadata = { title: "Equipo" };

type UsuarioEmbed = {
  id: string;
  nombre_completo: string | null;
  email: string | null;
  avatar_url: string | null;
  matricula: string | null;
  titulo: string | null;
};

/** Normaliza un embed to-one que PostgREST puede tipar como objeto o array. */
function toOne<T>(rel: T | T[] | null | undefined): T | null {
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel ?? null;
}

export default async function EquipoPage() {
  const { activeEstudio, userId, rol } = await requireEstudio();
  const esOwner = rol === "owner";
  const supabase = await createClient();

  const { data: miembrosRaw } = await supabase
    .from("miembros_estudio")
    .select(
      "id, rol, activo, created_at, usuarios!miembros_estudio_usuario_id_fkey(id, nombre_completo, email, avatar_url, matricula, titulo)",
    )
    .eq("estudio_id", activeEstudio.id)
    .order("created_at", { ascending: true });

  const miembros = (miembrosRaw ?? [])
    .map((m) => ({ ...m, usuario: toOne(m.usuarios) as UsuarioEmbed | null }))
    .filter(
      (m): m is typeof m & { usuario: UsuarioEmbed } => m.usuario !== null,
    );

  // Carga de trabajo: traemos los pendientes del estudio y agregamos en memoria.
  const [{ data: plazosRaw }, { data: tareasRaw }] = await Promise.all([
    supabase
      .from("v_plazos_detalle")
      .select("responsable_id")
      .eq("estudio_id", activeEstudio.id)
      .eq("estado", "pendiente"),
    supabase
      .from("tareas")
      .select("asignado_a")
      .eq("estudio_id", activeEstudio.id)
      .in("estado", ["pendiente", "en_curso", "en_revision"]),
  ]);

  const plazosPorResp = new Map<string, number>();
  for (const p of plazosRaw ?? []) {
    if (p.responsable_id) {
      plazosPorResp.set(
        p.responsable_id,
        (plazosPorResp.get(p.responsable_id) ?? 0) + 1,
      );
    }
  }

  const tareasPorResp = new Map<string, number>();
  for (const t of tareasRaw ?? []) {
    if (t.asignado_a) {
      tareasPorResp.set(
        t.asignado_a,
        (tareasPorResp.get(t.asignado_a) ?? 0) + 1,
      );
    }
  }

  const items: MiembroConCarga[] = miembros.map((m) => {
    const usuario = m.usuario;
    return {
      id: m.id,
      rol: m.rol as Rol,
      activo: m.activo,
      createdAt: m.created_at,
      usuario,
      esYo: usuario.id === userId,
      plazos: plazosPorResp.get(usuario.id) ?? 0,
      tareas: tareasPorResp.get(usuario.id) ?? 0,
    };
  });

  const total = items.length;
  const activos = items.filter((m) => m.activo).length;
  const abogados = items.filter(
    (m) => m.rol === "abogado" || m.rol === "owner",
  ).length;
  const administradores = items.filter((m) => m.rol === "owner").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipo del estudio"
        description="Quiénes integran el estudio, sus roles y su carga de trabajo actual."
        icon={<UsersRound className="size-5" />}
      >
        {esOwner && (
          <Badge tone="muted" className="hidden sm:inline-flex">
            <Mail className="size-3" />
            Invitaciones por email: próximamente
          </Badge>
        )}
      </PageHeader>

      <FadeIn>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            icon={UsersRound}
            label="Integrantes"
            value={total}
            hint={`${activos} ${activos === 1 ? "activo" : "activos"}`}
          />
          <StatCard
            icon={Scale}
            label="Abogados"
            value={abogados}
            hint="Con cartera de causas"
          />
          <StatCard
            icon={ShieldCheck}
            label="Administradores"
            value={administradores}
            hint="Acceso total al estudio"
            className="col-span-2 lg:col-span-1"
          />
        </div>
      </FadeIn>

      {esOwner && (
        <div className="sm:hidden">
          <Badge tone="muted">
            <Mail className="size-3" />
            Invitaciones por email: próximamente
          </Badge>
        </div>
      )}

      <Stagger className="grid gap-3">
        {items.map((m) => (
          <StaggerItem key={m.id}>
            <MiembroCard miembro={m} puedeGestionar={esOwner} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

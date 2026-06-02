import { Clock, ListChecks, BadgeCheck, IdCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { OptionBadge } from "@/components/ui/status-badge";
import { ROL } from "@/lib/constants";
import type { Rol } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CambiarRolControl } from "@/components/equipo/cambiar-rol-control";

export type MiembroConCarga = {
  id: string;
  rol: Rol;
  activo: boolean;
  createdAt: string;
  usuario: {
    id: string;
    nombre_completo: string | null;
    email: string | null;
    avatar_url: string | null;
    matricula: string | null;
    titulo: string | null;
  };
  esYo: boolean;
  plazos: number;
  tareas: number;
};

/** Chip de carga de trabajo (plazos pendientes / tareas activas). */
function CargaChip({
  icon: Icon,
  value,
  label,
  destacar,
}: {
  icon: typeof Clock;
  value: number;
  label: string;
  destacar?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium tabular-nums",
        value > 0 && destacar
          ? "bg-warning-soft text-warning-foreground"
          : value > 0
            ? "bg-muted text-foreground"
            : "bg-muted/60 text-muted-foreground",
      )}
    >
      <Icon className="size-3.5" />
      {value} {label}
    </span>
  );
}

export function MiembroCard({
  miembro,
  puedeGestionar,
}: {
  miembro: MiembroConCarga;
  puedeGestionar: boolean;
}) {
  const { usuario } = miembro;
  const nombre = usuario.nombre_completo?.trim() || usuario.email || "Sin nombre";
  const subtitulo = [usuario.titulo, usuario.matricula && `Mat. ${usuario.matricula}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card
      className={cn(
        "flex flex-col gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md lg:flex-row lg:items-center",
        !miembro.activo && "opacity-60",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar name={nombre} src={usuario.avatar_url} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium">{nombre}</span>
            {miembro.esYo && (
              <Badge tone="primary">
                <BadgeCheck className="size-3" />
                Vos
              </Badge>
            )}
            {!miembro.activo && <Badge tone="muted">Inactivo</Badge>}
          </div>
          <div className="mt-0.5 flex flex-col gap-0.5 text-sm text-muted-foreground">
            {usuario.email && <span className="truncate">{usuario.email}</span>}
            {subtitulo && (
              <span className="flex items-center gap-1.5 truncate">
                <IdCard className="size-3.5 shrink-0" />
                {subtitulo}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <CargaChip
          icon={Clock}
          value={miembro.plazos}
          label={miembro.plazos === 1 ? "plazo" : "plazos"}
          destacar
        />
        <CargaChip
          icon={ListChecks}
          value={miembro.tareas}
          label={miembro.tareas === 1 ? "tarea" : "tareas"}
        />
      </div>

      <div className="lg:ml-2 lg:shrink-0">
        {puedeGestionar ? (
          <CambiarRolControl
            miembroId={miembro.id}
            rol={miembro.rol}
            activo={miembro.activo}
            esYo={miembro.esYo}
          />
        ) : (
          <OptionBadge option={ROL[miembro.rol]} dot />
        )}
      </div>
    </Card>
  );
}

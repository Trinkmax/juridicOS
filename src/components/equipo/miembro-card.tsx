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
  // Ámbar solo cuando hay plazos pendientes (urgencia real); el resto, tinta.
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
        value > 0 && destacar
          ? "border-warning/40 bg-warning-soft text-warning-foreground"
          : value > 0
            ? "border-border bg-muted text-foreground"
            : "border-transparent bg-muted/50 text-muted-foreground",
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="text-data tabular-nums">{value}</span> {label}
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
        "flex flex-col gap-5 p-5 shadow-xs transition-colors hover:border-foreground/20 lg:flex-row lg:items-center lg:gap-6",
        !miembro.activo && "opacity-60",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <Avatar name={nombre} src={usuario.avatar_url} size="lg" />
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-display text-base font-semibold">
              {nombre}
            </span>
            {miembro.esYo && (
              <Badge tone="primary">
                <BadgeCheck className="size-3" />
                Vos
              </Badge>
            )}
            {!miembro.activo && <Badge tone="muted">Inactivo</Badge>}
          </div>
          <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
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

      <div className="lg:shrink-0">
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

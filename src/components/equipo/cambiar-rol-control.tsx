"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cambiarRol, activarMiembro } from "@/lib/actions/equipo";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ROLES_INTERNOS, ROL } from "@/lib/constants";
import type { Rol } from "@/lib/constants";

/** Opciones de rol asignables: internos + cliente. */
const OPCIONES_ROL = [...ROLES_INTERNOS, ROL.cliente];

export function CambiarRolControl({
  miembroId,
  rol,
  activo,
  esYo,
}: {
  miembroId: string;
  rol: Rol;
  activo: boolean;
  esYo: boolean;
}) {
  const router = useRouter();
  const [rolActual, setRolActual] = React.useState<Rol>(rol);
  const [pendingRol, startRol] = React.useTransition();
  const [pendingActivo, startActivo] = React.useTransition();

  function onCambiarRol(nuevo: string) {
    if (nuevo === rolActual) return;
    const previo = rolActual;
    setRolActual(nuevo as Rol);
    startRol(async () => {
      const res = await cambiarRol(miembroId, nuevo);
      if (res.ok) {
        toast.success(res.message ?? "Rol actualizado.");
        router.refresh();
      } else {
        setRolActual(previo);
        toast.error(res.error);
      }
    });
  }

  function onToggleActivo(siguiente: boolean) {
    startActivo(async () => {
      const res = await activarMiembro(miembroId, siguiente);
      if (res.ok) {
        toast.success(res.message ?? "Listo.");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  const switchId = `activo-${miembroId}`;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <div className="flex items-center gap-2">
        <Select
          value={rolActual}
          onValueChange={onCambiarRol}
          disabled={esYo || pendingRol}
        >
          <SelectTrigger className="h-9 w-[200px]" aria-label="Cambiar rol">
            {pendingRol ? (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Guardando…
              </span>
            ) : (
              <SelectValue />
            )}
          </SelectTrigger>
          <SelectContent>
            {OPCIONES_ROL.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id={switchId}
          checked={activo}
          onCheckedChange={onToggleActivo}
          disabled={esYo || pendingActivo}
        />
        <Label
          htmlFor={switchId}
          className="cursor-pointer text-sm text-muted-foreground"
        >
          {activo ? "Activo" : "Inactivo"}
        </Label>
      </div>
    </div>
  );
}

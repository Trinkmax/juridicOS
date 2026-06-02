"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Check, RotateCcw, Trash2 } from "lucide-react";
import type { EstadoPlazo } from "@/lib/constants";
import { marcarCumplido, reabrirPlazo, eliminarPlazo } from "@/lib/actions/plazos";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function PlazoAcciones({
  id,
  estado,
}: {
  id: string;
  estado: EstadoPlazo;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function run(
    fn: () => Promise<{ ok: boolean; error?: string }>,
    success: string,
  ) {
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        toast.success(success);
        router.refresh();
      } else {
        toast.error(res.error || "No se pudo completar la acción.");
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Acciones del plazo" disabled={pending}>
          {pending ? <Spinner /> : <MoreHorizontal className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {estado === "pendiente" ? (
          <DropdownMenuItem
            onSelect={() => run(() => marcarCumplido(id), "Plazo marcado como cumplido.")}
          >
            <Check className="size-4" />
            Marcar cumplido
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onSelect={() => run(() => reabrirPlazo(id), "Plazo reabierto.")}
          >
            <RotateCcw className="size-4" />
            Reabrir
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive-soft focus:text-destructive [&_svg]:text-destructive"
          onSelect={() => run(() => eliminarPlazo(id), "Plazo eliminado.")}
        >
          <Trash2 className="size-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

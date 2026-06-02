"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

type Vista = "tablero" | "lista";

/**
 * Toggle de vista Tablero / Lista. La vista activa vive en la URL (?vista=…)
 * para que el server component decida cómo renderizar. Preserva el resto de
 * los filtros (estado, responsable) al cambiar de vista.
 */
export function PlazosVistaToggle({ vista }: { vista: Vista }) {
  const searchParams = useSearchParams();

  function href(v: Vista) {
    const params = new URLSearchParams(searchParams.toString());
    if (v === "tablero") params.delete("vista");
    else params.set("vista", v);
    const qs = params.toString();
    return qs ? `/plazos?${qs}` : "/plazos";
  }

  const opciones: { value: Vista; label: string; icon: typeof LayoutGrid }[] = [
    { value: "tablero", label: "Tablero", icon: LayoutGrid },
    { value: "lista", label: "Lista", icon: List },
  ];

  return (
    <div
      className="flex items-center rounded-md border border-border p-0.5"
      role="group"
      aria-label="Cambiar vista de plazos"
    >
      {opciones.map((o) => {
        const activa = vista === o.value;
        const Icon = o.icon;
        return (
          <Link
            key={o.value}
            href={href(o.value)}
            scroll={false}
            aria-current={activa ? "true" : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-sm transition-colors sm:py-1",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              activa
                ? "bg-secondary font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {o.label}
          </Link>
        );
      })}
    </div>
  );
}

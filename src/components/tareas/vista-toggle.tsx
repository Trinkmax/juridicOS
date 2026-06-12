import Link from "next/link";
import { LayoutGrid, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

export type VistaTareas = "tablero" | "vencimientos";

const OPCIONES: {
  value: VistaTareas;
  label: string;
  icon: typeof LayoutGrid;
}[] = [
  { value: "tablero", label: "Tablero", icon: LayoutGrid },
  { value: "vencimientos", label: "Vencimientos", icon: CalendarClock },
];

/** Toggle de vista (segmented) que navega por URL `?vista=`. */
export function VistaToggle({ vista }: { vista: VistaTareas }) {
  return (
    <div
      className="flex items-center rounded-lg border border-border bg-card p-1 shadow-xs"
      role="tablist"
      aria-label="Vista de tareas"
    >
      {OPCIONES.map((o) => {
        const activa = vista === o.value;
        const Icon = o.icon;
        return (
          <Link
            key={o.value}
            href={`/tareas?vista=${o.value}`}
            scroll={false}
            role="tab"
            aria-selected={activa}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
              activa
                ? "bg-secondary font-medium text-foreground shadow-xs"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
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

import Link from "next/link";
import { FolderPlus, UserPlus, CalculatorIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Acceso = {
  href: string;
  label: string;
  hint: string;
  icon: LucideIcon;
};

const ACCESOS: Acceso[] = [
  {
    href: "/expedientes/nuevo",
    label: "Nuevo expediente",
    hint: "Cargá una causa nueva",
    icon: FolderPlus,
  },
  {
    href: "/clientes/nuevo",
    label: "Nuevo cliente",
    hint: "Sumá un cliente al estudio",
    icon: UserPlus,
  },
  {
    href: "/plazos/calculadora",
    label: "Calcular plazo",
    hint: "Computá un plazo procesal",
    icon: CalculatorIcon,
  },
];

/** The dashboard's three primary jump-off actions. */
export function AccesosRapidos({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-3", className)}>
      {ACCESOS.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="group flex items-center gap-3.5 rounded-lg border border-border bg-card p-4 shadow-xs transition-colors hover:border-foreground/20"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
            <a.icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-tight transition-colors group-hover:text-primary">
              {a.label}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{a.hint}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

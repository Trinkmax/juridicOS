import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Calendar,
  CalendarClock,
  Calculator,
  CheckSquare,
  FileText,
  Sparkles,
  ScanText,
  Receipt,
  BarChart3,
  UsersRound,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
};

export type NavGroup = { label?: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  { items: [{ href: "/dashboard", label: "Inicio", icon: LayoutDashboard }] },
  {
    label: "Gestión",
    items: [
      { href: "/expedientes", label: "Expedientes", icon: FolderOpen },
      { href: "/clientes", label: "Clientes", icon: Users },
      { href: "/agenda", label: "Agenda", icon: Calendar },
      { href: "/plazos", label: "Plazos", icon: CalendarClock },
      { href: "/tareas", label: "Tareas", icon: CheckSquare },
    ],
  },
  {
    label: "Herramientas",
    items: [
      { href: "/plazos/calculadora", label: "Calculadora de plazos", icon: Calculator },
      { href: "/ingesta", label: "Ingesta de cédulas", icon: ScanText },
      { href: "/redaccion", label: "Redacción con IA", icon: Sparkles },
      { href: "/documentos", label: "Documentos", icon: FileText },
    ],
  },
  {
    label: "Facturación",
    items: [
      { href: "/honorarios", label: "Honorarios", icon: Receipt },
      { href: "/reportes", label: "Reportes", icon: BarChart3 },
    ],
  },
  {
    label: "Estudio",
    items: [
      { href: "/equipo", label: "Equipo", icon: UsersRound },
      { href: "/configuracion", label: "Configuración", icon: Settings },
    ],
  },
];

export const NAV_ITEMS_FLAT = NAV.flatMap((g) => g.items);

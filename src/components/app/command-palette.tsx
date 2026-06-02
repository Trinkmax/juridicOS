"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, FolderPlus, UserPlus, Calculator, CalendarPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NAV } from "@/lib/nav";
import { Kbd } from "@/components/ui/kbd";

const ACCIONES = [
  { label: "Nuevo expediente", href: "/expedientes/nuevo", icon: FolderPlus },
  { label: "Nuevo cliente", href: "/clientes/nuevo", icon: UserPlus },
  { label: "Calcular un plazo", href: "/plazos/calculadora", icon: Calculator },
  { label: "Nueva audiencia", href: "/agenda?nueva=1", icon: CalendarPlus },
];

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    document.addEventListener("keydown", onKey);
    window.addEventListener("jos:command", onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("jos:command", onOpen);
    };
  }, []);

  function run(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!top-[14%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Buscar y acciones</DialogTitle>
        <DialogDescription className="sr-only">
          Navegá o ejecutá acciones rápidas en juridicOS.
        </DialogDescription>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Command.Input
              placeholder="Buscar o ejecutar una acción…"
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
            <Kbd>esc</Kbd>
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              Sin resultados.
            </Command.Empty>
            <Command.Group heading="Acciones rápidas">
              {ACCIONES.map((a) => (
                <Command.Item
                  key={a.href}
                  value={a.label}
                  onSelect={() => run(a.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <a.icon className="size-4 text-muted-foreground" />
                  {a.label}
                </Command.Item>
              ))}
            </Command.Group>
            {NAV.map((group, gi) => (
              <Command.Group key={gi} heading={group.label ?? "Navegación"}>
                {group.items.map((item) => (
                  <Command.Item
                    key={item.href}
                    value={`${item.label} ${group.label ?? ""}`}
                    onSelect={() => run(item.href)}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                  >
                    <item.icon className="size-4 text-muted-foreground" />
                    {item.label}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

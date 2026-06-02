"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { switchEstudioAction } from "@/lib/actions/estudio";
import { cn, initials } from "@/lib/utils";
import type { EstudioConRol } from "@/lib/types/domain";

const PLAN_LABEL: Record<string, string> = {
  basico: "Básico",
  pro: "Pro",
  premium: "Premium",
};

export function EstudioSwitcher({
  estudios,
  active,
}: {
  estudios: EstudioConRol[];
  active: EstudioConRol;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function select(id: string) {
    if (id === active.id) return;
    startTransition(async () => {
      await switchEstudioAction(id);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={pending}
        className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-card p-2 text-left transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-foreground text-sm font-semibold text-background">
          {initials(active.nombre)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{active.nombre}</span>
          <span className="block truncate text-xs text-muted-foreground">
            Plan {PLAN_LABEL[active.plan] ?? active.plan}
          </span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[15rem]">
        <DropdownMenuLabel>Tus estudios</DropdownMenuLabel>
        {estudios.map((e) => (
          <DropdownMenuItem key={e.id} onSelect={() => select(e.id)}>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold">
              {initials(e.nombre)}
            </span>
            <span className="min-w-0 flex-1 truncate">{e.nombre}</span>
            {e.id === active.id && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className={cn("text-muted-foreground")}>
          <Building2 className="size-4" />
          Crear otro estudio
          <span className="ml-auto text-[0.625rem]">Pronto</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

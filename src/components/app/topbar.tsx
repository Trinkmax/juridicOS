"use client";

import { Search } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";
import { CommandPalette } from "./command-palette";
import { NotificationsBell } from "./notifications-bell";
import { Kbd } from "@/components/ui/kbd";
import type { EstudioConRol } from "@/lib/types/domain";
import type { Rol } from "@/lib/constants";

export function Topbar({
  user,
  estudios,
  active,
}: {
  user: { name: string; email: string | null; avatarUrl: string | null; rol: Rol | null };
  estudios: EstudioConRol[];
  active: EstudioConRol;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <MobileNav estudios={estudios} active={active} />

      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("jos:command"))}
        className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-accent"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Buscar…</span>
        <Kbd className="ml-auto hidden sm:inline-flex">⌘K</Kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <NotificationsBell />
        <ThemeToggle />
        <div className="mx-1 h-5 w-px bg-border" />
        <UserMenu
          name={user.name}
          email={user.email}
          avatarUrl={user.avatarUrl}
          rol={user.rol}
        />
      </div>

      <CommandPalette />
    </header>
  );
}

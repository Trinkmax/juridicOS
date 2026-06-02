"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { SidebarNav } from "./sidebar-nav";
import { EstudioSwitcher } from "./estudio-switcher";
import type { EstudioConRol } from "@/lib/types/domain";

export function MobileNav({
  estudios,
  active,
}: {
  estudios: EstudioConRol[];
  active: EstudioConRol;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Menú">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
        <SheetTitle className="sr-only">Navegación</SheetTitle>
        <div className="flex h-[4.25rem] items-center justify-center px-5">
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <Logo className="h-9" />
          </Link>
        </div>
        <div className="px-3">
          <EstudioSwitcher estudios={estudios} active={active} />
        </div>
        <SidebarNav onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { EstudioSwitcher } from "./estudio-switcher";
import { SidebarNav } from "./sidebar-nav";
import type { EstudioConRol } from "@/lib/types/domain";

export function AppSidebar({
  estudios,
  active,
}: {
  estudios: EstudioConRol[];
  active: EstudioConRol;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-[4.25rem] items-center justify-center px-5">
        <Link href="/dashboard" className="transition-opacity hover:opacity-80">
          <Logo className="h-9" priority />
        </Link>
      </div>
      <div className="px-3 pb-2">
        <EstudioSwitcher estudios={estudios} active={active} />
      </div>
      <SidebarNav />
      <div className="border-t border-sidebar-border px-4 py-3 text-[0.6875rem] text-muted-foreground">
        juridicOS · v0.1 · Córdoba
      </div>
    </aside>
  );
}

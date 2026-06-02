"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, Settings, UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { logoutAction } from "@/lib/actions/auth";
import { ROL, type Rol } from "@/lib/constants";

export function UserMenu({
  name,
  email,
  avatarUrl,
  rol,
}: {
  name: string;
  email: string | null;
  avatarUrl: string | null;
  rol: Rol | null;
}) {
  const [, startTransition] = React.useTransition();
  const rolOption = rol ? ROL[rol] : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        <Avatar name={name} src={avatarUrl} size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="flex items-center gap-3 px-2.5 py-2">
          <Avatar name={name} src={avatarUrl} size="default" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        {rolOption && (
          <div className="px-2.5 pb-2">
            <Badge tone={rolOption.tone}>{rolOption.label}</Badge>
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/configuracion">
            <UserRound className="size-4" /> Mi perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/configuracion">
            <Settings className="size-4" /> Configuración
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive-soft focus:text-destructive [&_svg]:text-destructive"
          onSelect={(e) => {
            e.preventDefault();
            startTransition(() => logoutAction());
          }}
        >
          <LogOut className="size-4" /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

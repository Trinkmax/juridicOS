"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, CheckCheck, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
  getNotificaciones,
  marcarTodasLeidas,
} from "@/lib/actions/notificaciones";
import { etiquetaRelativa } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Recordatorio } from "@/lib/types/domain";

export function NotificationsBell() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<Recordatorio[]>([]);
  const [noLeidas, setNoLeidas] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [, startTransition] = React.useTransition();

  const cargar = React.useCallback(() => {
    setLoading(true);
    getNotificaciones()
      .then(({ items, noLeidas }) => {
        setItems(items);
        setNoLeidas(noLeidas);
      })
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    cargar();
  }, [cargar]);
  React.useEffect(() => {
    if (open) cargar();
  }, [open, cargar]);

  function todasLeidas() {
    startTransition(async () => {
      await marcarTodasLeidas();
      setNoLeidas(0);
      setItems((prev) => prev.map((i) => ({ ...i, leido: true })));
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative" aria-label="Notificaciones">
          <Bell className="size-4" />
          {noLeidas > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[0.625rem] font-semibold leading-4 text-destructive-foreground">
              {noLeidas > 9 ? "9+" : noLeidas}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <p className="text-sm font-semibold">Notificaciones</p>
          {noLeidas > 0 && (
            <button
              onClick={todasLeidas}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <CheckCheck className="size-3.5" /> Marcar leídas
            </button>
          )}
        </div>
        <ScrollArea className="max-h-[22rem]">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Spinner />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-3 py-10 text-center text-sm text-muted-foreground">
              <BellOff className="size-6 opacity-50" />
              Sin novedades por ahora
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => (
                <li
                  key={n.id}
                  className={cn("transition-colors", !n.leido && "bg-primary-soft/50")}
                >
                  <Link
                    href={n.url ?? "/dashboard"}
                    onClick={() => setOpen(false)}
                    className="flex gap-2.5 px-3 py-2.5 hover:bg-accent"
                  >
                    {!n.leido && (
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                    <div className={cn("min-w-0", n.leido && "pl-4")}>
                      <p className="truncate text-sm font-medium">{n.titulo}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{n.mensaje}</p>
                      <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                        {etiquetaRelativa(n.momento)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

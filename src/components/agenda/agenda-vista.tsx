"use client";

import * as React from "react";
import Link from "next/link";
import { parseISO, format, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { capitalizar } from "@/lib/format";
import { AgendaCalendario } from "./agenda-calendario";
import { AgendaLista } from "./agenda-lista";
import { EventoDetalle } from "./evento-detalle";
import { type AgendaItem } from "./tipos";

const LEYENDA: { dot: string; label: string }[] = [
  { dot: "bg-info", label: "Audiencia" },
  { dot: "bg-destructive", label: "Plazo" },
  { dot: "bg-primary", label: "Evento" },
];

export function AgendaVista({
  items,
  mes,
  vista,
}: {
  items: AgendaItem[];
  mes: string; // YYYY-MM
  vista: "mes" | "lista";
}) {
  const [sel, setSel] = React.useState<AgendaItem | null>(null);

  const anchor = parseISO(`${mes}-01`);
  const prevMes = format(addMonths(anchor, -1), "yyyy-MM");
  const nextMes = format(addMonths(anchor, 1), "yyyy-MM");
  const hoyMes = format(new Date(), "yyyy-MM");
  const titulo = capitalizar(format(anchor, "MMMM yyyy", { locale: es }));
  const href = (m: string, v: string) => `/agenda?mes=${m}&vista=${v}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="min-w-[8.5rem] font-display text-lg font-semibold capitalize">
            {titulo}
          </h2>
          <div className="flex items-center gap-1">
            <Button asChild variant="outline" size="icon-sm">
              <Link href={href(prevMes, vista)} aria-label="Mes anterior" scroll={false}>
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon-sm">
              <Link href={href(nextMes, vista)} aria-label="Mes siguiente" scroll={false}>
                <ChevronRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(mes === hoyMes && "text-primary")}
            >
              <Link href={href(hoyMes, vista)} scroll={false}>
                Hoy
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="hidden items-center gap-3 md:flex">
            {LEYENDA.map((l) => (
              <span
                key={l.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span className={cn("size-1.5 rounded-full", l.dot)} />
                {l.label}
              </span>
            ))}
          </div>
          <div className="flex items-center rounded-md border border-border p-0.5">
            <Link
              href={href(mes, "mes")}
              scroll={false}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-2.5 py-2 text-sm transition-colors sm:py-1",
                vista === "mes"
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <CalendarDays className="size-4" />
              Mes
            </Link>
            <Link
              href={href(mes, "lista")}
              scroll={false}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-2.5 py-2 text-sm transition-colors sm:py-1",
                vista === "lista"
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List className="size-4" />
              Agenda
            </Link>
          </div>
        </div>
      </div>

      {vista === "mes" ? (
        <AgendaCalendario items={items} mes={mes} onSelect={setSel} />
      ) : (
        <AgendaLista items={items} onSelect={setSel} />
      )}

      <Dialog open={!!sel} onOpenChange={(o) => { if (!o) setSel(null); }}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          {sel && <EventoDetalle item={sel} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

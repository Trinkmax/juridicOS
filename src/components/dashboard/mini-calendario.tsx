"use client";

import Link from "next/link";
import {
  parseISO,
  format,
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { capitalizar } from "@/lib/format";
import { itemTone, TONE_DOT, type AgendaItem } from "@/components/agenda/tipos";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const MAX_DOTS = 3;

function itemDate(item: AgendaItem): Date {
  return parseISO(item.hora ?? item.fecha);
}
function dayKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

/**
 * Mini-calendario compacto del mes actual para el dashboard. Cada día con
 * eventos muestra puntitos por tono (urgencia de plazo · audiencia · evento).
 * Click en un día con eventos navega a la agenda mensual posicionada en ese mes.
 */
export function MiniCalendario({ items }: { items: AgendaItem[] }) {
  const today = new Date();
  const anchor = new Date(today.getFullYear(), today.getMonth(), 1, 12);
  const mes = format(anchor, "yyyy-MM");
  const titulo = capitalizar(format(anchor, "MMMM yyyy", { locale: es }));

  const gridStart = startOfWeek(startOfMonth(anchor), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(anchor), { weekStartsOn: 1 });

  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);

  const byDay = new Map<string, AgendaItem[]>();
  for (const it of items) {
    const k = dayKey(itemDate(it));
    const arr = byDay.get(k) ?? [];
    arr.push(it);
    byDay.set(k, arr);
  }
  for (const arr of byDay.values()) {
    arr.sort((a, b) => itemDate(a).getTime() - itemDate(b).getTime());
  }

  const agendaHref = `/agenda?mes=${mes}&vista=mes`;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2 capitalize">
          <CalendarDays className="size-4 text-primary" />
          {titulo}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href={agendaHref}>Ver agenda</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-0.5">
          {WEEKDAYS.map((w, i) => (
            <div
              key={`${w}-${i}`}
              className="pb-1 text-center text-[0.625rem] font-semibold uppercase tracking-wide text-muted-foreground"
              aria-hidden
            >
              {w}
            </div>
          ))}

          {days.map((day) => {
            const k = dayKey(day);
            const dayItems = byDay.get(k) ?? [];
            const inMonth = isSameMonth(day, anchor);
            const isToday = isSameDay(day, today);
            const hasEvents = dayItems.length > 0;
            const dots = dayItems.slice(0, MAX_DOTS);

            const cell = (
              <>
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-md text-xs font-medium tabular-nums",
                    isToday && "bg-primary text-primary-foreground",
                    !isToday && inMonth && "text-foreground",
                    !isToday && !inMonth && "text-muted-foreground/40",
                  )}
                >
                  {format(day, "d")}
                </span>
                <span className="flex h-1.5 items-center justify-center gap-0.5">
                  {dots.map((it, di) => (
                    <span
                      key={`${it.tipo}-${it.id}-${di}`}
                      className={cn("size-1 rounded-full", TONE_DOT[itemTone(it)])}
                    />
                  ))}
                </span>
              </>
            );

            const aria = capitalizar(
              format(day, "EEEE d 'de' MMMM", { locale: es }),
            );

            if (hasEvents) {
              return (
                <Link
                  key={k}
                  href={agendaHref}
                  aria-label={`${aria}: ${dayItems.length} ${dayItems.length === 1 ? "evento" : "eventos"}`}
                  title={`${dayItems.length} ${dayItems.length === 1 ? "evento" : "eventos"}`}
                  className="flex flex-col items-center gap-1 rounded-md py-1 transition-colors hover:bg-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {cell}
                </Link>
              );
            }

            return (
              <div
                key={k}
                className="flex flex-col items-center gap-1 py-1"
                aria-label={aria}
              >
                {cell}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

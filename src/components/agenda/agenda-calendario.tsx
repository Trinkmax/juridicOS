"use client";

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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { capitalizar } from "@/lib/format";
import { itemTone, TONE_CHIP, TONE_DOT, type AgendaItem } from "./tipos";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MAX_CHIPS = 3;

function itemDate(item: AgendaItem): Date {
  return parseISO(item.hora ?? item.fecha);
}
function dayKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function AgendaCalendario({
  items,
  mes,
  onSelect,
}: {
  items: AgendaItem[];
  mes: string; // YYYY-MM
  onSelect: (item: AgendaItem) => void;
}) {
  const anchor = parseISO(`${mes}-01`);
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

  const today = new Date();

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <div className="grid grid-cols-7 border-b border-border bg-muted/30">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="px-1 py-2.5 text-center text-xs font-medium text-muted-foreground sm:px-2"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const k = dayKey(day);
          const dayItems = byDay.get(k) ?? [];
          const inMonth = isSameMonth(day, anchor);
          const isToday = isSameDay(day, today);
          const visible = dayItems.slice(0, MAX_CHIPS);
          const overflow = dayItems.length - visible.length;
          const lastRow = i >= days.length - 7;

          return (
            <div
              key={k}
              className={cn(
                "min-h-[5.5rem] border-b border-r border-border p-1.5 sm:min-h-[7.5rem] sm:p-2 [&:nth-child(7n)]:border-r-0",
                !inMonth && "bg-muted/25",
                lastRow && "border-b-0",
              )}
            >
              <div className="mb-1.5 flex justify-end px-0.5">
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-md text-xs font-medium text-data",
                    isToday && "bg-primary text-primary-foreground",
                    !isToday && inMonth && "text-foreground",
                    !isToday && !inMonth && "text-muted-foreground/40",
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-1">
                {visible.map((it) => {
                  const tone = itemTone(it);
                  return (
                    <button
                      key={`${it.tipo}-${it.id}`}
                      type="button"
                      onClick={() => onSelect(it)}
                      title={it.titulo}
                      className={cn(
                        "flex w-full items-center gap-1.5 rounded-sm border px-1.5 py-1 text-left text-[0.6875rem] leading-tight transition-opacity hover:opacity-80",
                        TONE_CHIP[tone],
                      )}
                    >
                      {it.hora && !it.todoElDia && (
                        <span className="hidden shrink-0 text-data opacity-80 sm:inline">
                          {format(itemDate(it), "HH:mm")}
                        </span>
                      )}
                      <span className="truncate font-medium">{it.titulo}</span>
                    </button>
                  );
                })}

                {overflow > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full rounded-sm px-1.5 py-1 text-left text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        +{overflow} más
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="max-h-[60vh] w-[min(16rem,calc(100vw-1.5rem))] overflow-y-auto p-2"
                    >
                      <p className="mb-2 px-1 font-display text-sm font-semibold capitalize">
                        {capitalizar(format(day, "EEEE d 'de' MMMM", { locale: es }))}
                      </p>
                      <div className="space-y-0.5">
                        {dayItems.map((it) => {
                          const tone = itemTone(it);
                          return (
                            <button
                              key={`${it.tipo}-${it.id}`}
                              type="button"
                              onClick={() => onSelect(it)}
                              className="flex w-full items-center gap-2 rounded-sm px-1.5 py-1.5 text-left text-xs transition-colors hover:bg-accent"
                            >
                              <span
                                className={cn("size-1.5 shrink-0 rounded-full", TONE_DOT[tone])}
                              />
                              {it.hora && !it.todoElDia && (
                                <span className="shrink-0 text-data text-muted-foreground">
                                  {format(itemDate(it), "HH:mm")}
                                </span>
                              )}
                              <span className="truncate">{it.titulo}</span>
                            </button>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

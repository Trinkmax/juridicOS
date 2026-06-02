"use client";

import { parseISO, format } from "date-fns";
import { FileText } from "lucide-react";
import { formatFecha, formatHora, capitalizar } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { itemTone, TIPO_LABEL, TONE_DOT, type AgendaItem } from "./tipos";

function itemDate(item: AgendaItem): Date {
  return parseISO(item.hora ?? item.fecha);
}

export function AgendaLista({
  items,
  onSelect,
}: {
  items: AgendaItem[];
  onSelect: (item: AgendaItem) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
        No hay audiencias, plazos ni eventos este mes.
      </p>
    );
  }

  const grupos = new Map<string, AgendaItem[]>();
  for (const item of items) {
    const k = format(itemDate(item), "yyyy-MM-dd");
    const arr = grupos.get(k) ?? [];
    arr.push(item);
    grupos.set(k, arr);
  }
  const dias = [...grupos.keys()].sort();

  return (
    <Stagger className="space-y-7">
      {dias.map((dia) => {
        const delDia = (grupos.get(dia) ?? []).sort(
          (a, b) => itemDate(a).getTime() - itemDate(b).getTime(),
        );
        return (
          <StaggerItem key={dia}>
            <div className="space-y-3">
              <h3 className="sticky top-0 z-10 -mx-1 bg-background/80 px-1 py-1 font-display text-sm font-semibold capitalize backdrop-blur">
                {capitalizar(formatFecha(dia, "EEEE d 'de' MMMM"))}
              </h3>
              <div className="space-y-2">
                {delDia.map((item) => (
                  <AgendaRow
                    key={`${item.tipo}-${item.id}`}
                    item={item}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

function AgendaRow({
  item,
  onSelect,
}: {
  item: AgendaItem;
  onSelect: (item: AgendaItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group flex w-full items-start gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent/60"
    >
      <span className="mt-1.5">
        <span className={cn("block size-2.5 rounded-full", TONE_DOT[itemTone(item)])} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {item.hora && !item.todoElDia && (
            <span className="font-mono text-data text-sm font-medium text-foreground">
              {formatHora(item.hora)}
            </span>
          )}
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {TIPO_LABEL[item.tipo]}
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm font-medium">{item.titulo}</p>
        {item.expedienteId && item.expediente && (
          <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="size-3.5" />
            <span className="max-w-[22rem] truncate">{item.expediente}</span>
          </span>
        )}
      </div>
    </button>
  );
}

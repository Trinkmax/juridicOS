import Link from "next/link";
import { FileText } from "lucide-react";
import { formatFecha, formatHora, capitalizar } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";

export type AgendaTipo = "audiencia" | "plazo" | "evento";

export type AgendaItem = {
  id: string;
  fecha: string; // ISO (con o sin hora)
  hora?: string; // ISO con hora, para mostrar HH:mm
  tipo: AgendaTipo;
  titulo: string;
  expedienteId?: string | null;
  expediente?: string | null;
};

const TIPO_DOT: Record<AgendaTipo, string> = {
  audiencia: "bg-info",
  plazo: "bg-destructive",
  evento: "bg-primary",
};

const TIPO_LABEL: Record<AgendaTipo, string> = {
  audiencia: "Audiencia",
  plazo: "Plazo",
  evento: "Evento",
};

function diaClave(iso: string) {
  return iso.slice(0, 10);
}

export function AgendaLista({ items }: { items: AgendaItem[] }) {
  const grupos = new Map<string, AgendaItem[]>();
  for (const item of items) {
    const k = diaClave(item.fecha);
    const arr = grupos.get(k) ?? [];
    arr.push(item);
    grupos.set(k, arr);
  }
  const dias = [...grupos.keys()].sort();

  return (
    <Stagger className="space-y-7">
      {dias.map((dia) => {
        const delDia = (grupos.get(dia) ?? []).sort((a, b) =>
          (a.hora ?? a.fecha).localeCompare(b.hora ?? b.fecha),
        );
        return (
          <StaggerItem key={dia}>
            <div className="space-y-3">
              <h3 className="sticky top-0 z-10 -mx-1 bg-background/80 px-1 py-1 font-display text-sm font-semibold capitalize backdrop-blur">
                {capitalizar(formatFecha(dia, "EEEE d 'de' MMMM"))}
              </h3>
              <div className="space-y-2">
                {delDia.map((item) => (
                  <AgendaRow key={`${item.tipo}-${item.id}`} item={item} />
                ))}
              </div>
            </div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

function AgendaRow({ item }: { item: AgendaItem }) {
  return (
    <div className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/60">
      <span className="mt-1.5 flex flex-col items-center gap-1">
        <span className={cn("size-2.5 rounded-full", TIPO_DOT[item.tipo])} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {item.hora && (
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
          <Link
            href={`/expedientes/${item.expedienteId}`}
            className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary hover:underline"
          >
            <FileText className="size-3.5" />
            <span className="max-w-[22rem] truncate">{item.expediente}</span>
          </Link>
        )}
      </div>
    </div>
  );
}

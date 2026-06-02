import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * One metric tile in the dashboard's KPI row. Big number, soft icon chip,
 * muted sub-line. `alerta` renders the optional red detail (e.g. "3 vencidos").
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  alerta,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
  alerta?: string;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-5 transition-colors hover:border-foreground/20",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-data text-3xl font-semibold tracking-tight">
            {value}
          </p>
          <div className="mt-1 min-h-[1.25rem] text-xs">
            {alerta ? (
              <span className="font-medium text-destructive">{alerta}</span>
            ) : hint ? (
              <span className="text-muted-foreground">{hint}</span>
            ) : null}
          </div>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}

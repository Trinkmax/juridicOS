import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * One metric tile in the dashboard's KPI row. Big number, soft icon chip,
 * muted sub-line. `alerta` renders the optional red detail (e.g. "3 vencidos").
 * If `href` is provided the whole tile becomes a navigation link (focus-visible
 * ring, tonal hover, subtle arrow affordance) while keeping the same layout.
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  alerta,
  href,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
  alerta?: string;
  href?: string;
  className?: string;
}) {
  const body = (
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
  );

  if (href) {
    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-colors hover:border-foreground/20",
          "focus-within:border-foreground/20",
          className,
        )}
      >
        <Link
          href={href}
          className="block rounded-lg p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5"
          aria-label={`${label}: ${value}`}
        >
          {body}
          <ArrowUpRight
            aria-hidden
            className="pointer-events-none absolute right-4 top-4 size-4 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/60"
          />
        </Link>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-4 transition-colors hover:border-foreground/20 sm:p-5",
        className,
      )}
    >
      {body}
    </Card>
  );
}

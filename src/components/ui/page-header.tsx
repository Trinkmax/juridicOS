import * as React from "react";
import { cn } from "@/lib/utils";

function PageHeader({
  title,
  description,
  children,
  className,
  icon,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-semibold sm:text-[1.75rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}

export { PageHeader };

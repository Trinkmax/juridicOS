import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[88px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs transition-colors",
        "placeholder:text-muted-foreground/70",
        "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
        "disabled:cursor-not-allowed disabled:opacity-50 resize-y",
        "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

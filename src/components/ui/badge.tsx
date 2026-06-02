import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/constants";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors whitespace-nowrap",
  {
    variants: {
      tone: {
        default: "border-border bg-secondary text-secondary-foreground",
        primary: "border-primary/20 bg-primary-soft text-primary",
        muted: "border-transparent bg-muted text-muted-foreground",
        info: "border-info/25 bg-info-soft text-info",
        success: "border-success/25 bg-success-soft text-success",
        warning: "border-warning/40 bg-warning-soft text-warning-foreground",
        destructive: "border-destructive/25 bg-destructive-soft text-destructive",
      } satisfies Record<Tone, string>,
    },
    defaultVariants: { tone: "default" },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  dot?: boolean;
}

function Badge({ className, tone, dot, asChild, children, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants };

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[transform,background-color,box-shadow,color] outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:brightness-110",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent border border-border/60",
        outline:
          "border border-input bg-card hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        subtle: "bg-primary-soft text-primary hover:brightness-95",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:brightness-110",
        success:
          "bg-success text-success-foreground shadow-sm hover:brightness-110",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-[0.8125rem]",
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-lg px-6 text-base",
        icon: "size-10",
        "icon-sm": "size-8 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { Button, buttonVariants };

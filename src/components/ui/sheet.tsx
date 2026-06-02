"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: "right" | "left" | "bottom";
}) {
  const sideClasses = {
    right:
      "inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=open]:animate-[sheet-in-right_0.35s_cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:animate-[sheet-out-right_0.25s_cubic-bezier(0.32,0.72,0,1)]",
    left:
      "inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=open]:animate-[sheet-in-left_0.35s_cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:animate-[sheet-out-left_0.25s_cubic-bezier(0.32,0.72,0,1)]",
    bottom:
      "inset-x-0 bottom-0 max-h-[85vh] rounded-t-lg border-t data-[state=open]:animate-[sheet-in-bottom_0.35s_cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:animate-[sheet-out-bottom_0.25s_cubic-bezier(0.32,0.72,0,1)]",
  };
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm data-[state=open]:animate-[overlay-in_0.3s_ease] data-[state=closed]:animate-[overlay-out_0.25s_ease]" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-card p-6 shadow-xl border-border",
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
          <X className="size-4" />
          <span className="sr-only">Cerrar</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-display text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
};

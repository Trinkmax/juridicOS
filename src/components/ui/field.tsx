import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

/** Label + control + error/hint wrapper. Used by every form in the app. */
function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label?: React.ReactNode;
  htmlFor?: string;
  error?: string | string[];
  hint?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const message = Array.isArray(error) ? error[0] : error;
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}
      {children}
      {message ? (
        <p className="text-xs font-medium text-destructive">{message}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function FormError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="rounded-lg border border-destructive/25 bg-destructive-soft px-3 py-2.5 text-sm font-medium text-destructive">
      {children}
    </div>
  );
}

export { Field, FormError };

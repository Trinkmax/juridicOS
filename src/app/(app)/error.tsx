"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-lg bg-destructive-soft text-destructive">
        <AlertTriangle className="size-7" />
      </div>
      <div>
        <h1 className="font-display text-lg font-semibold">Algo salió mal</h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Ocurrió un error inesperado. Podés reintentar; si persiste, recargá la página.
        </p>
      </div>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}

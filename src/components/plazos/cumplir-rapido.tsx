"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { marcarCumplido } from "@/lib/actions/plazos";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

/**
 * Acción rápida "Cumplir" para el tablero de triaje. Invoca la server action
 * `marcarCumplido` (sin duplicar lógica) y refresca al confirmarse.
 */
export function CumplirRapido({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function onCumplir() {
    startTransition(async () => {
      const res = await marcarCumplido(id);
      if (res.ok) {
        toast.success("Plazo marcado como cumplido.");
        router.refresh();
      } else {
        toast.error(res.error || "No se pudo completar la acción.");
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onCumplir}
      disabled={pending}
      aria-label="Marcar plazo como cumplido"
      className="text-success hover:border-success/40 hover:bg-success-soft hover:text-success"
    >
      {pending ? <Spinner /> : <Check className="size-4" />}
      Cumplir
    </Button>
  );
}

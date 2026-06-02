"use client";

import * as React from "react";
import { Download, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { urlDescargaPortal } from "@/lib/actions/portal";

function formatTamano(bytes: number | null): string | null {
  if (!bytes || bytes <= 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function DocumentoDescarga({
  id,
  nombre,
  tipo,
  tamanoBytes,
}: {
  id: string;
  nombre: string;
  tipo: string | null;
  tamanoBytes: number | null;
}) {
  const [pending, startTransition] = React.useTransition();
  const tamano = formatTamano(tamanoBytes);

  function descargar() {
    startTransition(async () => {
      const res = await urlDescargaPortal(id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      window.open(res.data!.url, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-3.5 transition-all hover:shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <FileText className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{nombre}</p>
        <p className="text-xs text-muted-foreground">
          {[tipo, tamano].filter(Boolean).join(" · ") || "Documento"}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={descargar}
        disabled={pending}
        className="shrink-0"
        aria-label={`Descargar ${nombre}`}
      >
        {pending ? <Loader2 className="animate-spin" /> : <Download />}
        <span className="hidden sm:inline">Descargar</span>
      </Button>
    </div>
  );
}

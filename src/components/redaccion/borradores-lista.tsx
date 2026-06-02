"use client";

import Link from "next/link";
import { FileSignature, Sparkles, ChevronRight } from "lucide-react";
import { formatFechaHora } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import type { BorradorItem } from "./tipos";

export function BorradoresLista({ borradores }: { borradores: BorradorItem[] }) {
  if (borradores.length === 0) {
    return (
      <EmptyState
        icon={FileSignature}
        title="Sin borradores guardados"
        description="Cuando guardes un documento desde el editor, va a aparecer acá para retomarlo."
      />
    );
  }

  return (
    <Stagger className="space-y-2">
      {borradores.map((b) => (
        <StaggerItem key={b.id}>
          <Link href={`/redaccion/${b.id}`} className="block">
            <Card className="group flex items-center gap-4 p-4 transition-colors hover:border-foreground/20 hover:bg-accent/60">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <FileSignature className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold group-hover:text-primary">
                    {b.titulo}
                  </h3>
                  {b.generado_por_ia && (
                    <Badge tone="primary">
                      <Sparkles className="size-3" />
                      IA
                    </Badge>
                  )}
                  {b.tipo && <Badge tone="muted">{b.tipo}</Badge>}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {b.expedientes?.caratula
                    ? b.expedientes.caratula
                    : "Sin expediente vinculado"}
                  {" · "}
                  {formatFechaHora(b.updated_at)}
                </p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </Card>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

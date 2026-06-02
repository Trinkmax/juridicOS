import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { OptionBadge } from "@/components/ui/status-badge";
import { FUERO, ESTADO_EXPEDIENTE } from "@/lib/constants";
import { etiquetaRelativa } from "@/lib/format";
import type { Expediente } from "@/lib/types/domain";

export type CausaPortal = Expediente & { clientes: { nombre: string } | null };

export function CausaCard({ causa }: { causa: CausaPortal }) {
  return (
    <Link
      href={`/portal/${causa.id}`}
      className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="h-full p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <OptionBadge option={FUERO[causa.fuero]} />
          <OptionBadge option={ESTADO_EXPEDIENTE[causa.estado]} dot />
        </div>

        <h2 className="mt-3 text-base font-semibold leading-snug text-balance">
          {causa.caratula}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {causa.nro_sac && (
            <span>
              SAC{" "}
              <span className="font-mono font-medium text-foreground">
                {causa.nro_sac}
              </span>
            </span>
          )}
          <span>Actualizada {etiquetaRelativa(causa.updated_at).toLowerCase()}</span>
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          Ver detalle
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Card>
    </Link>
  );
}

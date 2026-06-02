import { Badge } from "@/components/ui/badge";
import {
  URGENCIA,
  ESTADO_PLAZO,
  urgenciaDesdeDias,
  type EstadoPlazo,
  type Tone,
} from "@/lib/constants";
import { etiquetaVencimiento } from "@/lib/format";

/** The canonical deadline-urgency badge. Same language everywhere. */
export function PlazoUrgenciaBadge({
  diasRestantes,
  estado,
  fechaVencimiento,
}: {
  diasRestantes: number | null;
  estado: EstadoPlazo;
  fechaVencimiento?: string | null;
}) {
  if (estado !== "pendiente") {
    const o = ESTADO_PLAZO[estado];
    return <Badge tone={o.tone}>{o.label}</Badge>;
  }
  const u = urgenciaDesdeDias(diasRestantes);
  const info = URGENCIA[u];
  return (
    <Badge tone={info.tone} dot>
      {fechaVencimiento ? etiquetaVencimiento(fechaVencimiento) : info.label}
    </Badge>
  );
}

/** Tone of a pending plazo from days-remaining (for accent borders/dots). */
export function plazoTono(diasRestantes: number | null, estado: EstadoPlazo): Tone {
  if (estado !== "pendiente") return ESTADO_PLAZO[estado].tone ?? "muted";
  return URGENCIA[urgenciaDesdeDias(diasRestantes)].tone;
}

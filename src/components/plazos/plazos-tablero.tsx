import type { PlazoDetalle } from "@/lib/types/domain";
import type { Tone } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { PlazoCard } from "@/components/plazos/plazo-card";

/** Definición de un bucket de triaje por urgencia. */
type Bucket = {
  id: string;
  titulo: string;
  tono: Tone;
  /** Decide si un plazo pendiente cae en este bucket según días restantes. */
  match: (diasRestantes: number) => boolean;
};

/**
 * Buckets de urgencia para plazos PENDIENTES, en orden de prioridad.
 * Mantiene la semántica de URGENCIA / plazoTono (destructive vencido,
 * warning próximo, success a tiempo).
 */
const BUCKETS: Bucket[] = [
  {
    id: "vencidos",
    titulo: "Vencidos",
    tono: "destructive",
    match: (d) => d < 0,
  },
  {
    id: "hoy",
    titulo: "Vence hoy",
    tono: "destructive",
    match: (d) => d === 0,
  },
  {
    id: "critico",
    titulo: "Crítico · 1-2 días",
    tono: "destructive",
    match: (d) => d >= 1 && d <= 2,
  },
  {
    id: "proximo",
    titulo: "Próximos · 3-7 días",
    tono: "warning",
    match: (d) => d >= 3 && d <= 7,
  },
  {
    id: "adelante",
    titulo: "Más adelante",
    // Tinta neutra: el verde se reserva para nada decorativo (principio 4).
    tono: "muted",
    match: (d) => d > 7,
  },
];

/** Acento (barra vertical) por tono del bucket. El color saturado solo marca urgencia. */
const TONE_ACCENT: Record<Tone, string> = {
  default: "bg-border",
  primary: "bg-primary",
  muted: "bg-muted-foreground/35",
  info: "bg-info",
  success: "bg-foreground/30",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

/** Tono del badge contador por tono del bucket. */
const TONE_BADGE: Record<Tone, Tone> = {
  default: "default",
  primary: "primary",
  muted: "muted",
  info: "info",
  success: "muted",
  warning: "warning",
  destructive: "destructive",
};

function diasDe(p: PlazoDetalle): number {
  // Sin fecha → lo tratamos como "más adelante" (a tiempo), igual que urgenciaDesdeDias(null).
  return p.dias_restantes ?? Number.POSITIVE_INFINITY;
}

type SeccionRender = {
  id: string;
  titulo: string;
  tono: Tone;
  plazos: PlazoDetalle[];
};

/**
 * Tablero de triaje por urgencia. Agrupa los pendientes en buckets y junta
 * todo lo no-pendiente en "Otros / Cumplidos". Oculta buckets vacíos y ordena
 * dentro de cada uno por fecha de vencimiento.
 */
export function PlazosTablero({ plazos }: { plazos: PlazoDetalle[] }) {
  const pendientes = plazos.filter((p) => (p.estado ?? "pendiente") === "pendiente");
  const otros = plazos.filter((p) => (p.estado ?? "pendiente") !== "pendiente");

  const ordenarPorVencimiento = (a: PlazoDetalle, b: PlazoDetalle) => {
    const fa = a.fecha_vencimiento ?? "";
    const fb = b.fecha_vencimiento ?? "";
    if (!fa) return 1;
    if (!fb) return -1;
    return fa.localeCompare(fb);
  };

  const secciones: SeccionRender[] = BUCKETS.map((b) => ({
    id: b.id,
    titulo: b.titulo,
    tono: b.tono,
    plazos: pendientes.filter((p) => b.match(diasDe(p))).sort(ordenarPorVencimiento),
  })).filter((s) => s.plazos.length > 0);

  if (otros.length > 0) {
    secciones.push({
      id: "otros",
      titulo: "Otros / Cumplidos",
      tono: "muted",
      plazos: [...otros].sort(ordenarPorVencimiento),
    });
  }

  return (
    <div className="space-y-10">
      {secciones.map((seccion) => (
        <section key={seccion.id} aria-label={seccion.titulo} className="space-y-3.5">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className={`h-4 w-1 shrink-0 rounded-full ${TONE_ACCENT[seccion.tono]}`}
            />
            <h2 className="font-display text-base font-semibold">{seccion.titulo}</h2>
            <Badge tone={TONE_BADGE[seccion.tono]} className="text-data">
              {seccion.plazos.length}
            </Badge>
          </div>

          <Stagger className="space-y-2.5">
            {seccion.plazos.map((p) => (
              <StaggerItem key={p.id}>
                <PlazoCard plazo={p} quickAction />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ))}
    </div>
  );
}

import type { Tone } from "@/lib/constants";
import { plazoTono } from "@/components/shared/plazo-badge";

export type AgendaTipo = "audiencia" | "plazo" | "evento";

/** Ítem unificado de agenda (audiencia, plazo o evento) con detalle para el popover. */
export type AgendaItem = {
  id: string;
  fecha: string; // ISO (fecha o fecha-hora). Para plazos: fecha de vencimiento.
  hora?: string | null; // ISO con hora → se muestra HH:mm (audiencia/evento con horario)
  tipo: AgendaTipo;
  titulo: string;
  expedienteId?: string | null;
  expediente?: string | null;
  // Audiencia
  modalidadAud?: string | null;
  audienciaTipo?: string | null;
  lugar?: string | null;
  juzgado?: string | null;
  enlace?: string | null;
  duracionMin?: number | null;
  // Evento
  descripcion?: string | null;
  fin?: string | null;
  todoElDia?: boolean | null;
  // Plazo
  diasRestantes?: number | null;
  prioridad?: string | null;
  modalidadPlazo?: string | null;
  fuero?: string | null;
  dias?: number | null;
  fechaInicioComputo?: string | null;
  jurisdiccion?: string | null;
};

export const TIPO_LABEL: Record<AgendaTipo, string> = {
  audiencia: "Audiencia",
  plazo: "Plazo",
  evento: "Evento",
};

/** Tono base por tipo (para la leyenda y el badge del popover). */
export const TIPO_TONE: Record<AgendaTipo, Tone> = {
  audiencia: "info",
  plazo: "destructive",
  evento: "primary",
};

/**
 * Tono de color del ítem en el calendario. Los plazos reflejan su URGENCIA
 * (rojo vencido · ámbar próximo · gris a tiempo) — el corazón del producto;
 * audiencias y eventos usan su tono de tipo.
 */
export function itemTone(item: AgendaItem): Tone {
  if (item.tipo === "plazo") return plazoTono(item.diasRestantes ?? null, "pendiente");
  return TIPO_TONE[item.tipo];
}

export const TONE_DOT: Record<Tone, string> = {
  default: "bg-foreground/55",
  primary: "bg-primary",
  muted: "bg-foreground/40",
  info: "bg-info",
  // Plazos "a tiempo": tinta sobria, el color saturado se reserva a la urgencia.
  success: "bg-foreground/55",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

/** Clases de chip (borde + fondo suave + texto) por tono, para celdas del calendario. */
export const TONE_CHIP: Record<Tone, string> = {
  default: "border-border bg-secondary text-secondary-foreground",
  primary: "border-primary/25 bg-primary-soft text-primary",
  muted: "border-border bg-muted text-muted-foreground",
  info: "border-info/25 bg-info-soft text-info",
  // Plazos "a tiempo": superficie neutra de tinta; el ámbar/rojo marca urgencia.
  success: "border-border bg-secondary text-secondary-foreground",
  warning: "border-warning/40 bg-warning-soft text-warning-foreground",
  destructive: "border-destructive/25 bg-destructive-soft text-destructive",
};

/**
 * Mapea la agenda unificada que devuelve el RPC `obtener_agenda_ics` a
 * objetos `VEvent` del generador iCal. Texto en es-AR.
 *
 * UID estable `${tipo}-${id}@juridicos.app` → en cada refresco el calendario
 * del usuario ACTUALIZA el mismo evento (nunca duplica).
 */
import { capitalizar } from "@/lib/format";
import { formatDateTimeUTC, type VEvent } from "./ics";

const DOMINIO = "juridicos.app";

export type AgendaFeedEvento = {
  tipo: "plazo" | "audiencia" | "evento";
  id: string;
  titulo: string;
  descripcion: string | null;
  all_day: boolean;
  fecha: string | null;
  inicio: string | null;
  fin: string | null;
  prioridad?: string | null;
  modalidad?: string | null;
  jurisdiccion?: string | null;
  lugar?: string | null;
  juzgado?: string | null;
  enlace?: string | null;
  ubicacion: string | null;
  url: string | null;
  estado: string | null;
  updated_at: string | null;
  expediente_id: string | null;
  caratula: string | null;
  nro_sac: string | null;
};

/** Concatena líneas no vacías para el cuerpo de DESCRIPTION. */
function bloque(...partes: (string | null | undefined)[]): string | undefined {
  const txt = partes.filter((p) => p && p.trim()).join("\n");
  return txt || undefined;
}

/** Epoch en segundos del `updated_at` → SEQUENCE. */
function secuencia(updatedAt: string | null): number | undefined {
  if (!updatedAt) return undefined;
  const t = Date.parse(updatedAt);
  return Number.isNaN(t) ? undefined : Math.floor(t / 1000);
}

function dtstamp(updatedAt: string | null): string {
  return formatDateTimeUTC(updatedAt ?? new Date().toISOString());
}

function expedienteLinea(e: AgendaFeedEvento): string | null {
  if (!e.caratula) return null;
  return `Expediente: ${e.caratula}${e.nro_sac ? ` · SAC ${e.nro_sac}` : ""}`;
}

export function eventoAVEvent(e: AgendaFeedEvento): VEvent | null {
  const base = { dtstamp: dtstamp(e.updated_at), sequence: secuencia(e.updated_at) };

  if (e.tipo === "plazo") {
    if (!e.fecha) return null;
    return {
      ...base,
      uid: `plazo-${e.id}@${DOMINIO}`,
      allDay: true,
      start: e.fecha,
      summary: `⚖️ Vence: ${e.titulo}`,
      description: bloque(
        e.descripcion,
        expedienteLinea(e),
        e.modalidad ? `Cómputo: ${e.modalidad}${e.jurisdiccion ? ` · ${capitalizar(e.jurisdiccion)}` : ""}` : null,
        e.prioridad ? `Prioridad: ${capitalizar(e.prioridad)}` : null,
        "—",
        "Plazo procesal. La fuente de verdad es juridicOS.",
      ),
      categories: "Plazo",
      alarms: [
        { trigger: "-P2D", description: `Vence en 2 días: ${e.titulo}` },
        { trigger: "-P1D", description: `Vence mañana: ${e.titulo}` },
      ],
    };
  }

  if (e.tipo === "audiencia") {
    if (!e.inicio) return null;
    return {
      ...base,
      uid: `audiencia-${e.id}@${DOMINIO}`,
      allDay: false,
      start: e.inicio,
      end: e.fin ?? undefined,
      summary: `📅 Audiencia: ${e.titulo}`,
      description: bloque(
        expedienteLinea(e),
        e.modalidad ? `Modalidad: ${capitalizar(e.modalidad)}` : null,
        e.juzgado ? `Juzgado: ${e.juzgado}` : null,
        e.enlace ? `Enlace: ${e.enlace}` : null,
      ),
      location: e.ubicacion ?? undefined,
      url: e.enlace ?? undefined,
      categories: "Audiencia",
      alarms: [
        { trigger: "-P1D", description: `Audiencia mañana: ${e.titulo}` },
        { trigger: "-PT1H", description: `Audiencia en 1 hora: ${e.titulo}` },
      ],
    };
  }

  // tipo === "evento"
  const start = e.all_day ? e.fecha : e.inicio;
  if (!start) return null;
  return {
    ...base,
    uid: `evento-${e.id}@${DOMINIO}`,
    allDay: e.all_day,
    start,
    end: e.all_day ? undefined : e.fin ?? undefined,
    summary: `🗓️ ${e.titulo}`,
    description: bloque(e.descripcion, expedienteLinea(e)),
    categories: "Evento",
  };
}

export function mapearAgenda(eventos: AgendaFeedEvento[]): VEvent[] {
  return eventos
    .map(eventoAVEvent)
    .filter((v): v is VEvent => v !== null);
}

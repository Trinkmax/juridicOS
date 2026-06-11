/**
 * Generador iCalendar (RFC 5545) puro, sin dependencias.
 *
 * Decisiones clave:
 * - Eventos CON hora (audiencias/eventos): se emiten en UTC (`...Z`). Es el
 *   instante absoluto; cualquier cliente lo muestra en su huso. Evita por
 *   completo los bugs de offset/DST de un VTIMEZONE artesanal.
 * - Eventos TODO EL DÍA (plazos): `DTSTART;VALUE=DATE` y `DTEND` al día
 *   SIGUIENTE (exclusivo, regla iCal) para que ocupen exactamente un día.
 * - UID estable por entidad → en cada refresco el cliente ACTUALIZA el mismo
 *   evento en vez de duplicarlo. SEQUENCE sube con `updated_at`.
 */

const CRLF = "\r\n";
const encoder = new TextEncoder();

/** Escapa texto para campos TEXT de iCal (RFC 5545 §3.3.11). */
export function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Pliega una línea a ≤75 octetos con CRLF + espacio de continuación (§3.1). */
export function foldLine(line: string): string {
  if (encoder.encode(line).length <= 75) return line;
  const out: string[] = [];
  let current = "";
  let currentBytes = 0;
  for (const ch of line) {
    const chBytes = encoder.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // las continuaciones llevan 1 espacio
    if (currentBytes + chBytes > limit) {
      out.push(current);
      current = ch;
      currentBytes = chBytes;
    } else {
      current += ch;
      currentBytes += chBytes;
    }
  }
  if (current) out.push(current);
  return out.join(CRLF + " ");
}

/** Instante ISO (con offset) → básico UTC `YYYYMMDDTHHMMSSZ`. */
export function formatDateTimeUTC(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`
  );
}

/** "2026-06-12" (o ISO) → `YYYYMMDD` para eventos de día completo. */
export function formatDateOnly(dateStr: string): string {
  const [y, m, d] = dateStr.slice(0, 10).split("-");
  return `${y}${m}${d}`;
}

/** Suma `days` a una fecha `YYYY-MM-DD` y devuelve `YYYYMMDD` (DTEND exclusivo). */
export function addDaysDateOnly(dateStr: string, days: number): string {
  const [y, mo, da] = dateStr.slice(0, 10).split("-").map(Number);
  const d = new Date(Date.UTC(y, mo - 1, da));
  d.setUTCDate(d.getUTCDate() + days);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}`;
}

export type VAlarm = { trigger: string; description: string };

export type VEvent = {
  uid: string;
  /** Marca de revisión del objeto (UTC básico). Deriva de `updated_at`. */
  dtstamp: string;
  /** Epoch en segundos → SEQUENCE; permite propagar ediciones. */
  sequence?: number;
  allDay: boolean;
  /** all-day: `YYYY-MM-DD`. con hora: ISO con offset. */
  start: string;
  /** all-day: `YYYY-MM-DD` exclusivo (default start+1). con hora: ISO. */
  end?: string;
  summary: string;
  description?: string;
  location?: string;
  url?: string;
  categories?: string;
  status?: string;
  alarms?: VAlarm[];
};

function buildVEvent(ev: VEvent): string[] {
  const lines: string[] = ["BEGIN:VEVENT", `UID:${ev.uid}`, `DTSTAMP:${ev.dtstamp}`];
  if (ev.sequence != null) lines.push(`SEQUENCE:${ev.sequence}`);

  if (ev.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${formatDateOnly(ev.start)}`);
    const end = ev.end ? formatDateOnly(ev.end) : addDaysDateOnly(ev.start, 1);
    lines.push(`DTEND;VALUE=DATE:${end}`);
  } else {
    lines.push(`DTSTART:${formatDateTimeUTC(ev.start)}`);
    if (ev.end) lines.push(`DTEND:${formatDateTimeUTC(ev.end)}`);
  }

  lines.push(`SUMMARY:${escapeText(ev.summary)}`);
  if (ev.description) lines.push(`DESCRIPTION:${escapeText(ev.description)}`);
  if (ev.location) lines.push(`LOCATION:${escapeText(ev.location)}`);
  if (ev.url) lines.push(`URL:${escapeText(ev.url)}`);
  if (ev.categories) lines.push(`CATEGORIES:${escapeText(ev.categories)}`);
  lines.push(`STATUS:${ev.status ?? "CONFIRMED"}`);

  for (const a of ev.alarms ?? []) {
    lines.push(
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeText(a.description)}`,
      `TRIGGER:${a.trigger}`,
      "END:VALARM",
    );
  }

  lines.push("END:VEVENT");
  return lines;
}

export type CalendarMeta = { calName: string; prodId?: string };

export function buildVCalendar(events: VEvent[], meta: CalendarMeta): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${meta.prodId ?? "-//juridicOS//Agenda//ES"}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(meta.calName)}`,
    "X-WR-TIMEZONE:America/Argentina/Cordoba",
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    "X-PUBLISHED-TTL:PT1H",
  ];
  for (const ev of events) lines.push(...buildVEvent(ev));
  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join(CRLF) + CRLF;
}

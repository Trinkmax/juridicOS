import {
  format,
  differenceInCalendarDays,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";

function toDate(value: string | Date): Date {
  return typeof value === "string" ? parseISO(value) : value;
}

export function formatFecha(value?: string | Date | null, pattern = "d 'de' MMMM, yyyy") {
  if (!value) return "—";
  return format(toDate(value), pattern, { locale: es });
}

export function formatFechaCorta(value?: string | Date | null) {
  if (!value) return "—";
  return format(toDate(value), "d MMM yyyy", { locale: es });
}

export function formatFechaHora(value?: string | Date | null) {
  if (!value) return "—";
  return format(toDate(value), "d MMM yyyy · HH:mm", { locale: es });
}

export function formatHora(value?: string | Date | null) {
  if (!value) return "—";
  return format(toDate(value), "HH:mm", { locale: es });
}

export function formatDiaSemana(value?: string | Date | null) {
  if (!value) return "—";
  return format(toDate(value), "EEEE", { locale: es });
}

/** "hoy", "mañana", "en 3 días", "hace 2 días" — relative to today. */
export function diasRestantes(value?: string | Date | null): number | null {
  if (!value) return null;
  return differenceInCalendarDays(toDate(value), new Date());
}

export function etiquetaVencimiento(value?: string | Date | null): string {
  if (!value) return "Sin fecha";
  const d = toDate(value);
  if (isToday(d)) return "Vence hoy";
  if (isTomorrow(d)) return "Vence mañana";
  if (isYesterday(d)) return "Venció ayer";
  const n = differenceInCalendarDays(d, new Date());
  if (n < 0) return `Venció hace ${Math.abs(n)} días`;
  return `En ${n} días`;
}

export function etiquetaRelativa(value?: string | Date | null): string {
  if (!value) return "—";
  const d = toDate(value);
  if (isToday(d)) return "Hoy";
  if (isTomorrow(d)) return "Mañana";
  if (isYesterday(d)) return "Ayer";
  const n = differenceInCalendarDays(d, new Date());
  if (n < 0 && n >= -7) return `Hace ${Math.abs(n)} días`;
  if (n > 0 && n <= 7) return `En ${n} días`;
  return formatFechaCorta(d);
}

export function capitalizar(s?: string | null) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

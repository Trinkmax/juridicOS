import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Initials from a full name, e.g. "María José Pérez" → "MP". */
export function initials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/** Deterministic accent index from a string (for avatars / tags). */
export function hashHue(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

const CURRENCY = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});
export function formatMoney(value?: number | null) {
  return CURRENCY.format(value ?? 0);
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Tiny non-crypto id for optimistic UI keys. */
export function tempId(prefix = "tmp") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

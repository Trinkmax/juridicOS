import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";

export const IA_MODEL_DEFAULT = "claude-opus-4-8";
/** Modelo global (fallback de demo). Cada estudio puede tener el suyo. */
export const IA_MODEL = process.env.ANTHROPIC_MODEL?.trim() || IA_MODEL_DEFAULT;

/** API key global de entorno — sólo fallback de demo; cada estudio usa la suya. */
export function iaKeyGlobal(): string | null {
  return process.env.ANTHROPIC_API_KEY || null;
}
export function modeloGlobal(): string {
  return IA_MODEL;
}
/** @deprecated refleja sólo la key global de entorno; preferí la config por estudio. */
export function iaDisponible(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

// Precios por 1M de tokens (USD).
const PRECIOS: Record<string, { in: number; out: number }> = {
  "claude-opus-4-8": { in: 5, out: 25 },
  "claude-opus-4-7": { in: 5, out: 25 },
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-haiku-4-5": { in: 1, out: 5 },
};

export type UsoIA = {
  tokens_in: number;
  tokens_out: number;
  cache_read: number;
  costo_usd: number;
};

// Reutilizamos clientes por API key (no reconstruir en cada llamada).
const _clients = new Map<string, Anthropic>();
function client(apiKey: string): Anthropic {
  let c = _clients.get(apiKey);
  if (!c) {
    c = new Anthropic({ apiKey });
    _clients.set(apiKey, c);
  }
  return c;
}

function calcularUso(u: Anthropic.Usage, modelo: string): UsoIA {
  const precio = PRECIOS[modelo] ?? PRECIOS[IA_MODEL_DEFAULT]!;
  const tokensIn =
    (u.input_tokens ?? 0) +
    (u.cache_creation_input_tokens ?? 0) +
    (u.cache_read_input_tokens ?? 0);
  const costo =
    (tokensIn / 1_000_000) * precio.in +
    ((u.output_tokens ?? 0) / 1_000_000) * precio.out;
  return {
    tokens_in: tokensIn,
    tokens_out: u.output_tokens ?? 0,
    cache_read: u.cache_read_input_tokens ?? 0,
    costo_usd: Number(costo.toFixed(5)),
  };
}

/** Redacción/resumen con la API key del estudio. Streamea + cachea el system. */
export async function redactar(opts: {
  apiKey: string;
  modelo?: string;
  system: string;
  contexto?: string;
  instruccion: string;
  maxTokens?: number;
}): Promise<{ texto: string; uso: UsoIA }> {
  const modelo = opts.modelo || IA_MODEL_DEFAULT;
  const userContent =
    (opts.contexto ? `CONTEXTO DEL EXPEDIENTE:\n${opts.contexto}\n\n` : "") +
    `TAREA:\n${opts.instruccion}`;

  const stream = client(opts.apiKey).messages.stream({
    model: modelo,
    max_tokens: opts.maxTokens ?? 6000,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    system: [
      { type: "text", text: opts.system, cache_control: { type: "ephemeral" } },
    ],
    messages: [{ role: "user", content: userContent }],
  });

  const msg = await stream.finalMessage();
  const texto = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  return { texto, uso: calcularUso(msg.usage, modelo) };
}

/** Extracción estructurada (structured outputs) con la API key del estudio. */
export async function extraer<S extends z.ZodTypeAny>(opts: {
  apiKey: string;
  modelo?: string;
  system: string;
  contenido: string;
  schema: S;
  maxTokens?: number;
}): Promise<{ data: z.infer<S>; uso: UsoIA }> {
  const modelo = opts.modelo || IA_MODEL_DEFAULT;
  const msg = await client(opts.apiKey).messages.parse({
    model: modelo,
    max_tokens: opts.maxTokens ?? 2000,
    system: [
      { type: "text", text: opts.system, cache_control: { type: "ephemeral" } },
    ],
    messages: [{ role: "user", content: opts.contenido }],
    output_config: { format: zodOutputFormat(opts.schema) },
  });
  const data = msg.parsed_output;
  if (data == null) throw new Error("PARSE_FALLIDO");
  return { data: data as z.infer<S>, uso: calcularUso(msg.usage, modelo) };
}

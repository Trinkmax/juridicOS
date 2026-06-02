import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/** Modelo por defecto (configurable por entorno). */
export const IA_MODEL = process.env.ANTHROPIC_MODEL?.trim() || "claude-opus-4-8";

/** La IA sólo opera si hay API key configurada. */
export function iaDisponible(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

// Precios por 1M de tokens (USD) para estimar costo por interacción.
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

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) _client = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno
  return _client;
}

/**
 * Una llamada a Claude para redactar/resumir. Cachea el system prompt (prefijo
 * estable) y devuelve el texto + el uso de tokens. Streamea la request para no
 * cortar por timeout en salidas largas.
 */
export async function redactar(opts: {
  system: string;
  contexto?: string;
  instruccion: string;
  maxTokens?: number;
}): Promise<{ texto: string; uso: UsoIA }> {
  if (!iaDisponible()) throw new Error("IA_NO_CONFIGURADA");

  const userContent =
    (opts.contexto ? `CONTEXTO DEL EXPEDIENTE:\n${opts.contexto}\n\n` : "") +
    `TAREA:\n${opts.instruccion}`;

  const stream = client().messages.stream({
    model: IA_MODEL,
    max_tokens: opts.maxTokens ?? 6000,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    system: [
      // Prefijo estable → cacheable. El contexto volátil va en el mensaje.
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

  const u = msg.usage;
  const precio = PRECIOS[IA_MODEL] ?? PRECIOS["claude-opus-4-8"]!;
  const tokensIn =
    (u.input_tokens ?? 0) +
    (u.cache_creation_input_tokens ?? 0) +
    (u.cache_read_input_tokens ?? 0);
  const costo =
    (tokensIn / 1_000_000) * precio.in +
    ((u.output_tokens ?? 0) / 1_000_000) * precio.out;

  return {
    texto,
    uso: {
      tokens_in: tokensIn,
      tokens_out: u.output_tokens ?? 0,
      cache_read: u.cache_read_input_tokens ?? 0,
      costo_usd: Number(costo.toFixed(5)),
    },
  };
}

/**
 * Feed ICS público de suscripción (Apple Calendar · Google · Outlook).
 *
 *   GET /api/calendar/{token}
 *
 * El `token` es la credencial (capability URL): el handler NO usa la sesión del
 * navegador (los clientes piden el .ics sin cookies). Toda la seguridad y el
 * filtrado por estudio/alcance viven en el RPC `obtener_agenda_ics`
 * (SECURITY DEFINER): valida el token y devuelve solo lo que corresponde.
 *
 * Esta ruta está en PUBLIC_PREFIXES del middleware para no rebotar a /login.
 */
import { createClient } from "@/lib/supabase/server";
import { buildVCalendar, type VEvent } from "@/lib/ical/ics";
import { mapearAgenda, type AgendaFeedEvento } from "@/lib/ical/mapper";

export const dynamic = "force-dynamic";

type FeedPayload = {
  estudio: string | null;
  alcance: string;
  eventos: AgendaFeedEvento[];
};

/** ETag estable (djb2) → habilita respuestas 304 mientras la agenda no cambie. */
function etag(body: string): string {
  let h = 5381;
  for (let i = 0; i < body.length; i++) h = (h * 33) ^ body.charCodeAt(i);
  return `"${(h >>> 0).toString(36)}"`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("obtener_agenda_ics", { _token: token });

  // Token inválido/inactivo → 404 (no 401, para no revelar existencia).
  if (error || !data) {
    return new Response("Feed no encontrado.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const payload = data as unknown as FeedPayload;
  const events: VEvent[] = mapearAgenda(payload.eventos ?? []);
  const calName =
    `juridicOS — ${payload.estudio ?? "Agenda"}` +
    (payload.alcance === "personal" ? " (mi agenda)" : "");

  const ics = buildVCalendar(events, { calName });
  const tag = etag(ics);

  if (request.headers.get("if-none-match") === tag) {
    return new Response(null, {
      status: 304,
      headers: { ETag: tag, "Cache-Control": "private, max-age=900" },
    });
  }

  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="juridicos.ics"',
      "Cache-Control": "private, max-age=900",
      ETag: tag,
    },
  });
}

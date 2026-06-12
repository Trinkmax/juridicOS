import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Video,
  ExternalLink,
  History,
  FileText,
  Scale,
  Gavel,
} from "lucide-react";
import { requireSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptionBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn } from "@/components/motion/fade-in";
import { DocumentoDescarga } from "@/components/portal/documento-descarga";
import { FUERO, ESTADO_EXPEDIENTE } from "@/lib/constants";
import { formatFecha, formatHora, capitalizar } from "@/lib/format";
import type { Expediente, Audiencia, Movimiento, Documento } from "@/lib/types/domain";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("expedientes")
    .select("caratula")
    .eq("id", id)
    .maybeSingle();
  return { title: data?.caratula ?? "Mi causa" };
}

const ES_VIRTUAL = new Set(["virtual", "remota", "videollamada", "online"]);

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof CalendarDays;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2 font-display text-base font-semibold">
      <Icon className="size-4 text-primary" />
      {children}
    </h2>
  );
}

export default async function PortalCausaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireSession();
  const supabase = await createClient();

  // RLS permite leer esta causa sólo si es del cliente.
  const { data: expediente } = await supabase
    .from("expedientes")
    .select("*")
    .eq("id", id)
    .maybeSingle<Expediente>();

  if (!expediente) notFound();

  const ahora = new Date().toISOString();

  const [
    { data: audienciasData },
    { data: movimientosData },
    { data: documentosData },
  ] = await Promise.all([
    supabase
      .from("audiencias")
      .select("*")
      .eq("expediente_id", id)
      .gte("fecha_hora", ahora)
      .order("fecha_hora", { ascending: true }),
    supabase
      .from("movimientos")
      .select("*")
      .eq("expediente_id", id)
      .order("fecha", { ascending: false }),
    supabase
      .from("documentos")
      .select("*")
      .eq("expediente_id", id)
      .eq("compartido_cliente", true)
      .order("created_at", { ascending: false }),
  ]);

  const audiencias = (audienciasData ?? []) as Audiencia[];
  const movimientos = (movimientosData ?? []) as Movimiento[];
  const documentos = (documentosData ?? []) as Documento[];

  return (
    <div className="space-y-10">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="-ml-2 text-muted-foreground"
      >
        <Link href="/portal">
          <ArrowLeft />
          Volver a mis causas
        </Link>
      </Button>

      {/* Encabezado */}
      <FadeIn>
        <Card className="p-6 shadow-xs sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <OptionBadge option={FUERO[expediente.fuero]} />
            <OptionBadge option={ESTADO_EXPEDIENTE[expediente.estado]} dot />
          </div>
          <h1 className="mt-4 font-display text-xl font-semibold tracking-tight text-balance sm:text-2xl">
            {expediente.caratula}
          </h1>
          <dl className="mt-6 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
            {expediente.nro_sac && (
              <div className="space-y-0.5">
                <dt className="text-xs text-muted-foreground">Nº de expediente (SAC)</dt>
                <dd className="font-mono text-data font-medium">{expediente.nro_sac}</dd>
              </div>
            )}
            {expediente.juzgado && (
              <div className="space-y-0.5">
                <dt className="text-xs text-muted-foreground">Juzgado</dt>
                <dd className="font-medium">{expediente.juzgado}</dd>
              </div>
            )}
            {expediente.secretaria && (
              <div className="space-y-0.5">
                <dt className="text-xs text-muted-foreground">Secretaría</dt>
                <dd className="font-medium">{expediente.secretaria}</dd>
              </div>
            )}
            {expediente.etapa && (
              <div className="space-y-0.5">
                <dt className="text-xs text-muted-foreground">Etapa</dt>
                <dd className="font-medium">{capitalizar(expediente.etapa)}</dd>
              </div>
            )}
          </dl>
          <p className="mt-6 flex items-start gap-2.5 rounded-md border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground">
            <Scale className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span>
              Tu estudio mantiene esta causa al día. Si tenés dudas sobre algún paso,
              escribiles con confianza.
            </span>
          </p>
        </Card>
      </FadeIn>

      {/* Próximas audiencias */}
      <FadeIn delay={0.05}>
        <section className="space-y-4">
          <SectionTitle icon={CalendarDays}>Próximas audiencias</SectionTitle>
          {audiencias.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No hay audiencias programadas"
              description="Cuando se fije una nueva audiencia, vas a verla acá con fecha y hora."
              className="py-10"
            />
          ) : (
            <div className="space-y-3">
              {audiencias.map((a) => {
                const virtual = ES_VIRTUAL.has(a.modalidad?.toLowerCase() ?? "");
                return (
                  <Card key={a.id} className="flex items-start gap-4 p-4 shadow-xs sm:p-5">
                    <div className="flex w-14 shrink-0 flex-col items-center rounded-md border border-border bg-muted py-2 text-center">
                      <span className="text-[0.7rem] font-medium capitalize text-muted-foreground">
                        {formatFecha(a.fecha_hora, "MMM")}
                      </span>
                      <span className="font-display text-data text-xl font-semibold leading-none">
                        {formatFecha(a.fecha_hora, "d")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <p className="font-medium leading-snug">{a.titulo}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="text-data">
                          {capitalizar(formatFecha(a.fecha_hora))} ·{" "}
                          {formatHora(a.fecha_hora)} hs
                        </span>
                        {a.tipo && <span>{capitalizar(a.tipo)}</span>}
                        <span className="inline-flex items-center gap-1">
                          {virtual ? (
                            <Video className="size-3" />
                          ) : (
                            <MapPin className="size-3" />
                          )}
                          {capitalizar(a.modalidad)}
                        </span>
                      </div>
                      {a.lugar && (
                        <p className="text-xs text-muted-foreground">{a.lugar}</p>
                      )}
                      {virtual && a.enlace && (
                        <a
                          href={a.enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 pt-0.5 text-xs font-medium text-primary hover:underline"
                        >
                          <ExternalLink className="size-3" />
                          Enlace para conectarse
                        </a>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </FadeIn>

      {/* Novedades / movimientos */}
      <FadeIn delay={0.1}>
        <section className="space-y-4">
          <SectionTitle icon={History}>Novedades</SectionTitle>
          {movimientos.length === 0 ? (
            <EmptyState
              icon={Gavel}
              title="Sin novedades por ahora"
              description="Acá vas a ver los avances de tu causa a medida que ocurran."
              className="py-10"
            />
          ) : (
            <Card className="p-6 shadow-xs">
              <ol className="relative space-y-7 pl-6">
                <span
                  aria-hidden
                  className="absolute left-[5px] top-2 bottom-2 w-px bg-border"
                />
                {movimientos.map((m) => (
                  <li key={m.id} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[1.4rem] top-1 size-2.5 rounded-full border-2 border-card bg-primary ring-2 ring-primary/20"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <time className="text-data text-xs font-medium text-muted-foreground">
                        {capitalizar(formatFecha(m.fecha))}
                      </time>
                      {m.tipo && (
                        <Badge tone="muted" className="text-[0.7rem]">
                          {m.tipo}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 font-medium leading-snug">{m.titulo}</p>
                    {m.descripcion && (
                      <p className="mt-1.5 text-sm whitespace-pre-line text-muted-foreground">
                        {m.descripcion}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </section>
      </FadeIn>

      {/* Documentos compartidos */}
      <FadeIn delay={0.15}>
        <section className="space-y-4">
          <SectionTitle icon={FileText}>Documentos compartidos</SectionTitle>
          {documentos.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Todavía no hay documentos"
              description="Cuando tu estudio comparta documentos de esta causa, vas a poder descargarlos desde acá."
              className="py-10"
            />
          ) : (
            <div className="space-y-3">
              {documentos.map((d) => (
                <DocumentoDescarga
                  key={d.id}
                  id={d.id}
                  nombre={d.nombre}
                  tipo={d.tipo}
                  tamanoBytes={d.tamano_bytes}
                />
              ))}
            </div>
          )}
        </section>
      </FadeIn>
    </div>
  );
}

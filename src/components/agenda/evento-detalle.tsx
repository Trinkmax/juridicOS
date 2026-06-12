"use client";

import Link from "next/link";
import {
  Gavel,
  CalendarClock,
  CalendarDays,
  MapPin,
  Video,
  Users,
  Clock,
  FileText,
  ArrowRight,
  Scale,
  AlignLeft,
  Pencil,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OptionBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { PlazoUrgenciaBadge } from "@/components/shared/plazo-badge";
import { PRIORIDAD, MODALIDAD_PLAZO, FUERO, type Option } from "@/lib/constants";
import { formatFecha, formatHora, capitalizar } from "@/lib/format";
import { TIPO_LABEL, TIPO_TONE, type AgendaItem } from "./tipos";

const TIPO_ICON: Record<AgendaItem["tipo"], LucideIcon> = {
  audiencia: Gavel,
  plazo: CalendarClock,
  evento: CalendarDays,
};

const MODALIDAD_AUD_ICON: Record<string, LucideIcon> = {
  virtual: Video,
  presencial: MapPin,
  hibrida: Users,
};

const MODALIDAD_AUD_LABEL: Record<string, string> = {
  virtual: "Virtual",
  presencial: "Presencial",
  hibrida: "Híbrida",
};

function opt<T extends Record<string, Option>>(map: T, key?: string | null): Option | null {
  if (!key) return null;
  return (map as Record<string, Option>)[key] ?? null;
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-sm text-foreground">{children}</dd>
      </div>
    </div>
  );
}

export function EventoDetalle({
  item,
  onEditar,
  onEliminar,
}: {
  item: AgendaItem;
  /** Si se pasan, muestran acciones de editar/eliminar (audiencias y plazos). */
  onEditar?: () => void;
  onEliminar?: () => void;
}) {
  const TipoIcon = TIPO_ICON[item.tipo];
  const esPlazo = item.tipo === "plazo";
  const esAudiencia = item.tipo === "audiencia";
  const puedeAccion = esAudiencia || esPlazo;
  const prioridad = opt(PRIORIDAD, item.prioridad);
  const fuero = opt(FUERO, item.fuero);
  const modalidadPlazo = opt(MODALIDAD_PLAZO, item.modalidadPlazo);
  const ModAudIcon = item.modalidadAud
    ? (MODALIDAD_AUD_ICON[item.modalidadAud] ?? MapPin)
    : MapPin;

  return (
    <>
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={TIPO_TONE[item.tipo]} dot>
            <TipoIcon className="size-3" />
            {TIPO_LABEL[item.tipo]}
          </Badge>
          {esPlazo && (
            <PlazoUrgenciaBadge
              diasRestantes={item.diasRestantes ?? null}
              estado="pendiente"
              fechaVencimiento={item.fecha}
            />
          )}
          {esPlazo && prioridad && <OptionBadge option={prioridad} />}
        </div>
        <DialogTitle className="text-xl">{item.titulo}</DialogTitle>
      </DialogHeader>

      <dl className="space-y-4 py-2">
        <Row icon={esPlazo ? CalendarClock : CalendarDays} label={esPlazo ? "Vencimiento" : "Fecha"}>
          {capitalizar(formatFecha(item.fecha, "EEEE d 'de' MMMM, yyyy"))}
        </Row>

        {item.hora && !item.todoElDia && (
          <Row icon={Clock} label="Hora">
            <span className="font-mono text-data">{formatHora(item.hora)}</span>
            {item.fin && (
              <span className="text-muted-foreground"> – {formatHora(item.fin)}</span>
            )}
            {item.duracionMin ? (
              <span className="text-muted-foreground"> · {item.duracionMin} min</span>
            ) : null}
          </Row>
        )}
        {item.tipo === "evento" && item.todoElDia && (
          <Row icon={Clock} label="Horario">Todo el día</Row>
        )}

        {esAudiencia && item.modalidadAud && (
          <Row icon={ModAudIcon} label="Modalidad">
            {MODALIDAD_AUD_LABEL[item.modalidadAud] ?? item.modalidadAud}
          </Row>
        )}
        {item.lugar && (
          <Row icon={MapPin} label="Lugar">{item.lugar}</Row>
        )}
        {item.juzgado && (
          <Row icon={Scale} label="Juzgado">{item.juzgado}</Row>
        )}

        {esPlazo && modalidadPlazo && (
          <Row icon={CalendarClock} label="Cómputo">{modalidadPlazo.label}</Row>
        )}
        {esPlazo && fuero && (
          <Row icon={Scale} label="Fuero">{fuero.label}</Row>
        )}

        {item.descripcion && (
          <Row icon={AlignLeft} label="Descripción">
            <span className="whitespace-pre-wrap">{item.descripcion}</span>
          </Row>
        )}

        {item.expedienteId && item.expediente && (
          <Row icon={FileText} label="Expediente">{item.expediente}</Row>
        )}
      </dl>

      <DialogFooter className="gap-2 sm:justify-between">
        <DialogClose asChild>
          <Button variant="ghost" type="button">Cerrar</Button>
        </DialogClose>
        <div className="flex flex-wrap gap-2">
          {onEliminar && puedeAccion && (
            <Button
              variant="ghost"
              type="button"
              onClick={onEliminar}
              className="text-destructive hover:bg-destructive-soft hover:text-destructive"
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          )}
          {onEditar && puedeAccion && (
            <Button variant="outline" type="button" onClick={onEditar}>
              <Pencil className="size-4" />
              Editar
            </Button>
          )}
          {esAudiencia && item.enlace && (
            <Button asChild variant="outline">
              <a href={item.enlace} target="_blank" rel="noreferrer">
                <Video className="size-4" />
                Unirse
              </a>
            </Button>
          )}
          {item.expedienteId && (
            <Button asChild>
              <Link href={`/expedientes/${item.expedienteId}`}>
                Ir al expediente
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      </DialogFooter>
    </>
  );
}

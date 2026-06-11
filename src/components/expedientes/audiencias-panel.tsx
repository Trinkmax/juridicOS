"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarDays,
  Plus,
  MapPin,
  Video,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AudienciaForm } from "@/components/agenda/audiencia-form";
import { eliminarAudiencia } from "@/lib/actions/audiencias";
import { formatFecha, formatHora, capitalizar } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Audiencia } from "@/lib/types/domain";
import type { Tone } from "@/lib/constants";

const ESTADO_AUDIENCIA: Record<string, { label: string; tone: Tone }> = {
  programada: { label: "Programada", tone: "info" },
  confirmada: { label: "Confirmada", tone: "primary" },
  realizada: { label: "Realizada", tone: "success" },
  suspendida: { label: "Suspendida", tone: "warning" },
  cancelada: { label: "Cancelada", tone: "muted" },
};

function estadoBadge(estado: string) {
  return (
    ESTADO_AUDIENCIA[estado] ?? { label: capitalizar(estado), tone: "default" as Tone }
  );
}

const ES_VIRTUAL = new Set(["virtual", "remota", "videollamada", "online"]);

function AudienciaItem({
  audiencia: a,
  expedienteId,
  caratula,
}: {
  audiencia: Audiencia;
  expedienteId: string;
  caratula: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [editOpen, setEditOpen] = React.useState(false);
  const [borrarOpen, setBorrarOpen] = React.useState(false);

  const est = estadoBadge(a.estado);
  const virtual = ES_VIRTUAL.has(a.modalidad?.toLowerCase());

  function onEliminar() {
    startTransition(async () => {
      const res = await eliminarAudiencia(a.id);
      if (res.ok) {
        toast.success(res.message ?? "Audiencia eliminada.");
        setBorrarOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-card p-4 transition-colors hover:border-foreground/20">
      <div className="flex w-14 shrink-0 flex-col items-center rounded-md bg-muted/60 py-1.5 text-center">
        <span className="text-[0.7rem] font-medium uppercase text-muted-foreground">
          {formatFecha(a.fecha_hora, "MMM")}
        </span>
        <span className="text-data text-lg font-semibold leading-none">
          {formatFecha(a.fecha_hora, "d")}
        </span>
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{a.titulo}</span>
          <Badge tone={est.tone}>{est.label}</Badge>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <span>
            {capitalizar(formatFecha(a.fecha_hora))} · {formatHora(a.fecha_hora)}
          </span>
          {a.tipo && <span>{capitalizar(a.tipo)}</span>}
          <span className="inline-flex items-center gap-1">
            {virtual ? <Video className="size-3" /> : <MapPin className="size-3" />}
            {capitalizar(a.modalidad)}
          </span>
        </div>
        {a.lugar && <p className="text-xs text-muted-foreground">{a.lugar}</p>}
        {a.enlace && (
          <a
            href={a.enlace}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline",
            )}
          >
            <ExternalLink className="size-3" />
            Enlace de la audiencia
          </a>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground"
            aria-label="Acciones de la audiencia"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setBorrarOpen(true)}
            className="text-destructive focus:bg-destructive-soft focus:text-destructive [&_svg]:text-destructive"
          >
            <Trash2 className="size-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Editar */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar audiencia</DialogTitle>
            <DialogDescription>Actualizá los datos de la audiencia.</DialogDescription>
          </DialogHeader>
          <AudienciaForm
            audiencia={a}
            expedientes={[{ id: expedienteId, caratula }]}
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Eliminar */}
      <Dialog open={borrarOpen} onOpenChange={setBorrarOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar audiencia</DialogTitle>
            <DialogDescription>
              ¿Eliminar <span className="font-medium text-foreground">{a.titulo}</span>? Esta
              acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={pending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={onEliminar} disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Lista de audiencias del expediente, con editar/eliminar. Agendar va a /agenda. */
export function AudienciasPanel({
  expedienteId,
  caratula,
  audiencias,
}: {
  expedienteId: string;
  caratula: string;
  audiencias: Audiencia[];
}) {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-semibold">Audiencias</h3>
          <p className="text-sm text-muted-foreground">
            {audiencias.length}{" "}
            {audiencias.length === 1 ? "audiencia agendada" : "audiencias agendadas"}
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href={`/agenda?expediente=${expedienteId}&nueva=1`}>
            <Plus />
            Agendar
          </Link>
        </Button>
      </div>

      {audiencias.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Sin audiencias"
          description="Agendá audiencias, comparendos y mediaciones de esta causa."
          action={
            <Button asChild>
              <Link href={`/agenda?expediente=${expedienteId}&nueva=1`}>
                <Plus />
                Agendar audiencia
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {audiencias.map((a) => (
            <AudienciaItem
              key={a.id}
              audiencia={a}
              expedienteId={expedienteId}
              caratula={caratula}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

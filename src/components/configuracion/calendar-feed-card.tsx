"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarPlus,
  Copy,
  Check,
  Building2,
  UserRound,
  RefreshCw,
  Trash2,
  ChevronRight,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { tiempoRelativo } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  generarFeed,
  cambiarAlcanceFeed,
  regenerarFeed,
  desactivarFeed,
} from "@/lib/actions/calendar-feed";

type FeedActionResult = { ok: true; message?: string } | { ok: false; error: string };

export type FeedData = {
  token: string;
  alcance: "estudio" | "personal";
  lastAccessedAt: string | null;
};

export function CalendarFeedCard({
  feed,
  baseUrl,
}: {
  feed: FeedData | null;
  baseUrl: string;
}) {
  const router = useRouter();
  const [pending, startAction] = useTransition();

  function run(fn: () => Promise<FeedActionResult>) {
    startAction(async () => {
      const r = await fn();
      if (r.ok) {
        toast.success(r.message ?? "Listo");
        router.refresh();
      } else {
        toast.error(r.error);
      }
    });
  }

  /* ─────────────────────────── Sin feed: CTA ─────────────────────────── */
  if (!feed) {
    return (
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Generá un enlace personal y suscribí tu agenda —{" "}
          <span className="text-foreground">plazos, audiencias y eventos</span> — en
          Apple Calendar, Google Calendar u Outlook. Es de solo lectura y se
          actualiza sola.
        </p>
        <Button onClick={() => run(generarFeed)} disabled={pending}>
          {pending ? <Spinner /> : <CalendarPlus className="size-4" />}
          Generar enlace de suscripción
        </Button>
      </div>
    );
  }

  /* ─────────────────────────── Con feed ─────────────────────────── */
  const httpsUrl = `${baseUrl}/api/calendar/${feed.token}`;
  const webcalUrl = httpsUrl.replace(/^https?:\/\//, "webcal://");
  const googleUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(httpsUrl)}`;
  const host = baseUrl.replace(/^https?:\/\//, "");
  const masked = `${baseUrl}/api/calendar/${"•".repeat(14)}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="muted">Solo lectura</Badge>
        <span className="text-xs text-muted-foreground">
          Tu agenda viaja a tus dispositivos; los cambios se gestionan acá.
        </span>
      </div>

      {/* Alcance del enlace */}
      <div className="space-y-2.5">
        <p className="text-sm font-medium text-muted-foreground">
          Qué incluye tu enlace
        </p>
        <div className="flex gap-2">
          <AlcanceBtn
            active={feed.alcance === "estudio"}
            disabled={pending}
            onClick={() => feed.alcance !== "estudio" && run(() => cambiarAlcanceFeed("estudio"))}
            icon={<Building2 className="size-4" />}
            label="Toda la agenda del estudio"
          />
          <AlcanceBtn
            active={feed.alcance === "personal"}
            disabled={pending}
            onClick={() => feed.alcance !== "personal" && run(() => cambiarAlcanceFeed("personal"))}
            icon={<UserRound className="size-4" />}
            label="Solo lo asignado a mí"
          />
        </div>
      </div>

      {/* URL enmascarada + copiar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={masked}
            aria-label="Enlace de suscripción al calendario"
            className="text-data font-mono text-xs text-muted-foreground"
            onFocusCapture={(e) => e.currentTarget.blur()}
          />
          <CopyButton value={httpsUrl} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <a href={webcalUrl}>
              <CalendarPlus className="size-4" /> Añadir a Apple Calendar
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" /> Añadir a Google
            </a>
          </Button>
        </div>
      </div>

      {/* Instrucciones colapsables */}
      <details className="group rounded-md border border-border bg-muted/40 [&_summary]:list-none">
        <summary className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm font-medium select-none">
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" />
          Cómo suscribirte (1 · 2 · 3)
        </summary>
        <ol className="space-y-2 px-3 pb-3 pl-9 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">1.</span> En el iPhone, tocá{" "}
            <span className="text-foreground">Añadir a Apple Calendar</span>; en la compu,
            copiá el enlace.
          </li>
          <li>
            <span className="font-medium text-foreground">2.</span> En Apple Calendar (Mac):
            Archivo → Nueva suscripción a calendario y pegá el enlace. En Outlook: Agregar
            calendario → Suscribirse desde la web. En Google: usá el botón{" "}
            <span className="text-foreground">Añadir a Google</span>.
          </li>
          <li>
            <span className="font-medium text-foreground">3.</span> Elegí cada cuánto refrescar
            y listo. Tus plazos y audiencias aparecen solos (puede tardar unas horas en la
            primera sincronización).
          </li>
        </ol>
      </details>

      {/* Aviso de privacidad */}
      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
        Cualquier persona con este enlace puede ver tu agenda. No lo compartas; si se
        filtra, regeneralo.
      </p>

      {/* Pie: estado + acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <span className="text-xs text-muted-foreground">
          Último acceso de un calendario:{" "}
          <span className="text-foreground">{tiempoRelativo(feed.lastAccessedAt)}</span>
        </span>
        <div className="flex items-center gap-1">
          <RegenerarDialog
            onConfirm={() => run(regenerarFeed)}
            pending={pending}
            host={host}
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            disabled={pending}
            onClick={() => run(desactivarFeed)}
          >
            <Trash2 className="size-4" /> Quitar
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── Subcomponentes ───────────────────────────── */

function AlcanceBtn({
  active,
  onClick,
  icon,
  label,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60",
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Copiar enlace de suscripción"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success("Enlace copiado");
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error("No se pudo copiar. Copialo manualmente.");
        }
      }}
    >
      {copied ? <Check className="size-4 text-foreground" /> : <Copy className="size-4" />}
    </Button>
  );
}

function RegenerarDialog({
  onConfirm,
  pending,
  host,
}: {
  onConfirm: () => void;
  pending: boolean;
  host: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        disabled={pending}
        onClick={() => setOpen(true)}
      >
        <RefreshCw className="size-4" /> Regenerar
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Regenerar enlace de suscripción</DialogTitle>
            <DialogDescription>
              El enlace actual (<span className="font-mono">{host}/api/calendar/…</span>)
              dejará de funcionar de inmediato. Los calendarios que ya lo usan dejarán de
              actualizarse hasta que vuelvas a suscribirte con el nuevo enlace.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              {pending ? <Spinner /> : <RefreshCw className="size-4" />}
              Regenerar enlace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

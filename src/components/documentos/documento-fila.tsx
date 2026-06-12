"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Trash2, MoreVertical, FolderOpen, Eye } from "lucide-react";
import {
  urlDescarga,
  eliminarDocumento,
  toggleCompartido,
} from "@/lib/actions/documentos";
import type { Documento } from "@/lib/types/domain";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatFechaCorta } from "@/lib/format";
import { iconoDocumento, formatTamano } from "./doc-utils";

export type DocumentoFilaItem = Documento & {
  expedientes: { caratula: string } | null;
};

export function DocumentoFila({ doc }: { doc: DocumentoFilaItem }) {
  const router = useRouter();
  const { icon: Icon, className: iconColor } = iconoDocumento(doc.mime, doc.nombre);

  const [descargando, setDescargando] = React.useState(false);
  const [compartido, setCompartido] = React.useState(doc.compartido_cliente);
  const [togglePending, setTogglePending] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [eliminando, setEliminando] = React.useState(false);
  const [vistaOpen, setVistaOpen] = React.useState(false);
  const [vistaUrl, setVistaUrl] = React.useState<string | null>(null);
  const [vistaCargando, setVistaCargando] = React.useState(false);

  const mime = (doc.mime ?? "").toLowerCase();
  const ext = (doc.nombre ?? "").split(".").pop()?.toLowerCase() ?? "";
  const esImagen =
    mime.startsWith("image/") ||
    ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"].includes(ext);
  const esPdf = mime === "application/pdf" || ext === "pdf";
  const previsualizable = esImagen || esPdf;

  async function abrirVistaRapida() {
    if (!doc.storage_path) {
      toast.error("Este documento no tiene archivo asociado.");
      return;
    }
    setVistaOpen(true);
    if (vistaUrl) return;
    setVistaCargando(true);
    const res = await urlDescarga(doc.storage_path);
    setVistaCargando(false);
    if (!res.ok || !res.data) {
      toast.error(res.ok ? "No pudimos generar la vista previa." : res.error);
      return;
    }
    setVistaUrl(res.data.url);
  }

  async function descargar() {
    if (!doc.storage_path) {
      toast.error("Este documento no tiene archivo asociado.");
      return;
    }
    setDescargando(true);
    const res = await urlDescarga(doc.storage_path);
    setDescargando(false);
    if (!res.ok || !res.data) {
      toast.error(res.ok ? "No pudimos generar el enlace." : res.error);
      return;
    }
    const a = document.createElement("a");
    a.href = res.data.url;
    a.download = doc.nombre;
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function onToggle(next: boolean) {
    const prev = compartido;
    setCompartido(next);
    setTogglePending(true);
    const res = await toggleCompartido(doc.id, next);
    setTogglePending(false);
    if (!res.ok) {
      setCompartido(prev);
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Listo");
    router.refresh();
  }

  async function eliminar() {
    setEliminando(true);
    const res = await eliminarDocumento(doc.id);
    setEliminando(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Documento eliminado");
    setConfirmOpen(false);
    router.refresh();
  }

  const etiquetas = doc.etiquetas ?? [];

  return (
    <div className="group flex items-start gap-3.5 rounded-lg border border-border bg-card px-4 py-3.5 shadow-xs transition-colors hover:border-foreground/15 hover:bg-accent/50">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70">
        <Icon className={cn("size-5", iconColor)} />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <button
            type="button"
            onClick={descargar}
            disabled={descargando}
            className="truncate text-left text-sm font-medium text-foreground hover:text-primary hover:underline underline-offset-4 disabled:opacity-60"
            title={doc.nombre}
          >
            {doc.nombre}
          </button>
          {descargando && <Spinner className="size-3.5" />}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="text-data">{formatTamano(doc.tamano_bytes)}</span>
          <span aria-hidden>·</span>
          <span className="text-data">{formatFechaCorta(doc.created_at)}</span>
          {doc.expediente_id && doc.expedientes && (
            <>
              <span aria-hidden>·</span>
              <Link
                href={`/expedientes/${doc.expediente_id}`}
                className="inline-flex max-w-[16rem] items-center gap-1 truncate text-muted-foreground hover:text-primary hover:underline underline-offset-4"
                title={doc.expedientes.caratula}
              >
                <FolderOpen className="size-3.5 shrink-0" />
                <span className="truncate">{doc.expedientes.caratula}</span>
              </Link>
            </>
          )}
        </div>

        {etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {etiquetas.map((t) => (
              <Badge key={t} tone="muted">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <label className="hidden items-center gap-2 sm:flex" title="Compartir con el cliente">
          <span className="text-xs text-muted-foreground">Cliente</span>
          <Switch
            checked={compartido}
            onCheckedChange={onToggle}
            disabled={togglePending}
            aria-label="Compartir con el cliente"
          />
        </label>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={abrirVistaRapida}
          aria-label="Vista rápida"
          title="Vista rápida"
          className="size-9 sm:size-8"
        >
          <Eye className="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={descargar}
          disabled={descargando}
          aria-label="Descargar"
          title="Descargar"
          className="hidden sm:inline-flex"
        >
          {descargando ? <Spinner className="size-4" /> : <Download className="size-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Más acciones"
              className="size-9 sm:size-8"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => void descargar()}>
              <Download className="size-4" />
              Descargar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive-soft focus:text-destructive [&_svg]:text-destructive"
              onSelect={(e) => {
                e.preventDefault();
                setConfirmOpen(true);
              }}
            >
              <Trash2 className="size-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={confirmOpen} onOpenChange={(o) => !eliminando && setConfirmOpen(o)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar documento</DialogTitle>
            <DialogDescription>
              Se eliminará <span className="font-medium text-foreground">{doc.nombre}</span>{" "}
              de forma permanente, incluido el archivo. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={eliminando}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={eliminar}
              disabled={eliminando}
            >
              {eliminando ? <Spinner className="size-4" /> : <Trash2 className="size-4" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={vistaOpen} onOpenChange={setVistaOpen}>
        <DialogContent className="flex max-h-[90dvh] w-full flex-col gap-4 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-8" title={doc.nombre}>
              {doc.nombre}
            </DialogTitle>
            <DialogDescription>
              {formatTamano(doc.tamano_bytes)} · {formatFechaCorta(doc.created_at)}
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-[40vh] flex-1 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
            {vistaCargando ? (
              <Spinner className="size-6 text-muted-foreground" />
            ) : !previsualizable ? (
              <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                <div className="flex size-12 items-center justify-center rounded-md bg-muted">
                  <Icon className={cn("size-6", iconColor)} />
                </div>
                <p className="text-sm text-muted-foreground">
                  No podemos previsualizar este tipo de archivo.
                </p>
                <Button type="button" variant="outline" onClick={descargar} disabled={descargando}>
                  {descargando ? (
                    <Spinner className="size-4" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  Descargar
                </Button>
              </div>
            ) : vistaUrl ? (
              esImagen ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vistaUrl}
                  alt={doc.nombre}
                  className="max-h-[70vh] w-full object-contain"
                />
              ) : (
                <iframe
                  src={vistaUrl}
                  title={doc.nombre}
                  className="h-[70vh] w-full"
                />
              )
            ) : (
              <p className="px-6 py-10 text-sm text-muted-foreground">
                No pudimos cargar la vista previa.
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cerrar
              </Button>
            </DialogClose>
            <Button type="button" variant="outline" onClick={descargar} disabled={descargando}>
              {descargando ? <Spinner className="size-4" /> : <Download className="size-4" />}
              Descargar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { registrarDocumento } from "@/lib/actions/documentos";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { iconoDocumento, formatTamano } from "./doc-utils";

const SIN_EXPEDIENTE = "__sin__";

type ExpedienteOpcion = { id: string; caratula: string };

type Estado = "pendiente" | "subiendo" | "ok" | "error";
type Item = { file: File; estado: Estado; error?: string };

export function DocumentoUploader({
  estudioId,
  expedientes,
  expedienteIdFijo,
  trigger,
}: {
  estudioId: string;
  expedientes: ExpedienteOpcion[];
  /** Si se pasa, el documento queda atado a este expediente (sin selector). */
  expedienteIdFijo?: string;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);

  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<Item[]>([]);
  const [expedienteId, setExpedienteId] = React.useState<string>(
    expedienteIdFijo ?? SIN_EXPEDIENTE,
  );
  const [compartido, setCompartido] = React.useState(false);
  const [etiquetasRaw, setEtiquetasRaw] = React.useState("");
  const [subiendo, setSubiendo] = React.useState(false);
  const [arrastrando, setArrastrando] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const reset = React.useCallback(() => {
    setItems([]);
    setExpedienteId(expedienteIdFijo ?? SIN_EXPEDIENTE);
    setCompartido(false);
    setEtiquetasRaw("");
    setSubiendo(false);
    setArrastrando(false);
  }, [expedienteIdFijo]);

  function agregarArchivos(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const nuevos: Item[] = Array.from(fileList).map((file) => ({
      file,
      estado: "pendiente" as const,
    }));
    setItems((prev) => [...prev, ...nuevos]);
  }

  function quitar(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function subir() {
    if (items.length === 0 || subiendo) return;
    setSubiendo(true);

    const etiquetas = etiquetasRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const expSel =
      expedienteId === SIN_EXPEDIENTE ? null : expedienteId;

    let okCount = 0;
    let errCount = 0;

    const actuales = [...items];
    for (let i = 0; i < actuales.length; i++) {
      const item = actuales[i];
      if (item.estado === "ok") continue;

      setItems((prev) =>
        prev.map((it, idx) =>
          idx === i ? { ...it, estado: "subiendo", error: undefined } : it,
        ),
      );

      const file = item.file;
      const path = `${estudioId}/${expSel ?? "general"}/${crypto.randomUUID()}-${file.name}`;

      const { error: upError } = await supabase.storage
        .from("documentos")
        .upload(path, file, { upsert: false });

      if (upError) {
        errCount++;
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, estado: "error", error: upError.message } : it,
          ),
        );
        continue;
      }

      const res = await registrarDocumento({
        nombre: file.name,
        storage_path: path,
        mime: file.type,
        tamano_bytes: file.size,
        expediente_id: expSel,
        etiquetas,
        compartido_cliente: compartido,
      });

      if (!res.ok) {
        errCount++;
        // El archivo quedó en Storage pero no se registró: lo limpiamos.
        await supabase.storage.from("documentos").remove([path]);
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, estado: "error", error: res.error } : it,
          ),
        );
        continue;
      }

      okCount++;
      setItems((prev) =>
        prev.map((it, idx) =>
          idx === i ? { ...it, estado: "ok", error: undefined } : it,
        ),
      );
    }

    setSubiendo(false);

    if (okCount > 0) {
      toast.success(
        okCount === 1
          ? "Documento subido"
          : `${okCount} documentos subidos`,
      );
      router.refresh();
    }
    if (errCount > 0) {
      toast.error(
        errCount === 1
          ? "Un archivo no se pudo subir"
          : `${errCount} archivos no se pudieron subir`,
      );
    }
    if (errCount === 0 && okCount > 0) {
      setOpen(false);
      reset();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (subiendo) return;
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Upload className="size-4" />
            Subir documento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Subir documentos</DialogTitle>
          <DialogDescription>
            Arrastrá archivos o seleccionálos. Se guardan en el archivo digital del
            estudio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Dropzone */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setArrastrando(true);
            }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={(e) => {
              e.preventDefault();
              setArrastrando(false);
              agregarArchivos(e.dataTransfer.files);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
              arrastrando
                ? "border-primary bg-primary-soft"
                : "border-border bg-muted/40 hover:border-primary/50 hover:bg-accent",
            )}
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Upload className="size-5" />
            </div>
            <p className="text-sm font-medium">
              Hacé clic o arrastrá archivos acá
            </p>
            <p className="text-xs text-muted-foreground">
              Cualquier formato. Podés seleccionar varios a la vez.
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                agregarArchivos(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {/* Lista de archivos elegidos */}
          {items.length > 0 && (
            <ul className="space-y-1.5">
              {items.map((it, i) => {
                const { icon: Icon, className } = iconoDocumento(
                  it.file.type,
                  it.file.name,
                );
                return (
                  <li
                    key={`${it.file.name}-${i}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
                  >
                    <Icon className={cn("size-5 shrink-0", className)} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {it.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTamano(it.file.size)}
                        {it.estado === "error" && it.error && (
                          <span className="text-destructive"> · {it.error}</span>
                        )}
                      </p>
                    </div>
                    {it.estado === "subiendo" && <Spinner className="size-4" />}
                    {it.estado === "ok" && (
                      <CheckCircle2 className="size-4 shrink-0 text-success" />
                    )}
                    {it.estado === "error" && (
                      <AlertCircle className="size-4 shrink-0 text-destructive" />
                    )}
                    {(it.estado === "pendiente" || it.estado === "error") &&
                      !subiendo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => quitar(i)}
                          aria-label="Quitar archivo"
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* Metadatos comunes */}
          <div className="space-y-4">
            {!expedienteIdFijo && (
              <Field label="Expediente" hint="Opcional: vinculá los documentos a una causa.">
                <Select value={expedienteId} onValueChange={setExpedienteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sin expediente (general)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SIN_EXPEDIENTE}>Sin expediente (general)</SelectItem>
                    {expedientes.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.caratula}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}

            <Field
              label="Etiquetas"
              hint="Separadas por coma. Ej: contrato, prueba, escrito."
            >
              <Input
                value={etiquetasRaw}
                onChange={(e) => setEtiquetasRaw(e.target.value)}
                placeholder="contrato, demanda, prueba"
              />
            </Field>

            <label className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
              <span className="min-w-0">
                <span className="block text-sm font-medium">
                  Compartir con el cliente
                </span>
                <span className="block text-xs text-muted-foreground">
                  El cliente podrá ver estos documentos desde su portal.
                </span>
              </span>
              <Switch
                checked={compartido}
                onCheckedChange={setCompartido}
                aria-label="Compartir con el cliente"
              />
            </label>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={subiendo}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={subir} disabled={items.length === 0 || subiendo}>
            {subiendo ? <Spinner className="size-4" /> : <Plus className="size-4" />}
            {subiendo
              ? "Subiendo…"
              : `Subir ${items.length > 0 ? `(${items.length})` : ""}`.trim()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

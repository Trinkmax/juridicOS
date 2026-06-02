"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FilePlus2,
  Save,
  Download,
  Copy,
  Check,
  Wand2,
  Replace,
  Info,
  FileDown,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { guardarDocumentoGenerado } from "@/lib/actions/ia";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { AsistenteIA } from "./asistente-ia";
import { aplicarMailMerge, variablesEnTexto, MARCADOR_PENDIENTE } from "./mail-merge";
import type {
  PlantillaItem,
  ExpedienteContexto,
  DocumentoEdicion,
  Membrete,
} from "./tipos";

const SIN_EXPEDIENTE = "__sin__";

/** API imperativa que el workspace expone a la biblioteca de plantillas. */
export type EditorHandle = {
  cargarPlantilla: (p: PlantillaItem) => void;
};

export const EditorWorkspace = forwardRef<
  EditorHandle,
  {
    plantillas: PlantillaItem[];
    expedientes: ExpedienteContexto[];
    iaActiva: boolean;
    /** Si viene, se abre en modo edición de ese documento. */
    documento?: DocumentoEdicion;
    /** Membrete del estudio para el encabezado del PDF. Opcional. */
    membrete?: Membrete;
  }
>(function EditorWorkspace(
  { plantillas, expedientes, iaActiva, documento, membrete },
  ref,
) {
  const router = useRouter();

  const [docId] = useState<string | null>(documento?.id ?? null);
  const [titulo, setTitulo] = useState(documento?.titulo ?? "");
  const [tipo, setTipo] = useState(documento?.tipo ?? "");
  const [contenido, setContenido] = useState(documento?.contenido ?? "");
  const [plantillaId, setPlantillaId] = useState<string | null>(null);
  const [expedienteId, setExpedienteId] = useState<string | null>(
    documento?.expediente_id ?? null,
  );
  const [generadoPorIa, setGeneradoPorIa] = useState(documento?.generado_por_ia ?? false);

  const [copiado, setCopiado] = useState(false);
  const [tituloDialog, setTituloDialog] = useState(false);
  const [tituloPendiente, setTituloPendiente] = useState("");
  const [guardando, startGuardar] = useTransition();
  const [generandoPdf, setGenerandoPdf] = useState(false);
  const [imprimiendo, setImprimiendo] = useState(false);

  const expedienteSel = useMemo(
    () => expedientes.find((e) => e.id === expedienteId) ?? null,
    [expedientes, expedienteId],
  );

  const variables = useMemo(() => variablesEnTexto(contenido), [contenido]);
  const pendientes = useMemo(
    () => contenido.split(MARCADOR_PENDIENTE).length - 1,
    [contenido],
  );

  function cargarPlantillaObj(p: PlantillaItem) {
    const reemplazar = () => {
      setPlantillaId(p.id);
      setContenido(p.contenido);
      setGeneradoPorIa(false);
      if (!titulo.trim()) setTitulo(p.nombre);
      if (!tipo.trim() && p.tipo) setTipo(p.tipo);
      toast.success(`Plantilla “${p.nombre}” cargada`);
    };
    if (contenido.trim().length > 0) {
      if (
        window.confirm(
          "Esto reemplazará el texto actual del editor. ¿Querés continuar?",
        )
      ) {
        reemplazar();
      }
      return;
    }
    reemplazar();
  }

  function cargarPlantillaPorId(id: string) {
    const p = plantillas.find((pl) => pl.id === id);
    if (p) cargarPlantillaObj(p);
  }

  useImperativeHandle(ref, () => ({ cargarPlantilla: cargarPlantillaObj }));

  function completarDatos() {
    if (!expedienteSel) {
      toast.error("Elegí un expediente para completar los datos.");
      return;
    }
    if (contenido.trim().length === 0) {
      toast.error("No hay texto para completar.");
      return;
    }
    const resultado = aplicarMailMerge(contenido, expedienteSel);
    setContenido(resultado);
    const restantes = resultado.split(MARCADOR_PENDIENTE).length - 1;
    toast.success(
      restantes > 0
        ? `Datos completados · ${restantes} marcador(es) [PENDIENTE]`
        : "Datos del expediente completados",
    );
  }

  function descargarTxt() {
    if (contenido.trim().length === 0) {
      toast.error("No hay texto para descargar.");
      return;
    }
    const nombre = (titulo.trim() || "documento").replace(/[^\w\-áéíóúñ ]+/gi, "").trim();
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nombre || "documento"}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function nombreArchivo() {
    return (
      (titulo.trim() || "documento").replace(/[^\w\-áéíóúñ ]+/gi, "").trim() ||
      "documento"
    );
  }

  /** Membrete para el PDF; null si no hay datos cargados (se omite el encabezado). */
  const membreteValido = membrete ?? undefined;

  async function generarBlob(): Promise<Blob> {
    // Import dinámico: @react-pdf/renderer no entra al bundle del editor.
    const { generarPDFBlob } = await import("./documento-pdf");
    return generarPDFBlob({
      contenido,
      titulo: titulo.trim() || null,
      tipo: tipo.trim() || null,
      membrete: membreteValido,
    });
  }

  async function descargarPdf() {
    if (contenido.trim().length === 0) {
      toast.error("No hay texto para descargar.");
      return;
    }
    setGenerandoPdf(true);
    try {
      const blob = await generarBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${nombreArchivo()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("No pudimos generar el PDF. Probá de nuevo.");
    } finally {
      setGenerandoPdf(false);
    }
  }

  async function imprimir() {
    if (contenido.trim().length === 0) {
      toast.error("No hay texto para imprimir.");
      return;
    }
    setImprimiendo(true);
    try {
      // Imprimimos el MISMO PDF que se descarga (fidelidad total al texto).
      const blob = await generarBlob();
      const url = URL.createObjectURL(blob);
      const ventana = window.open(url, "_blank");
      if (!ventana) {
        // Bloqueador de pop-ups: caemos a descarga para no dejar al usuario sin salida.
        const a = document.createElement("a");
        a.href = url;
        a.download = `${nombreArchivo()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.info("Permití las ventanas emergentes para imprimir; descargamos el PDF.");
        return;
      }
      ventana.addEventListener("load", () => {
        ventana.focus();
        ventana.print();
      });
      // Liberamos la URL después de que la pestaña la haya cargado.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      toast.error("No pudimos preparar la impresión. Probá de nuevo.");
    } finally {
      setImprimiendo(false);
    }
  }

  async function copiar() {
    if (contenido.trim().length === 0) {
      toast.error("No hay texto para copiar.");
      return;
    }
    try {
      await navigator.clipboard.writeText(contenido);
      setCopiado(true);
      toast.success("Copiado al portapapeles");
      setTimeout(() => setCopiado(false), 1600);
    } catch {
      toast.error("No pudimos copiar. Copiá manualmente.");
    }
  }

  function guardar(tituloFinal: string) {
    const t = tituloFinal.trim();
    if (!t) {
      toast.error("El documento necesita un título.");
      return;
    }
    if (contenido.trim().length === 0) {
      toast.error("El documento está vacío.");
      return;
    }
    startGuardar(async () => {
      const res = await guardarDocumentoGenerado({
        id: docId ?? undefined,
        titulo: t,
        contenido,
        tipo: tipo.trim() || null,
        expedienteId: expedienteId,
        plantillaId: plantillaId,
        generadoPorIa: generadoPorIa,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(docId ? "Cambios guardados" : "Borrador guardado");
      setTituloDialog(false);
      const nuevoId = res.data?.id ?? null;
      if (!docId && nuevoId) {
        router.push(`/redaccion/${nuevoId}`);
      } else {
        router.refresh();
      }
    });
  }

  function intentarGuardar() {
    if (titulo.trim()) {
      guardar(titulo);
    } else {
      setTituloPendiente("");
      setTituloDialog(true);
    }
  }

  return (
    <Card className="overflow-hidden">
      {/* Toolbar superior */}
      <div className="flex flex-col gap-3 border-b border-border bg-muted/30 p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Plantilla" htmlFor="sel-plantilla">
            <Select
              value={plantillaId ?? undefined}
              onValueChange={(v) => cargarPlantillaPorId(v)}
            >
              <SelectTrigger id="sel-plantilla">
                <SelectValue placeholder="Cargar una plantilla…" />
              </SelectTrigger>
              <SelectContent>
                {plantillas.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No hay plantillas.
                  </div>
                ) : (
                  plantillas.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nombre}
                      {p.esGlobal ? " · global" : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </Field>

          <Field
            label="Expediente"
            htmlFor="sel-expediente"
            hint="Contexto para la IA y el completado de datos."
          >
            <Select
              value={expedienteId ?? SIN_EXPEDIENTE}
              onValueChange={(v) =>
                setExpedienteId(v === SIN_EXPEDIENTE ? null : v)
              }
            >
              <SelectTrigger id="sel-expediente">
                <SelectValue placeholder="Sin expediente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SIN_EXPEDIENTE}>Sin expediente</SelectItem>
                {expedientes.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.caratula}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={completarDatos}
            disabled={!expedienteSel || contenido.trim().length === 0}
            className="h-9 sm:h-8"
          >
            <Replace className="size-4" />
            Completar datos del expediente
          </Button>

          <AsistenteIA
            iaActiva={iaActiva}
            textoActual={contenido}
            expedienteId={expedienteId}
            onGenerar={(t) => {
              setContenido(t);
              setGeneradoPorIa(true);
            }}
            onMejorar={(t) => {
              setContenido(t);
              setGeneradoPorIa(true);
            }}
          />

          <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copiar}
              className="h-9 sm:h-8"
            >
              {copiado ? <Check className="size-4" /> : <Copy className="size-4" />}
              Copiar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={descargarTxt}
              className="h-9 sm:h-8"
            >
              <Download className="size-4" />
              .txt
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={imprimir}
              disabled={contenido.trim().length === 0 || imprimiendo}
              className="h-9 sm:h-8"
            >
              {imprimiendo ? <Spinner /> : <Printer className="size-4" />}
              Imprimir
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={descargarPdf}
              disabled={contenido.trim().length === 0 || generandoPdf}
              className="h-9 sm:h-8"
            >
              {generandoPdf ? <Spinner /> : <FileDown className="size-4" />}
              Descargar PDF
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={intentarGuardar}
              disabled={guardando}
              className="h-9 sm:h-8"
            >
              {guardando ? <Spinner /> : docId ? <Save className="size-4" /> : <FilePlus2 className="size-4" />}
              {docId ? "Guardar" : "Guardar borrador"}
            </Button>
          </div>
        </div>
      </div>

      {/* Cuerpo del editor */}
      <div className="space-y-4 p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
          <Field label="Título del documento" htmlFor="titulo">
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej.: Escrito de prórroga — Pérez c/ Gómez"
            />
          </Field>
          <Field label="Tipo" htmlFor="tipo">
            <Input
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              placeholder="Escrito judicial"
            />
          </Field>
        </div>

        {(variables.length > 0 || pendientes > 0 || generadoPorIa) && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {generadoPorIa && (
              <Badge tone="primary">
                <Wand2 className="size-3" />
                Con asistencia de IA
              </Badge>
            )}
            {variables.length > 0 && (
              <Badge tone="info">
                {variables.length} variable(s) sin completar
              </Badge>
            )}
            {pendientes > 0 && (
              <Badge tone="warning">{pendientes} marcador(es) [PENDIENTE]</Badge>
            )}
          </div>
        )}

        <EditorTextarea contenido={contenido} setContenido={setContenido} />

        <div className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
            <p>
              La validez surge de la presentación firmada en el SAC (tu usuario es tu
              firma electrónica) o de la firma de puño y letra. Revisá el documento
              antes de presentar.
            </p>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            <p>
              La IA asiste; revisá y aprobá el documento. No constituye asesoramiento
              jurídico. Verificá normas, citas y datos antes de presentar el escrito.
            </p>
          </div>
        </div>
      </div>

      {/* Diálogo para pedir título si falta */}
      <Dialog open={tituloDialog} onOpenChange={setTituloDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nombrá el borrador</DialogTitle>
            <DialogDescription>
              Poné un título para guardar y poder reencontrarlo después.
            </DialogDescription>
          </DialogHeader>
          <Field label="Título" htmlFor="titulo-dialog" required>
            <Input
              id="titulo-dialog"
              value={tituloPendiente}
              onChange={(e) => setTituloPendiente(e.target.value)}
              placeholder="Escrito de prórroga — Pérez c/ Gómez"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  guardar(tituloPendiente);
                }
              }}
            />
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={guardando}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={() => {
                setTitulo(tituloPendiente);
                guardar(tituloPendiente);
              }}
              disabled={guardando}
            >
              {guardando ? <Spinner /> : <Save className="size-4" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
});

/** Textarea grande con tipografía serif para lectura forense cómoda. */
function EditorTextarea({
  contenido,
  setContenido,
}: {
  contenido: string;
  setContenido: (v: string) => void;
}) {
  return (
    <Textarea
      value={contenido}
      onChange={(e) => setContenido(e.target.value)}
      rows={22}
      spellCheck
      placeholder={`Empezá a escribir, cargá una plantilla o pedile a la IA que genere un borrador…\n\nEj.: Señor Juez:\n\nEn los autos caratulados "…" comparece y dice:`}
      className="min-h-[420px] resize-y font-serif text-[15px] leading-7 tracking-[0.01em]"
    />
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ScanText,
  Sparkles,
  Info,
  CalendarClock,
  Users,
  FileText,
  AlertTriangle,
  Gavel,
  ShieldCheck,
} from "lucide-react";
import {
  parsearCedula,
  type CedulaExtraccion,
  type CatalogoMatch,
} from "@/lib/actions/ia";
import { crearPlazo } from "@/lib/actions/plazos";
import {
  MODALIDADES_PLAZO,
  MODALIDAD_PLAZO,
  PRIORIDADES,
  type ModalidadPlazo,
  type Prioridad,
  type Tone,
} from "@/lib/constants";
import { formatFechaCorta, capitalizar } from "@/lib/format";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { FadeIn } from "@/components/motion/fade-in";

export type ExpedienteLite = { id: string; caratula: string };

type Resultado = {
  extraccion: CedulaExtraccion;
  catalogoMatch: CatalogoMatch | null;
};

const CONFIANZA_TONE: Record<CedulaExtraccion["confianza"], Tone> = {
  alta: "success",
  media: "warning",
  baja: "destructive",
};
const CONFIANZA_LABEL: Record<CedulaExtraccion["confianza"], string> = {
  alta: "Confianza alta",
  media: "Confianza media",
  baja: "Confianza baja",
};

function modalidadLabel(m: string | null | undefined): string {
  if (!m) return "días";
  return (MODALIDAD_PLAZO[m as ModalidadPlazo]?.label ?? m).toLowerCase();
}

function esModalidad(m: string | null | undefined): ModalidadPlazo {
  return m === "corridos" || m === "horas" || m === "habiles" ? m : "habiles";
}

const DISCLAIMER =
  "La IA asiste; verificá siempre el acto, la fecha y el plazo. No reemplaza el criterio profesional.";

export function IngestaCliente({
  expedientes,
  iaActiva,
}: {
  expedientes: ExpedienteLite[];
  iaActiva: boolean;
}) {
  const router = useRouter();

  const [texto, setTexto] = React.useState("");
  const [expedienteId, setExpedienteId] = React.useState("");
  const [analizando, startAnalisis] = React.useTransition();
  const [resultado, setResultado] = React.useState<Resultado | null>(null);

  function onAnalizar() {
    if (texto.trim().length < 20) {
      toast.error("Pegá el texto de la cédula (al menos unas líneas).");
      return;
    }
    startAnalisis(async () => {
      const res = await parsearCedula({
        texto: texto.trim(),
        expedienteId: expedienteId || null,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setResultado(res.data ?? null);
      toast.success("Cédula analizada");
    });
  }

  return (
    <div className="space-y-6">
      {!iaActiva && (
        <Card className="border-warning/40 bg-warning-soft">
          <CardContent className="flex items-start gap-3 p-4 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
            <p className="text-warning-foreground">
              Configurá{" "}
              <code className="rounded-sm bg-background/60 px-1 py-0.5 text-xs">
                ANTHROPIC_API_KEY
              </code>{" "}
              para activar la lectura con IA.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ── Entrada ──────────────────────────────────────────────────── */}
        <FadeIn>
          <Card className="lg:sticky lg:top-6">
            <CardContent className="space-y-5 p-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ScanText className="size-4 text-primary" />
                Texto de la cédula
              </div>

              <Field
                label="Pegá la notificación"
                htmlFor="cedula-texto"
                hint="Copiá el texto completo de la cédula o notificación electrónica."
              >
                <Textarea
                  id="cedula-texto"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  rows={12}
                  className="min-h-[280px] resize-y font-mono text-[13px] leading-relaxed"
                  placeholder="Ej.: En los autos caratulados… se notifica a Ud. que con fecha… se ha dictado la siguiente resolución…"
                  disabled={!iaActiva || analizando}
                />
              </Field>

              <Field
                label="Expediente"
                htmlFor="cedula-expediente"
                hint="Opcional: a qué causa pertenece. Suma contexto a la IA."
              >
                <Select
                  value={expedienteId}
                  onValueChange={setExpedienteId}
                  disabled={!iaActiva || analizando}
                >
                  <SelectTrigger id="cedula-expediente">
                    <SelectValue placeholder="Elegí el expediente (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {expedientes.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.caratula}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Button
                onClick={onAnalizar}
                disabled={!iaActiva || analizando}
                className="w-full sm:w-auto"
              >
                {analizando ? <Spinner /> : <Sparkles className="size-4" />}
                {analizando ? "Analizando la cédula…" : "Analizar con IA"}
              </Button>
            </CardContent>
          </Card>
        </FadeIn>

        {/* ── Resultado ────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {analizando ? (
            <Card className="border border-border">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <Spinner className="size-6 text-primary" />
                <p className="text-sm text-muted-foreground">Analizando la cédula…</p>
              </CardContent>
            </Card>
          ) : resultado ? (
            <ResultadoCard
              resultado={resultado}
              expedientes={expedientes}
              expedientePreseleccionado={expedienteId}
              onCreado={(expId) => {
                toast.success("Plazo creado");
                router.push(`/expedientes/${expId}`);
              }}
            />
          ) : (
            <Card className="border border-dashed border-border bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <ScanText className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Esperando una cédula</p>
                  <p className="max-w-xs text-sm text-muted-foreground">
                    Pegá el texto y la IA detecta el acto, la fecha y el plazo sugerido.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-start gap-2 px-1 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            <p className="leading-relaxed">{DISCLAIMER}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Resultado destacado ──────────────────────────────────────────────── */
function ResultadoCard({
  resultado,
  expedientes,
  expedientePreseleccionado,
  onCreado,
}: {
  resultado: Resultado;
  expedientes: ExpedienteLite[];
  expedientePreseleccionado: string;
  onCreado: (expedienteId: string) => void;
}) {
  const { extraccion, catalogoMatch } = resultado;
  const confTone = CONFIANZA_TONE[extraccion.confianza];

  const diasSugerido = catalogoMatch?.dias ?? extraccion.dias_sugerido ?? null;
  const actoSugerido = catalogoMatch?.acto_procesal ?? extraccion.tipo_acto;
  const modalidadSugerida = catalogoMatch?.modalidad ?? extraccion.modalidad_sugerida ?? "habiles";
  const hayPlazo = diasSugerido != null;

  return (
    <FadeIn y={6}>
      <Card className="border border-border">
        <CardContent className="space-y-5 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Gavel className="size-3.5 text-primary" />
                Acto detectado
              </div>
              <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight">
                {capitalizar(extraccion.tipo_acto)}
              </h2>
            </div>
            <Badge tone={confTone} className="shrink-0">
              {CONFIANZA_LABEL[extraccion.confianza]}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge tone="muted" className="gap-1.5 text-data">
              <CalendarClock className="size-3" />
              {extraccion.fecha_notificacion
                ? `Notificada el ${formatFechaCorta(extraccion.fecha_notificacion)}`
                : "Fecha no detectada"}
            </Badge>
          </div>

          {extraccion.partes_detectadas.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Users className="size-3.5" />
                Partes detectadas
              </div>
              <div className="flex flex-wrap gap-1.5">
                {extraccion.partes_detectadas.map((p, i) => (
                  <Badge key={`${p}-${i}`} tone="default">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {extraccion.resumen && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <FileText className="size-3.5" />
                Resumen
              </div>
              <p className="text-sm leading-relaxed text-foreground">{extraccion.resumen}</p>
            </div>
          )}

          {hayPlazo && (
            <div className="rounded-lg border border-primary/20 bg-primary-soft/60 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
                <CalendarClock className="size-3.5" />
                Plazo sugerido
              </div>
              <p className="mt-1.5 text-base font-semibold text-foreground">
                {capitalizar(actoSugerido)} — <span className="text-data">{diasSugerido}</span> {modalidadLabel(modalidadSugerida)}
              </p>
              {catalogoMatch && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-success" />
                  Coincide con tu catálogo de plazos.
                </p>
              )}
            </div>
          )}

          {extraccion.advertencia && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning-foreground" />
              <p className="leading-relaxed">{extraccion.advertencia}</p>
            </div>
          )}

          <Separator />

          <div className="flex justify-end">
            <CrearPlazoDialog
              extraccion={extraccion}
              catalogoMatch={catalogoMatch}
              expedientes={expedientes}
              expedientePreseleccionado={expedientePreseleccionado}
              onCreado={onCreado}
            />
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

/* ── Diálogo: crear plazo ─────────────────────────────────────────────── */
function CrearPlazoDialog({
  extraccion,
  catalogoMatch,
  expedientes,
  expedientePreseleccionado,
  onCreado,
}: {
  extraccion: CedulaExtraccion;
  catalogoMatch: CatalogoMatch | null;
  expedientes: ExpedienteLite[];
  expedientePreseleccionado: string;
  onCreado: (expedienteId: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [guardando, setGuardando] = React.useState(false);

  const [expedienteId, setExpedienteId] = React.useState(expedientePreseleccionado);
  const [fechaInicio, setFechaInicio] = React.useState(extraccion.fecha_notificacion ?? "");
  const [actoProcesal, setActoProcesal] = React.useState(
    catalogoMatch?.acto_procesal ?? extraccion.tipo_acto,
  );
  const [dias, setDias] = React.useState<number>(
    catalogoMatch?.dias ?? extraccion.dias_sugerido ?? 5,
  );
  const [modalidad, setModalidad] = React.useState<ModalidadPlazo>(
    esModalidad(catalogoMatch?.modalidad ?? extraccion.modalidad_sugerida),
  );
  const [prioridad, setPrioridad] = React.useState<Prioridad>("alta");

  // Reflejar la preselección del expediente del panel principal.
  React.useEffect(() => {
    if (expedientePreseleccionado) setExpedienteId(expedientePreseleccionado);
  }, [expedientePreseleccionado]);

  async function onConfirmar() {
    if (!expedienteId) {
      toast.error("Elegí un expediente para crear el plazo.");
      return;
    }
    if (!fechaInicio) {
      toast.error("Indicá la fecha de inicio del cómputo.");
      return;
    }
    setGuardando(true);
    const fd = new FormData();
    fd.set("expediente_id", expedienteId);
    fd.set("acto_procesal", actoProcesal.trim() || "Plazo procesal");
    fd.set("dias", String(Number.isNaN(dias) ? 0 : dias));
    fd.set("modalidad", modalidad);
    fd.set("fecha_inicio_computo", fechaInicio);
    fd.set("jurisdiccion", "cordoba");
    fd.set("prioridad", prioridad);
    if (catalogoMatch) fd.set("catalogo_plazo_id", catalogoMatch.id);

    const res = await crearPlazo(null, fd);
    setGuardando(false);
    if (res.ok) {
      setOpen(false);
      onCreado(expedienteId);
    } else {
      toast.error(res.error || "No se pudo crear el plazo.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarClock className="size-4" />
          Crear plazo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear plazo</DialogTitle>
          <DialogDescription>
            Revisá los datos propuestos por la IA antes de guardar. El vencimiento se
            calcula automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field label="Expediente" required>
            <Select value={expedienteId} onValueChange={setExpedienteId}>
              <SelectTrigger>
                <SelectValue placeholder="Elegí el expediente" />
              </SelectTrigger>
              <SelectContent>
                {expedientes.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.caratula}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Acto procesal" required>
            <Input
              value={actoProcesal}
              onChange={(e) => setActoProcesal(e.target.value)}
              placeholder="Ej.: Contestar demanda"
            />
          </Field>

          <Field
            label="Inicio del cómputo"
            required
            hint="Prellenado con la fecha de notificación detectada."
          >
            <Input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Días" required>
              <Input
                type="number"
                min={0}
                value={Number.isNaN(dias) ? "" : dias}
                onChange={(e) => setDias(e.target.valueAsNumber)}
              />
            </Field>
            <Field label="Modalidad">
              <Select value={modalidad} onValueChange={(v) => setModalidad(v as ModalidadPlazo)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODALIDADES_PLAZO.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Prioridad">
            <Select value={prioridad} onValueChange={(v) => setPrioridad(v as Prioridad)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORIDADES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            <p>{DISCLAIMER}</p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={guardando}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={onConfirmar} disabled={guardando}>
            {guardando && <Spinner />}
            Crear plazo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

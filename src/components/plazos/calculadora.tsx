"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  CalendarCheck2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  CircleOff,
  Save,
  Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { crearPlazo } from "@/lib/actions/plazos";
import type { ComputoPlazo, CatalogoPlazo } from "@/lib/types/domain";
import {
  MODALIDADES_PLAZO,
  MODALIDAD_PLAZO,
  PRIORIDADES,
  FUERO,
  type ModalidadPlazo,
  type Prioridad,
} from "@/lib/constants";
import { formatFecha, formatFechaCorta, capitalizar, diasRestantes } from "@/lib/format";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
import { Stagger, StaggerItem, FadeIn } from "@/components/motion/fade-in";
import { PlazoUrgenciaBadge } from "@/components/shared/plazo-badge";
import { toast } from "sonner";

type ExpedienteLite = { id: string; caratula: string };

const MODALIDADES_CALC = MODALIDADES_PLAZO.filter((m) => m.value !== "horas");

function hoyISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60_000);
  return local.toISOString().slice(0, 10);
}

export function Calculadora({
  estudioId,
  catalogo,
  expedientes,
  expedientePreseleccionado,
}: {
  estudioId: string;
  catalogo: CatalogoPlazo[];
  expedientes: ExpedienteLite[];
  expedientePreseleccionado?: string;
}) {
  const router = useRouter();

  const [fechaInicio, setFechaInicio] = React.useState(hoyISO());
  const [dias, setDias] = React.useState(5);
  const [modalidad, setModalidad] = React.useState<ModalidadPlazo>("habiles");
  const [catalogoId, setCatalogoId] = React.useState<string>("");
  const [actoProcesal, setActoProcesal] = React.useState("");

  const [resultado, setResultado] = React.useState<ComputoPlazo | null>(null);
  const [calculando, setCalculando] = React.useState(false);

  // Dialog "Guardar como plazo"
  const [guardando, setGuardando] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [expedienteId, setExpedienteId] = React.useState(expedientePreseleccionado ?? "");
  const [prioridad, setPrioridad] = React.useState<Prioridad>("alta");
  const [descripcion, setDescripcion] = React.useState("");

  const catalogoSeleccionado = catalogo.find((c) => c.id === catalogoId);

  function aplicarCatalogo(id: string) {
    setCatalogoId(id);
    const item = catalogo.find((c) => c.id === id);
    if (item) {
      setDias(item.dias);
      setModalidad(item.modalidad === "horas" ? "habiles" : item.modalidad);
      setActoProcesal(item.acto_procesal);
    }
  }

  // Motor de cálculo (debounce 250ms)
  React.useEffect(() => {
    if (!fechaInicio || dias < 0 || Number.isNaN(dias)) {
      setResultado(null);
      return;
    }
    let cancelado = false;
    setCalculando(true);
    const t = setTimeout(async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("computar_plazo", {
        _inicio_computo: fechaInicio,
        _dias: dias,
        _modalidad: modalidad,
        _jurisdiccion: "cordoba",
        _estudio: estudioId,
      });
      if (cancelado) return;
      if (error || !data) {
        setResultado(null);
        if (error) toast.error("No pudimos calcular el plazo. Probá de nuevo.");
      } else {
        setResultado(data as unknown as ComputoPlazo);
      }
      setCalculando(false);
    }, 250);
    return () => {
      cancelado = true;
      clearTimeout(t);
    };
  }, [fechaInicio, dias, modalidad, estudioId]);

  async function onGuardar() {
    if (!expedienteId) {
      toast.error("Elegí un expediente para guardar el plazo.");
      return;
    }
    setGuardando(true);
    const fd = new FormData();
    fd.set("expediente_id", expedienteId);
    fd.set("acto_procesal", actoProcesal.trim() || "Plazo procesal");
    fd.set("modalidad", modalidad);
    fd.set("dias", String(dias));
    fd.set("fecha_inicio_computo", fechaInicio);
    fd.set("jurisdiccion", "cordoba");
    fd.set("prioridad", prioridad);
    if (descripcion.trim()) fd.set("descripcion", descripcion.trim());
    if (catalogoId) fd.set("catalogo_plazo_id", catalogoId);

    const res = await crearPlazo(null, fd);
    setGuardando(false);
    if (res.ok) {
      toast.success("Plazo guardado en el expediente.");
      setDialogOpen(false);
      router.push(`/expedientes/${expedienteId}`);
    } else {
      toast.error(res.error || "No se pudo guardar el plazo.");
    }
  }

  const venc = resultado?.fecha_vencimiento ?? null;
  const dr = venc ? diasRestantes(venc) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      {/* ── Panel de entrada ─────────────────────────────────────────── */}
      <FadeIn>
        <Card className="lg:sticky lg:top-6">
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary" />
              Parámetros del cómputo
            </div>

            <Field label="Tipo de acto procesal" hint="Autocompleta días y modalidad.">
              <Select value={catalogoId} onValueChange={aplicarCatalogo}>
                <SelectTrigger>
                  <SelectValue placeholder="Elegí del catálogo (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {catalogo.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        {c.acto_procesal}
                        <span className="text-xs text-muted-foreground">
                          · {c.dias} {c.modalidad === "corridos" ? "corridos" : "hábiles"}
                          {FUERO[c.fuero] ? ` · ${FUERO[c.fuero]!.label}` : ""}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {catalogoSeleccionado?.base_legal && (
              <p className="-mt-2 text-xs text-muted-foreground">
                Base legal: {catalogoSeleccionado.base_legal}
              </p>
            )}

            <Field label="Fecha de notificación" hint="Día en que quedaste notificado/a.">
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Días">
                <Input
                  type="number"
                  min={0}
                  value={Number.isNaN(dias) ? "" : dias}
                  onChange={(e) => setDias(e.target.valueAsNumber)}
                />
              </Field>
              <Field label="Modalidad">
                <Select
                  value={modalidad}
                  onValueChange={(v) => setModalidad(v as ModalidadPlazo)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODALIDADES_CALC.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              {MODALIDAD_PLAZO[modalidad]?.hint}
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* ── Resultado + desglose ─────────────────────────────────────── */}
      <div className="space-y-5">
        <ResultadoCard
          resultado={resultado}
          calculando={calculando}
          diasRest={dr}
        />

        {resultado && resultado.detalle.length > 0 && (
          <DesgloseCard detalle={resultado.detalle} />
        )}

        {resultado?.fecha_vencimiento && (
          <FadeIn>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                <p className="max-w-md leading-relaxed">
                  Verificá siempre el plazo. juridicOS asiste, no reemplaza el criterio
                  profesional.
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Save className="size-4" />
                    Guardar como plazo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Guardar plazo</DialogTitle>
                    <DialogDescription>
                      Vence el{" "}
                      <span className="font-medium text-foreground">
                        {capitalizar(formatFecha(venc, "EEEE d 'de' MMMM"))}
                      </span>
                      . Lo asociamos a un expediente.
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
                        placeholder="Ej: Contestar demanda"
                      />
                    </Field>

                    <Field label="Prioridad">
                      <Select
                        value={prioridad}
                        onValueChange={(v) => setPrioridad(v as Prioridad)}
                      >
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

                    <Field label="Notas" hint="Opcional.">
                      <Textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Detalles del plazo…"
                      />
                    </Field>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button type="button" onClick={onGuardar} disabled={guardando}>
                      {guardando && <Spinner />}
                      Guardar plazo
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

/* ── Resultado destacado ──────────────────────────────────────────────── */
function ResultadoCard({
  resultado,
  calculando,
  diasRest,
}: {
  resultado: ComputoPlazo | null;
  calculando: boolean;
  diasRest: number | null;
}) {
  const venc = resultado?.fecha_vencimiento ?? null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <CalendarClock className="size-4 text-primary" />
          Vencimiento
          {calculando && <Spinner className="ml-1 size-3.5 text-primary" />}
        </div>

        {!resultado || !venc ? (
          <p className="mt-6 text-sm text-muted-foreground">
            {calculando
              ? "Calculando…"
              : "Completá los parámetros para ver el vencimiento."}
          </p>
        ) : (
          <FadeIn key={`${venc}-${resultado?.dias_contados}`} y={6}>
            <div className="mt-3 space-y-4">
              <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                <p className="font-display text-data text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  {capitalizar(formatFecha(venc, "EEEE d 'de' MMMM"))}
                </p>
                <span className="text-data pb-1 text-lg text-muted-foreground">
                  {formatFecha(venc, "yyyy")}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <PlazoUrgenciaBadge
                  diasRestantes={diasRest}
                  estado="pendiente"
                  fechaVencimiento={venc}
                />
                <Badge tone="success" className="gap-1.5 text-data">
                  <CheckCircle2 className="size-3" />
                  {resultado.dias_contados} días{" "}
                  {resultado.modalidad === "corridos" ? "corridos" : "hábiles"}
                </Badge>
                {resultado.dias_inhabiles_salteados > 0 && (
                  <Badge tone="muted" className="gap-1.5 text-data">
                    <CircleOff className="size-3" />
                    {resultado.dias_inhabiles_salteados} inhábiles salteados
                  </Badge>
                )}
              </div>

              {resultado.vencimiento_con_gracia && (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm">
                  <ShieldCheck className="size-4 shrink-0 text-info" />
                  <span className="text-muted-foreground">
                    Plazo de gracia (cargo de las 2 primeras horas):
                  </span>
                  <span className="font-medium text-foreground">
                    {formatFechaCorta(resultado.vencimiento_con_gracia)}
                  </span>
                </div>
              )}
            </div>
          </FadeIn>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Desglose día por día ─────────────────────────────────────────────── */
function DesgloseCard({
  detalle,
}: {
  detalle: ComputoPlazo["detalle"];
}) {
  return (
    <FadeIn>
      <Card>
        <CardContent className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold">
              <CalendarCheck2 className="size-4 text-primary" />
              Desglose del cómputo
            </h3>
            <span className="text-data text-xs text-muted-foreground">
              {detalle.length} día{detalle.length === 1 ? "" : "s"}
            </span>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Día por día, qué se contó y qué se salteó.
          </p>

          <Separator className="mb-4" />

          <Stagger className="grid gap-1.5 sm:grid-cols-2">
            {detalle.map((d, i) => (
              <StaggerItem key={`${d.fecha}-${i}`}>
                <DiaRow dia={d} />
              </StaggerItem>
            ))}
          </Stagger>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

function DiaRow({ dia }: { dia: ComputoPlazo["detalle"][number] }) {
  const habil = dia.habil;
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
        habil
          ? "border-success/20 bg-success-soft/40"
          : "border-border bg-muted/30",
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          habil ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {habil ? dia.n ?? <CheckCircle2 className="size-3.5" /> : <CircleOff className="size-3.5" />}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate font-medium",
            habil ? "text-foreground" : "text-muted-foreground line-through",
          )}
        >
          {capitalizar(formatFecha(dia.fecha, "EEEE d 'de' MMM"))}
        </p>
        {!habil && dia.motivo && (
          <p
            className={cn(
              "text-xs",
              /feria/i.test(dia.motivo) ? "text-warning-foreground" : "text-destructive",
            )}
          >
            {dia.motivo}
          </p>
        )}
      </div>
      {habil && (
        <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
      )}
    </div>
  );
}

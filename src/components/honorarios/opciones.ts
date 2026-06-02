import type { Option } from "@/lib/constants";
import type { EstadoHonorario, EstadoFactura, BaseHonorario } from "@/lib/validations/honorarios";

/**
 * Opciones de UI (label + tono) para los enums de honorarios/facturas.
 * Viven acá porque no podemos tocar src/lib/constants.ts, pero respetan los
 * CHECK constraints de la base.
 */

export const ESTADOS_HONORARIO: Option<EstadoHonorario>[] = [
  { value: "pendiente", label: "Pendiente", tone: "info" },
  { value: "facturado", label: "Facturado", tone: "primary" },
  { value: "cobrado", label: "Cobrado", tone: "success" },
  { value: "anulado", label: "Anulado", tone: "muted" },
];
export const ESTADO_HONORARIO = Object.fromEntries(
  ESTADOS_HONORARIO.map((o) => [o.value, o]),
) as Record<EstadoHonorario, Option<EstadoHonorario>>;

export const ESTADOS_FACTURA: Option<EstadoFactura>[] = [
  { value: "borrador", label: "Borrador", tone: "muted" },
  { value: "emitida", label: "Emitida", tone: "info" },
  { value: "pagada", label: "Pagada", tone: "success" },
  { value: "anulada", label: "Anulada", tone: "destructive" },
];
export const ESTADO_FACTURA = Object.fromEntries(
  ESTADOS_FACTURA.map((o) => [o.value, o]),
) as Record<EstadoFactura, Option<EstadoFactura>>;

export const BASES_HONORARIO: Option<BaseHonorario>[] = [
  { value: "jus", label: "Unidades JUS", hint: "Cantidad de JUS × valor del JUS del estudio." },
  { value: "monto", label: "Monto fijo", hint: "Importe pactado en pesos." },
  { value: "pacto_cuota_litis", label: "Pacto de cuota litis", hint: "Porcentaje sobre el resultado del pleito." },
  { value: "tiempo", label: "Por tiempo", hint: "Honorario calculado a partir de horas trabajadas." },
];
export const BASE_HONORARIO = Object.fromEntries(
  BASES_HONORARIO.map((o) => [o.value, o]),
) as Record<BaseHonorario, Option<BaseHonorario>>;

export const TIPOS_COMPROBANTE: Option<"A" | "B" | "C">[] = [
  { value: "A", label: "Factura A", hint: "Responsable Inscripto a Responsable Inscripto." },
  { value: "B", label: "Factura B", hint: "A consumidor final / exento / monotributo." },
  { value: "C", label: "Factura C", hint: "Emitida por Monotributista." },
];

export type ClienteOption = { id: string; nombre: string };
export type ExpedienteOption = { id: string; caratula: string };

import type { Database } from "./database";

type Tables = Database["public"]["Tables"];
type Views = Database["public"]["Views"];
export type Enums = Database["public"]["Enums"];

export type Estudio = Tables["estudios"]["Row"];
export type Usuario = Tables["usuarios"]["Row"];
export type MiembroEstudio = Tables["miembros_estudio"]["Row"];
export type Cliente = Tables["clientes"]["Row"];
export type Expediente = Tables["expedientes"]["Row"];
export type Parte = Tables["partes"]["Row"];
export type Movimiento = Tables["movimientos"]["Row"];
export type Notificacion = Tables["notificaciones"]["Row"];
export type Plazo = Tables["plazos"]["Row"];
export type Audiencia = Tables["audiencias"]["Row"];
export type EventoAgenda = Tables["eventos_agenda"]["Row"];
export type Recordatorio = Tables["recordatorios"]["Row"];
export type Tarea = Tables["tareas"]["Row"];
export type Documento = Tables["documentos"]["Row"];
export type Plantilla = Tables["plantillas"]["Row"];
export type Comunicacion = Tables["comunicaciones"]["Row"];
export type CalendarioJudicial = Tables["calendario_judicial"]["Row"];
export type CatalogoPlazo = Tables["catalogo_plazos"]["Row"];
export type AuditLog = Tables["audit_log"]["Row"];
export type TimeEntry = Tables["time_entries"]["Row"];
export type Honorario = Tables["honorarios"]["Row"];
export type Factura = Tables["facturas"]["Row"];
export type DocumentoGenerado = Tables["documentos_generados"]["Row"];

export type PlazoDetalle = Views["v_plazos_detalle"]["Row"];

/** Shape returned by computar_plazo() — the deadline engine result. */
export type ComputoPlazo = {
  modalidad: Enums["modalidad_plazo"];
  fecha_inicio_computo?: string;
  fecha_vencimiento: string | null;
  vencimiento_con_gracia: string | null;
  vencimiento_habil?: string | null;
  dias_contados: number;
  dias_inhabiles_salteados: number;
  aproximado?: boolean;
  detalle: Array<{ fecha: string; habil: boolean; n?: number; motivo?: string }>;
};

export type DashboardResumen = {
  plazos_pendientes: number;
  plazos_vencidos: number;
  plazos_hoy: number;
  plazos_semana: number;
  audiencias_semana: number;
  tareas_pendientes: number;
  expedientes_activos: number;
  clientes_total: number;
};

/** Estudio + the caller's role in it (used across the app shell). */
export type EstudioConRol = Estudio & {
  rol: Enums["rol_estudio"];
  membership_id: string;
  ver_todas_causas: boolean;
};

export type SessionContext = {
  userId: string;
  email: string | null;
  profile: Usuario | null;
  estudios: EstudioConRol[];
  activeEstudio: EstudioConRol | null;
  rol: Enums["rol_estudio"] | null;
};

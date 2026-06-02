/**
 * juridicOS · Domain vocabulary (Spanish, Córdoba/AR).
 * These mirror the Postgres enums. Each option carries a UI label + a tone
 * used by Badge/Status components. Keep in sync with the DB migrations.
 */

export type Tone =
  | "default"
  | "primary"
  | "muted"
  | "info"
  | "success"
  | "warning"
  | "destructive";

export type Option<T extends string = string> = {
  value: T;
  label: string;
  tone?: Tone;
  hint?: string;
};

function mapBy<T extends string>(opts: Option<T>[]) {
  return Object.fromEntries(opts.map((o) => [o.value, o])) as Record<T, Option<T>>;
}

/* ── Roles ──────────────────────────────────────────────────────────── */
export type Rol =
  | "owner"
  | "abogado"
  | "procurador"
  | "paralegal"
  | "secretaria"
  | "cliente";

export const ROLES: Option<Rol>[] = [
  { value: "owner", label: "Socio / Administrador", tone: "primary", hint: "Acceso total: configura el estudio, usuarios y facturación." },
  { value: "abogado", label: "Abogado/a", tone: "info", hint: "Gestiona causas, plazos y redacta con IA." },
  { value: "procurador", label: "Procurador/a", tone: "info", hint: "Seguimiento de expedientes y diligencias." },
  { value: "paralegal", label: "Paralegal", tone: "muted", hint: "Carga de datos, documentos y apoyo." },
  { value: "secretaria", label: "Secretaría", tone: "muted", hint: "Agenda, clientes y recordatorios." },
  { value: "cliente", label: "Cliente", tone: "default", hint: "Acceso al portal: solo sus causas." },
];
export const ROL = mapBy(ROLES);
export const ROLES_INTERNOS = ROLES.filter((r) => r.value !== "cliente");

/* ── Fueros ─────────────────────────────────────────────────────────── */
export type Fuero =
  | "civil_comercial"
  | "laboral"
  | "familia"
  | "penal"
  | "contencioso_administrativo"
  | "concursos_quiebras"
  | "tributario"
  | "otro";

export const FUEROS: Option<Fuero>[] = [
  { value: "civil_comercial", label: "Civil y Comercial", tone: "info" },
  { value: "laboral", label: "Laboral", tone: "warning" },
  { value: "familia", label: "Familia", tone: "primary" },
  { value: "penal", label: "Penal", tone: "destructive" },
  { value: "contencioso_administrativo", label: "Contencioso Administrativo", tone: "muted" },
  { value: "concursos_quiebras", label: "Concursos y Quiebras", tone: "muted" },
  { value: "tributario", label: "Tributario", tone: "muted" },
  { value: "otro", label: "Otro", tone: "default" },
];
export const FUERO = mapBy(FUEROS);

/* ── Estados de expediente ──────────────────────────────────────────── */
export type EstadoExpediente =
  | "en_tramite"
  | "con_sentencia"
  | "en_ejecucion"
  | "en_apelacion"
  | "suspendido"
  | "archivado";

export const ESTADOS_EXPEDIENTE: Option<EstadoExpediente>[] = [
  { value: "en_tramite", label: "En trámite", tone: "info" },
  { value: "con_sentencia", label: "Con sentencia", tone: "primary" },
  { value: "en_ejecucion", label: "En ejecución", tone: "warning" },
  { value: "en_apelacion", label: "En apelación", tone: "warning" },
  { value: "suspendido", label: "Suspendido", tone: "muted" },
  { value: "archivado", label: "Archivado", tone: "muted" },
];
export const ESTADO_EXPEDIENTE = mapBy(ESTADOS_EXPEDIENTE);

/* ── Partes ─────────────────────────────────────────────────────────── */
export type TipoParte = "actor" | "demandado" | "tercero" | "citado_garantia" | "otro";
export const TIPOS_PARTE: Option<TipoParte>[] = [
  { value: "actor", label: "Actor / Demandante", tone: "success" },
  { value: "demandado", label: "Demandado", tone: "destructive" },
  { value: "tercero", label: "Tercero", tone: "muted" },
  { value: "citado_garantia", label: "Citado en garantía", tone: "info" },
  { value: "otro", label: "Otro", tone: "default" },
];
export const TIPO_PARTE = mapBy(TIPOS_PARTE);

/* ── Clientes ───────────────────────────────────────────────────────── */
export type TipoCliente = "fisica" | "juridica";
export const TIPOS_CLIENTE: Option<TipoCliente>[] = [
  { value: "fisica", label: "Persona física", tone: "info" },
  { value: "juridica", label: "Persona jurídica", tone: "primary" },
];
export const TIPO_CLIENTE = mapBy(TIPOS_CLIENTE);

/* ── Plazos ─────────────────────────────────────────────────────────── */
export type ModalidadPlazo = "habiles" | "corridos" | "horas";
export const MODALIDADES_PLAZO: Option<ModalidadPlazo>[] = [
  { value: "habiles", label: "Días hábiles", hint: "Salta fines de semana, feriados y feria judicial." },
  { value: "corridos", label: "Días corridos", hint: "Cuenta todos los días del calendario." },
  { value: "horas", label: "Horas", hint: "Plazo expresado en horas." },
];
export const MODALIDAD_PLAZO = mapBy(MODALIDADES_PLAZO);

export type EstadoPlazo = "pendiente" | "cumplido" | "vencido" | "suspendido" | "cancelado";
export const ESTADOS_PLAZO: Option<EstadoPlazo>[] = [
  { value: "pendiente", label: "Pendiente", tone: "info" },
  { value: "cumplido", label: "Cumplido", tone: "success" },
  { value: "vencido", label: "Vencido", tone: "destructive" },
  { value: "suspendido", label: "Suspendido", tone: "warning" },
  { value: "cancelado", label: "Cancelado", tone: "muted" },
];
export const ESTADO_PLAZO = mapBy(ESTADOS_PLAZO);

/* ── Prioridad ──────────────────────────────────────────────────────── */
export type Prioridad = "baja" | "media" | "alta" | "critica";
export const PRIORIDADES: Option<Prioridad>[] = [
  { value: "baja", label: "Baja", tone: "muted" },
  { value: "media", label: "Media", tone: "info" },
  { value: "alta", label: "Alta", tone: "warning" },
  { value: "critica", label: "Crítica", tone: "destructive" },
];
export const PRIORIDAD = mapBy(PRIORIDADES);

/* ── Tareas ─────────────────────────────────────────────────────────── */
export type EstadoTarea = "pendiente" | "en_curso" | "en_revision" | "completada" | "cancelada";
export const ESTADOS_TAREA: Option<EstadoTarea>[] = [
  { value: "pendiente", label: "Pendiente", tone: "muted" },
  { value: "en_curso", label: "En curso", tone: "info" },
  { value: "en_revision", label: "En revisión", tone: "warning" },
  { value: "completada", label: "Completada", tone: "success" },
  { value: "cancelada", label: "Cancelada", tone: "default" },
];
export const ESTADO_TAREA = mapBy(ESTADOS_TAREA);

/* ── Calendario judicial ────────────────────────────────────────────── */
export type TipoInhabil =
  | "feriado_nacional"
  | "feriado_provincial"
  | "no_laborable"
  | "feria_judicial"
  | "asueto";
export const TIPOS_INHABIL: Option<TipoInhabil>[] = [
  { value: "feriado_nacional", label: "Feriado nacional", tone: "destructive" },
  { value: "feriado_provincial", label: "Feriado provincial", tone: "warning" },
  { value: "no_laborable", label: "Día no laborable", tone: "info" },
  { value: "feria_judicial", label: "Feria judicial", tone: "primary" },
  { value: "asueto", label: "Asueto", tone: "muted" },
];
export const TIPO_INHABIL = mapBy(TIPOS_INHABIL);

/* ── Movimientos ────────────────────────────────────────────────────── */
export type OrigenMovimiento = "manual" | "sac" | "sistema";

/* ── Plazo urgency buckets (the heart of the deadline UX) ───────────── */
export type UrgenciaPlazo = "vencido" | "hoy" | "critico" | "proximo" | "tranquilo" | "cumplido";
export const URGENCIA: Record<UrgenciaPlazo, { label: string; tone: Tone }> = {
  vencido: { label: "Vencido", tone: "destructive" },
  hoy: { label: "Vence hoy", tone: "destructive" },
  critico: { label: "Crítico", tone: "destructive" },
  proximo: { label: "Próximo", tone: "warning" },
  tranquilo: { label: "A tiempo", tone: "success" },
  cumplido: { label: "Cumplido", tone: "success" },
};

/** Days-until → urgency bucket. Mirrors the calendar color language. */
export function urgenciaDesdeDias(diasRestantes: number | null, cumplido = false): UrgenciaPlazo {
  if (cumplido) return "cumplido";
  if (diasRestantes === null) return "tranquilo";
  if (diasRestantes < 0) return "vencido";
  if (diasRestantes === 0) return "hoy";
  if (diasRestantes <= 2) return "critico";
  if (diasRestantes <= 5) return "proximo";
  return "tranquilo";
}

/** Left-accent border color per tone — used by plazo/audiencia cards. */
export const TONE_BORDER: Record<Tone, string> = {
  default: "border-l-border",
  primary: "border-l-primary",
  muted: "border-l-muted-foreground/40",
  info: "border-l-info",
  success: "border-l-success",
  warning: "border-l-warning",
  destructive: "border-l-destructive",
};

export const APP_NAME = "juridicOS";
export const APP_TAGLINE = "El sistema operativo de tu estudio jurídico";
export const DEFAULT_JURISDICCION = "cordoba";
export const APP_TZ = "America/Argentina/Cordoba";

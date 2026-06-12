/**
 * juridicOS · Landing — Dataset estático REAL + motor de plazos client-side.
 *
 * Estos datos son un subconjunto fiel derivado de las tablas reales del producto
 * (`catalogo_plazos` y `calendario_judicial`, proyecto Supabase pzmgvvxmdgpfcvbysmai),
 * congelados en build-time para que la landing demuestre el motor SIN sesión ni RLS.
 *
 * Importante: el RPC real `computar_plazo` exige `estudioId` + sesión (RLS bloquea
 * anónimos), por eso la landing usa este gemelo client-only. La lógica replica el
 * criterio del foro de Córdoba: no se cuenta el día de notificación; se saltean fines
 * de semana, feria judicial y feriados; el plazo de gracia son las 2 primeras horas
 * hábiles (08:00–10:00) del día hábil siguiente al vencimiento.
 *
 * La demo es ilustrativa: todo plazo debe validarlo un profesional matriculado.
 */

export type FueroKey = "civil_comercial" | "penal" | "laboral" | "familia";
export type Modalidad = "habiles" | "corridos";

export type ActoPlazo = {
  fuero: FueroKey;
  acto: string;
  dias: number;
  modalidad: Modalidad;
  baseLegal: string;
};

/* ── Los 46 actos procesales precargados (datos reales) ─────────────────── */
export const ACTOS: ActoPlazo[] = [
  // Civil y Comercial — CPCC Ley 8465 (15)
  { fuero: "civil_comercial", acto: "Aclaratoria de sentencia", dias: 3, modalidad: "habiles", baseLegal: "Ley 8465 art. 336" },
  { fuero: "civil_comercial", acto: "Contestar traslado / vista sin plazo fijado", dias: 3, modalidad: "habiles", baseLegal: "Ley 8465 art. 171" },
  { fuero: "civil_comercial", acto: "Oponer excepciones — juicio ejecutivo (citación de remate)", dias: 3, modalidad: "habiles", baseLegal: "Ley 8465 art. 526" },
  { fuero: "civil_comercial", acto: "Recurso de reposición", dias: 3, modalidad: "habiles", baseLegal: "Ley 8465 art. 359" },
  { fuero: "civil_comercial", acto: "Apelar sentencia", dias: 5, modalidad: "habiles", baseLegal: "Ley 8465 art. 366" },
  { fuero: "civil_comercial", acto: "Interponer incidente de nulidad", dias: 5, modalidad: "habiles", baseLegal: "Ley 8465 art. 78" },
  { fuero: "civil_comercial", acto: "Recurso directo (queja)", dias: 5, modalidad: "habiles", baseLegal: "Ley 8465 art. 402" },
  { fuero: "civil_comercial", acto: "Comparecer / contestar demanda — juicio abreviado", dias: 6, modalidad: "habiles", baseLegal: "Ley 8465 art. 508" },
  { fuero: "civil_comercial", acto: "Contestar agravios — apelación ordinaria", dias: 10, modalidad: "habiles", baseLegal: "Ley 8465 art. 372" },
  { fuero: "civil_comercial", acto: "Contestar demanda — juicio ordinario", dias: 10, modalidad: "habiles", baseLegal: "Ley 8465 art. 493" },
  { fuero: "civil_comercial", acto: "Expresar agravios — apelación ordinaria", dias: 10, modalidad: "habiles", baseLegal: "Ley 8465 art. 371" },
  { fuero: "civil_comercial", acto: "Oponer excepciones dilatorias — juicio ordinario", dias: 10, modalidad: "habiles", baseLegal: "Ley 8465 art. 183" },
  { fuero: "civil_comercial", acto: "Recurso de casación", dias: 15, modalidad: "habiles", baseLegal: "Ley 8465 art. 385" },
  { fuero: "civil_comercial", acto: "Ofrecer / diligenciar prueba — juicio ordinario", dias: 40, modalidad: "habiles", baseLegal: "Ley 8465 art. 498" },
  { fuero: "civil_comercial", acto: "Plazo del tribunal para dictar sentencia — ordinario", dias: 60, modalidad: "habiles", baseLegal: "Ley 8465 art. 121 inc. 3" },

  // Penal — CPP Córdoba Ley 8123 (25)
  { fuero: "penal", acto: "Recurso directo (queja) por recurso denegado", dias: 2, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 486" },
  { fuero: "penal", acto: "Aclaratoria o rectificación de la sentencia", dias: 3, modalidad: "corridos", baseLegal: "CPP Córdoba (Ley 8123) art. 145" },
  { fuero: "penal", acto: "Apelación contra la prisión preventiva", dias: 3, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) arts. 336 in fine y 461" },
  { fuero: "penal", acto: "Apelación del rechazo de querellante particular", dias: 3, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) arts. 93 y 461" },
  { fuero: "penal", acto: "Citación a juicio: comparecer y examinar actuaciones", dias: 3, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 361" },
  { fuero: "penal", acto: "Concesión o denegación del recurso de apelación", dias: 3, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 461" },
  { fuero: "penal", acto: "Observar el cómputo de la pena", dias: 3, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 504" },
  { fuero: "penal", acto: "Oposición a la prisión preventiva (ante el Juez de Control)", dias: 3, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 336 in fine, vía art. 338" },
  { fuero: "penal", acto: "Oposición al requerimiento de citación a juicio", dias: 3, modalidad: "corridos", baseLegal: "CPP Córdoba (Ley 8123) arts. 357 y 338" },
  { fuero: "penal", acto: "Recurso de apelación", dias: 3, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 461" },
  { fuero: "penal", acto: "Recurso de reposición", dias: 3, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) arts. 457 y 458" },
  { fuero: "penal", acto: "Resolución de la constitución de querellante particular", dias: 3, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 92" },
  { fuero: "penal", acto: "Comparecer ante la alzada (emplazamiento en apelación)", dias: 5, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 462" },
  { fuero: "penal", acto: "Constituirse detenido (condena ≤ 6 meses, sin sospecha de fuga)", dias: 5, modalidad: "corridos", baseLegal: "CPP Córdoba (Ley 8123) art. 505" },
  { fuero: "penal", acto: "Informe y dictamen para la libertad condicional", dias: 5, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 517" },
  { fuero: "penal", acto: "Oposición a la intervención del actor civil", dias: 5, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) arts. 102 y 103" },
  { fuero: "penal", acto: "Resolución del recurso de reposición (tribunal)", dias: 5, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 458" },
  { fuero: "penal", acto: "Solicitud fiscal de audiencia oral de prisión preventiva", dias: 5, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 336 (texto Ley 10457)" },
  { fuero: "penal", acto: "Emplazamiento e informe en el trámite de casación (TSJ)", dias: 10, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 476" },
  { fuero: "penal", acto: "Ofrecer prueba para el debate", dias: 10, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 363" },
  { fuero: "penal", acto: "Pago de la pena de multa", dias: 10, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 511" },
  { fuero: "penal", acto: "Recepción de prueba en excepciones de la instrucción", dias: 15, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) art. 18" },
  { fuero: "penal", acto: "Recurso de casación", dias: 15, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123, modif. Ley 10749) art. 474" },
  { fuero: "penal", acto: "Recurso de inconstitucionalidad", dias: 15, modalidad: "habiles", baseLegal: "CPP Córdoba (Ley 8123) arts. 483 y 484" },
  { fuero: "penal", acto: "Duración de la investigación penal preparatoria (plazo base)", dias: 90, modalidad: "corridos", baseLegal: "CPP Córdoba (Ley 8123) art. 337" },

  // Laboral — LPT Ley 7987 (4)
  { fuero: "laboral", acto: "Contestar agravios / adherir al recurso", dias: 5, modalidad: "habiles", baseLegal: "Ley 7987 art. 96" },
  { fuero: "laboral", acto: "Interponer recurso (apelación / casación) — fundado", dias: 5, modalidad: "habiles", baseLegal: "Ley 7987 art. 95" },
  { fuero: "laboral", acto: "Ofrecer prueba (trabada la litis)", dias: 6, modalidad: "habiles", baseLegal: "Ley 7987 art. 52" },
  { fuero: "laboral", acto: "Comparecer y contestar demanda (audiencia de conciliación)", dias: 10, modalidad: "habiles", baseLegal: "Ley 7987 arts. 46/49/50" },

  // Familia — Ley 10305 (2)
  { fuero: "familia", acto: "Contestar demanda — proceso de familia", dias: 10, modalidad: "habiles", baseLegal: "Ley 10305 (verificar art.)" },
  { fuero: "familia", acto: "Interponer y fundar recurso de apelación", dias: 10, modalidad: "habiles", baseLegal: "Ley 10305 art. 144" },
];

/** Conteo total real del catálogo en producción. */
export const TOTAL_PLAZOS = 46;

export type FueroMeta = {
  key: FueroKey | "todos";
  label: string;
  count: number;
  norma: string;
  /** Clase de borde-izquierdo 2px del fuero. Tinta sobre papel: pesos de gris
   *  para diferenciar sin color saturado; el único azul (escaso) en Familia. */
  borderClass: string;
};

export const FUEROS_META: FueroMeta[] = [
  { key: "todos", label: "Todos", count: 46, norma: "Córdoba", borderClass: "border-l-border" },
  { key: "penal", label: "Penal", count: 25, norma: "CPP · Ley 8123 (modif. 10749)", borderClass: "border-l-foreground/40" },
  { key: "civil_comercial", label: "Civil y Comercial", count: 15, norma: "CPCC · Ley 8465", borderClass: "border-l-foreground/30" },
  { key: "laboral", label: "Laboral", count: 4, norma: "LPT · Ley 7987", borderClass: "border-l-foreground/20" },
  { key: "familia", label: "Familia", count: 2, norma: "Ley 10305", borderClass: "border-l-primary/60" },
];

/* ── Calendario judicial de Córdoba 2026 (datos reales) ─────────────────── */
type TipoDia = "feria_judicial" | "feriado_nacional" | "no_laborable";
type EntradaCalendario = { tipo: TipoDia; descripcion: string };

/**
 * Mapa fecha → entrada. Para el cómputo, son inhábiles los fines de semana,
 * la feria judicial y los feriados nacionales. Los "no laborables" turísticos
 * se marcan pero se cuentan como hábiles (los tribunales funcionan).
 * Las ferias 2026 son las cargadas en la base (la de invierno está marcada
 * "estimada — validar Acordada TSJ").
 */
export const CALENDARIO_2026: Record<string, EntradaCalendario> = {
  "2026-01-01": { tipo: "feriado_nacional", descripcion: "Año Nuevo · feria judicial de verano" },
  ...Object.fromEntries(
    // Feria judicial de verano: 2 al 31 de enero
    Array.from({ length: 30 }, (_, i) => {
      const d = i + 2;
      const key = `2026-01-${String(d).padStart(2, "0")}`;
      return [key, { tipo: "feria_judicial", descripcion: "Feria judicial de verano (receso estival)" }];
    }),
  ),
  "2026-02-16": { tipo: "feriado_nacional", descripcion: "Lunes de Carnaval" },
  "2026-02-17": { tipo: "feriado_nacional", descripcion: "Martes de Carnaval" },
  "2026-03-23": { tipo: "no_laborable", descripcion: "Día no laborable turístico" },
  "2026-03-24": { tipo: "feriado_nacional", descripcion: "Día de la Memoria por la Verdad y la Justicia" },
  "2026-04-02": { tipo: "feriado_nacional", descripcion: "Día del Veterano y Caídos en Malvinas (Jueves Santo)" },
  "2026-04-03": { tipo: "feriado_nacional", descripcion: "Viernes Santo" },
  "2026-05-01": { tipo: "feriado_nacional", descripcion: "Día del Trabajador" },
  "2026-05-25": { tipo: "feriado_nacional", descripcion: "Día de la Revolución de Mayo" },
  "2026-06-15": { tipo: "feriado_nacional", descripcion: "Gral. Güemes (trasladado del 17/06)" },
  "2026-06-20": { tipo: "feriado_nacional", descripcion: "Gral. Belgrano · Día de la Bandera" },
  "2026-07-06": { tipo: "feria_judicial", descripcion: "Feria judicial de invierno (estimada — validar Acordada TSJ)" },
  "2026-07-07": { tipo: "feria_judicial", descripcion: "Feria judicial de invierno (estimada — validar Acordada TSJ)" },
  "2026-07-08": { tipo: "feria_judicial", descripcion: "Feria judicial de invierno (estimada — validar Acordada TSJ)" },
  "2026-07-09": { tipo: "feriado_nacional", descripcion: "Día de la Independencia · feria de invierno" },
  "2026-07-10": { tipo: "feria_judicial", descripcion: "Feria judicial de invierno (estimada — validar Acordada TSJ)" },
  "2026-07-11": { tipo: "feria_judicial", descripcion: "Feria judicial de invierno (estimada — validar Acordada TSJ)" },
  "2026-07-12": { tipo: "feria_judicial", descripcion: "Feria judicial de invierno (estimada — validar Acordada TSJ)" },
  "2026-07-13": { tipo: "feria_judicial", descripcion: "Feria judicial de invierno (estimada — validar Acordada TSJ)" },
  "2026-07-14": { tipo: "feria_judicial", descripcion: "Feria judicial de invierno (estimada — validar Acordada TSJ)" },
  "2026-07-15": { tipo: "feria_judicial", descripcion: "Feria judicial de invierno (estimada — validar Acordada TSJ)" },
  "2026-07-16": { tipo: "feria_judicial", descripcion: "Feria judicial de invierno (estimada — validar Acordada TSJ)" },
  "2026-07-17": { tipo: "feria_judicial", descripcion: "Feria judicial de invierno (estimada — validar Acordada TSJ)" },
  "2026-08-17": { tipo: "feriado_nacional", descripcion: "Gral. San Martín" },
  "2026-10-12": { tipo: "feriado_nacional", descripcion: "Día del Respeto a la Diversidad Cultural" },
  "2026-11-23": { tipo: "feriado_nacional", descripcion: "Día de la Soberanía Nacional (trasladado del 20/11)" },
  "2026-12-07": { tipo: "no_laborable", descripcion: "Día no laborable turístico" },
  "2026-12-08": { tipo: "feriado_nacional", descripcion: "Inmaculada Concepción de María" },
  "2026-12-25": { tipo: "feriado_nacional", descripcion: "Navidad" },
};

/** Fechas reales cargadas en la tabla calendario_judicial 2026 (conteo de filas). */
export const TOTAL_DIAS_CALENDARIO = 62;

/* ── Motor de cómputo (gemelo client-only del RPC computar_plazo) ───────── */
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const DIAS_SEMANA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}
export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/** ¿Es inhábil? Fin de semana, feria judicial o feriado nacional. */
export function diaInhabil(date: Date): { inhabil: boolean; motivo?: string } {
  const dow = date.getDay();
  if (dow === 0 || dow === 6) return { inhabil: true, motivo: "Fin de semana" };
  const e = CALENDARIO_2026[toISO(date)];
  if (e && (e.tipo === "feria_judicial" || e.tipo === "feriado_nacional")) {
    return { inhabil: true, motivo: e.descripcion };
  }
  return { inhabil: false };
}

export type DiaComputo = {
  iso: string;
  habil: boolean;
  contado: boolean;
  motivo?: string;
};

export type ResultadoPlazo = {
  vencimientoISO: string;
  graciaISO: string;
  dias: number;
  modalidad: Modalidad;
  diasInhabilesSalteados: number;
  timeline: DiaComputo[];
  /** ¿La fecha de notificación cayó en feria/inhábil? */
  notificacionEnFeria: boolean;
};

/**
 * Replica el criterio de Córdoba: no se cuenta el día de notificación; el plazo
 * arranca el día hábil siguiente. Hábiles → se saltean inhábiles. Corridos →
 * cuentan todos los días, y si el vencimiento cae en inhábil pasa al próximo hábil.
 */
export function computarPlazoDemo(inicioISO: string, dias: number, modalidad: Modalidad): ResultadoPlazo {
  const inicio = parseISO(inicioISO);
  const notificacionEnFeria = diaInhabil(inicio).inhabil;
  const timeline: DiaComputo[] = [];
  let cursor = new Date(inicio);
  let contados = 0;
  let salteados = 0;

  while (contados < dias) {
    cursor = addDays(cursor, 1);
    const { inhabil, motivo } = diaInhabil(cursor);
    if (modalidad === "corridos") {
      contados++;
      timeline.push({ iso: toISO(cursor), habil: !inhabil, contado: true, motivo });
    } else if (inhabil) {
      salteados++;
      timeline.push({ iso: toISO(cursor), habil: false, contado: false, motivo });
    } else {
      contados++;
      timeline.push({ iso: toISO(cursor), habil: true, contado: true });
    }
    if (timeline.length > 400) break; // backstop
  }

  let venc = new Date(cursor);
  if (modalidad === "corridos") {
    while (diaInhabil(venc).inhabil) {
      venc = addDays(venc, 1);
    }
  }

  let gracia = addDays(venc, 1);
  while (diaInhabil(gracia).inhabil) gracia = addDays(gracia, 1);

  return {
    vencimientoISO: toISO(venc),
    graciaISO: toISO(gracia),
    dias,
    modalidad,
    diasInhabilesSalteados: salteados,
    timeline,
    notificacionEnFeria,
  };
}

/* ── Formateo (es-AR) ───────────────────────────────────────────────────── */
export function fechaLarga(iso: string): string {
  const d = parseISO(iso);
  return `${DIAS_SEMANA[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}
export function fechaLargaConAnio(iso: string): string {
  const d = parseISO(iso);
  return `${DIAS_SEMANA[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}
export function fechaCorta(iso: string): string {
  const d = parseISO(iso);
  return `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`;
}
export function diaNumero(iso: string): number {
  return parseISO(iso).getDate();
}
export function capitalizar(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Días restantes desde una fecha base (default: hoy del demo). */
export function diasRestantesDemo(iso: string, baseISO?: string): number {
  const base = baseISO ? parseISO(baseISO) : new Date();
  const target = parseISO(iso);
  const MS = 1000 * 60 * 60 * 24;
  return Math.round((target.setHours(12, 0, 0, 0) - base.setHours(12, 0, 0, 0)) / MS);
}

/** Etiqueta de modalidad para chips. */
export function etiquetaModalidad(dias: number, modalidad: Modalidad): string {
  return `${dias} ${modalidad === "corridos" ? (dias === 1 ? "día corrido" : "días corridos") : (dias === 1 ? "día hábil" : "días hábiles")}`;
}

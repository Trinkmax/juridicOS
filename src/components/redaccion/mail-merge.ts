import { FUERO, ESTADO_EXPEDIENTE, type Fuero, type EstadoExpediente } from "@/lib/constants";
import type { ExpedienteContexto, Membrete } from "./tipos";

/** Marcador que queda cuando una variable conocida no tiene dato real. */
export const MARCADOR_PENDIENTE = "[PENDIENTE]";

/** Fuentes de datos del merge: cualquiera puede faltar. */
export type FuentesMerge = {
  expediente?: ExpedienteContexto | null;
  membrete?: Membrete | null;
};

function fechaHoyLarga(): string {
  // Fecha del runtime del cliente, en formato forense ("2 de junio de 2026").
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const d = new Date();
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

/* ── Número a letras (pesos argentinos, registro forense) ─────────────────
 * Convierte el monto reclamado a su forma escrita ("ocho millones doscientos
 * treinta y cuatro mil doscientos setenta y seis"), como en los escritos.
 * No agrega "pesos": la plantilla ya escribe "suma de pesos {{monto_letras}}". */
const CENTENAS = [
  "", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos",
  "seiscientos", "setecientos", "ochocientos", "novecientos",
];
const DECENAS = [
  "", "", "veinte", "treinta", "cuarenta", "cincuenta",
  "sesenta", "setenta", "ochenta", "noventa",
];
const DIEZ_19 = [
  "diez", "once", "doce", "trece", "catorce", "quince",
  "dieciséis", "diecisiete", "dieciocho", "diecinueve",
];
const VEINTE_29 = [
  "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro",
  "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve",
];
const UNIDADES = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];

/** 0..99 en su forma plena ("uno", "treinta y uno"). */
function decenasYmenos(n: number): string {
  if (n < 10) return UNIDADES[n];
  if (n < 20) return DIEZ_19[n - 10];
  if (n < 30) return VEINTE_29[n - 20];
  const d = Math.floor(n / 10);
  const u = n % 10;
  return DECENAS[d] + (u ? ` y ${UNIDADES[u]}` : "");
}

/** 0..999 en su forma plena. 100 exacto → "cien". */
function centenasYmenos(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "cien";
  const c = Math.floor(n / 100);
  const resto = n % 100;
  const cabeza = c > 0 ? CENTENAS[c] : "";
  const cola = resto > 0 ? decenasYmenos(resto) : "";
  return [cabeza, cola].filter(Boolean).join(" ");
}

/** Apócope de "uno"→"un" cuando precede a "mil"/"millón" ("veintiún", "treinta y un"). */
function apocope(s: string): string {
  if (s === "uno") return "un";
  if (s.endsWith("veintiuno")) return s.slice(0, -"veintiuno".length) + "veintiún";
  if (s.endsWith(" uno")) return s.slice(0, -4) + " un";
  return s;
}

/** 0..999.999 con su "mil". */
function seisDigitos(n: number): string {
  const miles = Math.floor(n / 1000);
  const resto = n % 1000;
  let out = "";
  if (miles === 1) out = "mil";
  else if (miles > 1) out = `${apocope(centenasYmenos(miles))} mil`;
  if (resto > 0) out += (out ? " " : "") + centenasYmenos(resto);
  return out;
}

/** Entero ≥ 0 a letras (hasta el orden de los billones). */
function enteroALetras(n: number): string {
  if (n === 0) return "cero";
  const millones = Math.floor(n / 1_000_000);
  const resto = n % 1_000_000;
  let out = "";
  if (millones === 1) out = "un millón";
  else if (millones > 1) out = `${apocope(seisDigitos(millones))} millones`;
  if (resto > 0) out += (out ? " " : "") + seisDigitos(resto);
  return out || "cero";
}

/**
 * Monto a letras en registro forense. Parte entera en palabras y, si hay
 * centavos, "con XX/100". Devuelve "" para valores no numéricos.
 */
export function montoEnLetras(valor: number): string {
  if (!Number.isFinite(valor) || valor < 0) return "";
  const entero = Math.floor(valor);
  const centavos = Math.round((valor - entero) * 100);
  const base = enteroALetras(entero);
  return centavos > 0 ? `${base} con ${String(centavos).padStart(2, "0")}/100` : base;
}

/** Monto en cifras con formato argentino ("8.234.276"). */
function montoEnCifras(valor: number): string {
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(valor);
}

/**
 * Mapa variable → valor real para un expediente dado. Las variables sin dato
 * (string vacío) se resuelven al marcador [PENDIENTE] durante el reemplazo.
 */
function valoresExpediente(exp: ExpedienteContexto): Record<string, string> {
  const fuero = FUERO[exp.fuero as Fuero]?.label ?? exp.fuero;
  const estado = ESTADO_EXPEDIENTE[exp.estado as EstadoExpediente]?.label ?? exp.estado;
  // `numeric` llega como string desde PostgREST; coercemos y validamos.
  const montoNum =
    exp.monto_reclamado != null && exp.monto_reclamado !== ""
      ? Number(exp.monto_reclamado)
      : null;
  const monto = montoNum != null && Number.isFinite(montoNum) && montoNum > 0 ? montoNum : null;
  return {
    expediente_caratula: exp.caratula,
    caratula: exp.caratula,
    nro_sac: exp.nro_sac ?? "",
    juzgado: exp.juzgado ?? "",
    secretaria: exp.secretaria ?? "",
    fuero,
    estado_expediente: estado,
    etapa: exp.etapa ?? "",
    monto: monto != null ? montoEnCifras(monto) : "",
    monto_letras: monto != null ? montoEnLetras(monto) : "",
    localidad: exp.cliente_localidad ?? "",
    cliente_nombre: exp.cliente_nombre ?? "",
    cliente_documento: exp.cliente_documento ?? "",
    cliente_domicilio: exp.cliente_domicilio ?? "",
    contraparte_nombre: exp.contraparte_nombre ?? "",
    contraparte_documento: exp.contraparte_documento ?? "",
    // El CUIT de la contraparte se carga en el mismo campo "documento" de la parte.
    contraparte_cuit: exp.contraparte_documento ?? "",
    contraparte_domicilio: exp.contraparte_domicilio ?? "",
  };
}

/** Mapa variable → valor desde el membrete del estudio (letrado y domicilios). */
function valoresMembrete(m: Membrete): Record<string, string> {
  return {
    abogado: m.abogado ?? "",
    matricula: m.matricula ?? "",
    estudio_nombre: m.estudio ?? "",
    estudio_domicilio: m.domicilio ?? "",
    domicilio_electronico: m.domicilioElectronico ?? "",
  };
}

/**
 * Variables que el sistema completa solo (expediente + estudio + fecha).
 * Se usa para los hints de la UI; mantener en sincronía con los mapas de arriba.
 */
export const VARIABLES_AUTOMATICAS = [
  "expediente_caratula",
  "nro_sac",
  "juzgado",
  "secretaria",
  "fuero",
  "etapa",
  "monto",
  "monto_letras",
  "localidad",
  "cliente_nombre",
  "cliente_documento",
  "cliente_domicilio",
  "contraparte_nombre",
  "contraparte_documento",
  "contraparte_cuit",
  "contraparte_domicilio",
  "abogado",
  "matricula",
  "estudio_nombre",
  "estudio_domicilio",
  "domicilio_electronico",
  "fecha",
] as const;

/**
 * Reemplaza las variables {{var}} del texto con los datos disponibles.
 * - Variables conocidas con dato → valor real.
 * - Variables conocidas sin dato → [PENDIENTE].
 * - Variables de una fuente AUSENTE (p. ej. sin expediente elegido) → quedan
 *   intactas, para poder completarlas en un merge posterior.
 * - Variables desconocidas → se dejan tal cual (el usuario las completa a mano).
 */
export function aplicarMailMerge(texto: string, fuentes: FuentesMerge): string {
  const valores: Record<string, string> = {
    ...(fuentes.membrete ? valoresMembrete(fuentes.membrete) : {}),
    ...(fuentes.expediente ? valoresExpediente(fuentes.expediente) : {}),
    fecha: fechaHoyLarga(),
  };
  return texto.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (original, clave: string) => {
    if (!(clave in valores)) return original;
    const valor = valores[clave];
    return valor && valor.length > 0 ? valor : MARCADOR_PENDIENTE;
  });
}

/** Variables únicas presentes en el texto (para resaltar / contar pendientes). */
export function variablesEnTexto(texto: string): string[] {
  const set = new Set<string>();
  const re = /\{\{\s*([\w.]+)\s*\}\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto)) !== null) {
    if (m[1]) set.add(m[1]);
  }
  return [...set];
}

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

/**
 * Mapa variable → valor real para un expediente dado. Las variables sin dato
 * (string vacío) se resuelven al marcador [PENDIENTE] durante el reemplazo.
 */
function valoresExpediente(exp: ExpedienteContexto): Record<string, string> {
  const fuero = FUERO[exp.fuero as Fuero]?.label ?? exp.fuero;
  const estado = ESTADO_EXPEDIENTE[exp.estado as EstadoExpediente]?.label ?? exp.estado;
  return {
    expediente_caratula: exp.caratula,
    caratula: exp.caratula,
    nro_sac: exp.nro_sac ?? "",
    juzgado: exp.juzgado ?? "",
    secretaria: exp.secretaria ?? "",
    fuero,
    estado_expediente: estado,
    etapa: exp.etapa ?? "",
    cliente_nombre: exp.cliente_nombre ?? "",
    cliente_documento: exp.cliente_documento ?? "",
    cliente_domicilio: exp.cliente_domicilio ?? "",
    contraparte_nombre: exp.contraparte_nombre ?? "",
    contraparte_documento: exp.contraparte_documento ?? "",
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
  "cliente_nombre",
  "cliente_documento",
  "cliente_domicilio",
  "contraparte_nombre",
  "contraparte_documento",
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

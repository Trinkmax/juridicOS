import type { Plantilla, Estudio } from "@/lib/types/domain";

/** Plantilla con un flag derivado: las globales (estudio_id null) son de solo lectura. */
export type PlantillaItem = Plantilla & { esGlobal: boolean };

/** Borrador generado, con la carátula del expediente vinculado (join to-one). */
export type BorradorItem = {
  id: string;
  titulo: string;
  tipo: string | null;
  generado_por_ia: boolean;
  expediente_id: string | null;
  updated_at: string;
  expedientes: { caratula: string } | null;
};

/** Expediente con los datos que usa el mail-merge y el contexto de IA. */
export type ExpedienteContexto = {
  id: string;
  caratula: string;
  nro_sac: string | null;
  juzgado: string | null;
  secretaria: string | null;
  fuero: string;
  estado: string;
  etapa: string | null;
  /**
   * Monto reclamado → {{monto}} y {{monto_letras}}. La columna es `numeric`:
   * PostgREST la serializa como string en runtime (aunque el tipo generado diga
   * number), por eso aceptamos ambos y coercemos en el mail-merge.
   */
  monto_reclamado: number | string | null;
  cliente_nombre: string | null;
  cliente_documento: string | null;
  cliente_domicilio: string | null;
  /** Localidad del cliente → {{localidad}} (lugar de los escritos). */
  cliente_localidad: string | null;
  /** Primera parte ajena (es_propio = false): la contraparte del pleito. */
  contraparte_nombre: string | null;
  contraparte_documento: string | null;
  contraparte_domicilio: string | null;
};

/** Fila de `partes` embebida en la consulta de expedientes (para la contraparte). */
export type ParteJoin = {
  nombre: string;
  documento: string | null;
  domicilio: string | null;
  es_propio: boolean;
};

/**
 * Datos del membrete profesional para el encabezado de los escritos en PDF.
 * Se arma en la page (RSC) desde `estudios` + `estudios.config` y se pasa al
 * editor. Todo opcional: el PDF renderiza sólo lo que tenga.
 */
export type Membrete = {
  estudio?: string | null;
  abogado?: string | null;
  matricula?: string | null;
  domicilio?: string | null;
  domicilioElectronico?: string | null;
  telefono?: string | null;
  email?: string | null;
  cuit?: string | null;
  logoUrl?: string | null;
  incluirLogo?: boolean;
};

/** Claves del membrete guardadas en `estudios.config.membrete` (JSON). */
export type MembreteConfig = {
  abogado?: string;
  matricula?: string;
  domicilio_electronico?: string;
  incluir_logo?: boolean;
};

/**
 * Arma el objeto `Membrete` para el PDF combinando columnas de `estudios`
 * (nombre, cuit, domicilio, email, telefono, logo_url) con los extras
 * guardados en `estudios.config.membrete`. Pura: corre en RSC o cliente.
 */
export function construirMembrete(estudio: Estudio): Membrete {
  const cfg = ((estudio.config as { membrete?: MembreteConfig } | null)?.membrete ??
    {}) as MembreteConfig;
  return {
    estudio: estudio.nombre ?? null,
    abogado: cfg.abogado ?? null,
    matricula: cfg.matricula ?? null,
    domicilio: estudio.domicilio ?? null,
    domicilioElectronico: cfg.domicilio_electronico ?? null,
    telefono: estudio.telefono ?? null,
    email: estudio.email ?? null,
    cuit: estudio.cuit ?? null,
    logoUrl: estudio.logo_url ?? null,
    incluirLogo: cfg.incluir_logo ?? false,
  };
}

/** Documento que el editor abre para editar (modo edición). */
export type DocumentoEdicion = {
  id: string;
  titulo: string;
  contenido: string;
  tipo: string | null;
  expediente_id: string | null;
  generado_por_ia: boolean;
};

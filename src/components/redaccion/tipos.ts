import type { Plantilla } from "@/lib/types/domain";

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
  cliente_nombre: string | null;
  cliente_documento: string | null;
};

/** Documento que el editor abre para editar (modo edición). */
export type DocumentoEdicion = {
  id: string;
  titulo: string;
  contenido: string;
  tipo: string | null;
  expediente_id: string | null;
  generado_por_ia: boolean;
};

"use server";

import { revalidatePath } from "next/cache";
import {
  getActionContext,
  fromZod,
  NO_ESTUDIO,
  type ActionResult,
} from "@/lib/actions/_base";
import { documentoMetaSchema } from "@/lib/validations/documento";

const BUCKET = "documentos";

export type RegistrarDocumentoInput = {
  nombre: string;
  storage_path: string;
  mime: string;
  tamano_bytes: number;
  expediente_id?: string | null;
  cliente_id?: string | null;
  etiquetas?: string[];
  compartido_cliente?: boolean;
};

/**
 * Registra en la tabla "documentos" un archivo previamente subido a Storage.
 * El upload lo hace el client (browser client); acá sólo persistimos metadatos.
 */
export async function registrarDocumento(
  input: RegistrarDocumentoInput,
): Promise<ActionResult<{ id: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const parsed = documentoMetaSchema.safeParse({
    nombre: input.nombre,
    tipo: input.mime ?? undefined,
    expediente_id: input.expediente_id ?? undefined,
    cliente_id: input.cliente_id ?? undefined,
    etiquetas: input.etiquetas,
    compartido_cliente: input.compartido_cliente,
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { data, error } = await ctx.supabase
    .from("documentos")
    .insert({
      nombre: parsed.data.nombre,
      storage_path: input.storage_path,
      mime: input.mime || null,
      tamano_bytes: input.tamano_bytes,
      tipo: parsed.data.tipo,
      expediente_id: parsed.data.expediente_id ?? null,
      cliente_id: parsed.data.cliente_id ?? null,
      etiquetas:
        parsed.data.etiquetas && parsed.data.etiquetas.length > 0
          ? parsed.data.etiquetas
          : null,
      compartido_cliente: parsed.data.compartido_cliente ?? false,
      estudio_id: ctx.estudioId,
      created_by: ctx.userId,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/documentos");
  return { ok: true, data: { id: data.id }, message: "Documento guardado" };
}

/**
 * Elimina un documento: primero borra el objeto de Storage y luego la fila.
 * Filtra por estudio_id (RLS además protege).
 */
export async function eliminarDocumento(id: string): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { data: doc, error: fetchError } = await ctx.supabase
    .from("documentos")
    .select("storage_path")
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId)
    .single();

  if (fetchError) return { ok: false, error: fetchError.message };

  if (doc?.storage_path) {
    const { error: storageError } = await ctx.supabase.storage
      .from(BUCKET)
      .remove([doc.storage_path]);
    if (storageError) return { ok: false, error: storageError.message };
  }

  const { error } = await ctx.supabase
    .from("documentos")
    .delete()
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/documentos");
  return { ok: true, message: "Documento eliminado" };
}

/**
 * Genera una URL firmada de descarga (válida 120s) para el objeto de Storage.
 */
export async function urlDescarga(
  storage_path: string,
): Promise<ActionResult<{ url: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { data, error } = await ctx.supabase.storage
    .from(BUCKET)
    .createSignedUrl(storage_path, 120);

  if (error) return { ok: false, error: error.message };
  if (!data?.signedUrl) {
    return { ok: false, error: "No pudimos generar el enlace de descarga." };
  }

  return { ok: true, data: { url: data.signedUrl } };
}

/** Activa o desactiva el acceso del cliente al documento. */
export async function toggleCompartido(
  id: string,
  compartido: boolean,
): Promise<ActionResult> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  const { error } = await ctx.supabase
    .from("documentos")
    .update({ compartido_cliente: compartido })
    .eq("id", id)
    .eq("estudio_id", ctx.estudioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/documentos");
  return {
    ok: true,
    message: compartido
      ? "Documento compartido con el cliente"
      : "Documento ya no se comparte",
  };
}

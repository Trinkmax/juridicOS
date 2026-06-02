"use server";

import { getActionContext, NO_ESTUDIO, type ActionResult } from "@/lib/actions/_base";

/**
 * Genera un signed URL para que el cliente descargue un documento compartido.
 *
 * Seguridad: el SELECT está protegido por RLS, así que un cliente sólo puede
 * resolver documentos que (a) pertenecen a una causa suya y (b) están marcados
 * como `compartido_cliente`. Si la fila no es visible o no está compartida,
 * fallamos cerrado sin filtrar la existencia del documento.
 */
export async function urlDescargaPortal(
  documentoId: string,
): Promise<ActionResult<{ url: string; nombre: string }>> {
  const ctx = await getActionContext();
  if (!ctx) return NO_ESTUDIO;

  if (typeof documentoId !== "string" || documentoId.length === 0) {
    return { ok: false, error: "Documento inválido." };
  }

  const { data: doc, error } = await ctx.supabase
    .from("documentos")
    .select("id, nombre, storage_path, compartido_cliente")
    .eq("id", documentoId)
    .eq("compartido_cliente", true)
    .maybeSingle();

  if (error) return { ok: false, error: "No pudimos preparar la descarga." };
  if (!doc || !doc.storage_path) {
    return { ok: false, error: "El documento ya no está disponible." };
  }

  const { data: signed, error: signErr } = await ctx.supabase.storage
    .from("documentos")
    .createSignedUrl(doc.storage_path, 60 * 5, { download: doc.nombre });

  if (signErr || !signed?.signedUrl) {
    return { ok: false, error: "No pudimos preparar la descarga." };
  }

  return { ok: true, data: { url: signed.signedUrl, nombre: doc.nombre } };
}

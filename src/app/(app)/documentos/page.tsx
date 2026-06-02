import { FileText, FileSearch } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentoUploader } from "@/components/documentos/documento-uploader";
import { DocumentosFiltros } from "@/components/documentos/documentos-filtros";
import { DocumentosLista } from "@/components/documentos/documentos-lista";
import type { DocumentoFilaItem } from "@/components/documentos/documento-fila";

export const metadata = { title: "Documentos" };

type Search = { q?: string; expediente?: string };

export default async function DocumentosPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { q, expediente } = await searchParams;
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();

  const [{ data: docsData }, { data: expsData }] = await Promise.all([
    (() => {
      let query = supabase
        .from("documentos")
        .select("*, expedientes(caratula)")
        .eq("estudio_id", activeEstudio.id);
      if (q) query = query.ilike("nombre", `%${q}%`);
      if (expediente) query = query.eq("expediente_id", expediente);
      return query.order("created_at", { ascending: false });
    })(),
    supabase
      .from("expedientes")
      .select("id, caratula")
      .eq("estudio_id", activeEstudio.id)
      .order("updated_at", { ascending: false }),
  ]);

  const documentos = (docsData ?? []) as DocumentoFilaItem[];
  const expedientes = expsData ?? [];

  const hayFiltros = Boolean(q || expediente);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentos"
        description="El archivo digital del estudio: subí, organizá y compartí con tus clientes."
        icon={<FileText className="size-5" />}
      >
        <DocumentoUploader estudioId={activeEstudio.id} expedientes={expedientes} />
      </PageHeader>

      <DocumentosFiltros expedientes={expedientes} />

      {documentos.length === 0 ? (
        hayFiltros ? (
          <EmptyState
            icon={FileSearch}
            title="Sin resultados"
            description="No encontramos documentos con esos filtros. Probá ajustar la búsqueda."
          />
        ) : (
          <EmptyState
            icon={FileText}
            title="Todavía no hay documentos"
            description="Subí escritos, contratos, pruebas y cualquier archivo de tus causas. Quedan guardados de forma segura."
            action={
              <DocumentoUploader
                estudioId={activeEstudio.id}
                expedientes={expedientes}
              />
            }
          />
        )
      ) : (
        <DocumentosLista documentos={documentos} />
      )}
    </div>
  );
}

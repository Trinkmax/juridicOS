import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { iaActivaEstudio } from "@/lib/actions/ia";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { RedaccionWorkspace } from "@/components/redaccion/redaccion-workspace";
import { construirMembrete } from "@/components/redaccion/tipos";
import type {
  PlantillaItem,
  BorradorItem,
  ExpedienteContexto,
  DocumentoEdicion,
  ParteJoin,
} from "@/components/redaccion/tipos";

export const metadata = { title: "Editar documento" };

export default async function EditarDocumentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();
  const estudioId = activeEstudio.id;

  const { data: doc } = await supabase
    .from("documentos_generados")
    .select("id, titulo, contenido, tipo, expediente_id, generado_por_ia")
    .eq("id", id)
    .eq("estudio_id", estudioId)
    .maybeSingle();

  if (!doc) notFound();

  const documento: DocumentoEdicion = {
    id: doc.id,
    titulo: doc.titulo,
    contenido: doc.contenido,
    tipo: doc.tipo,
    expediente_id: doc.expediente_id,
    generado_por_ia: doc.generado_por_ia,
  };

  const [plantillasRes, borradoresRes, expedientesRes] = await Promise.all([
    supabase
      .from("plantillas")
      .select("*")
      .or(`estudio_id.is.null,estudio_id.eq.${estudioId}`)
      .order("orden", { ascending: true })
      .order("nombre", { ascending: true }),
    supabase
      .from("documentos_generados")
      .select("id, titulo, tipo, generado_por_ia, expediente_id, updated_at, expedientes(caratula)")
      .eq("estudio_id", estudioId)
      .order("updated_at", { ascending: false })
      .limit(20),
    supabase
      .from("expedientes")
      .select(
        "id, caratula, nro_sac, juzgado, secretaria, fuero, estado, etapa, clientes(nombre, documento, domicilio_real), partes(nombre, documento, es_propio)",
      )
      .eq("estudio_id", estudioId)
      .eq("archivado", false)
      .order("updated_at", { ascending: false }),
  ]);

  const plantillas: PlantillaItem[] = (plantillasRes.data ?? []).map((p) => ({
    ...p,
    esGlobal: p.estudio_id === null,
  }));

  const borradores: BorradorItem[] = (borradoresRes.data ?? []).map((b) => {
    const exp = b.expedientes as { caratula: string } | null;
    return {
      id: b.id,
      titulo: b.titulo,
      tipo: b.tipo,
      generado_por_ia: b.generado_por_ia,
      expediente_id: b.expediente_id,
      updated_at: b.updated_at,
      expedientes: exp,
    };
  });

  const expedientes: ExpedienteContexto[] = (expedientesRes.data ?? []).map((e) => {
    const cliente = e.clientes as {
      nombre: string;
      documento: string | null;
      domicilio_real: string | null;
    } | null;
    const partes = (e.partes ?? []) as ParteJoin[];
    const contraparte = partes.find((p) => !p.es_propio) ?? null;
    return {
      id: e.id,
      caratula: e.caratula,
      nro_sac: e.nro_sac,
      juzgado: e.juzgado,
      secretaria: e.secretaria,
      fuero: e.fuero,
      estado: e.estado,
      etapa: e.etapa,
      cliente_nombre: cliente?.nombre ?? null,
      cliente_documento: cliente?.documento ?? null,
      cliente_domicilio: cliente?.domicilio_real ?? null,
      contraparte_nombre: contraparte?.nombre ?? null,
      contraparte_documento: contraparte?.documento ?? null,
    };
  });

  const iaActiva = await iaActivaEstudio(activeEstudio.id);
  const membrete = construirMembrete(activeEstudio);

  return (
    <div className="space-y-6">
      <PageHeader
        title={documento.titulo || "Editar documento"}
        description="Retomá la edición de este borrador. Los cambios se guardan en su lugar."
        icon={<Sparkles className="size-5" />}
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/redaccion">
            <ArrowLeft className="size-4" />
            Volver a Redacción
          </Link>
        </Button>
      </PageHeader>

      <FadeIn>
        <RedaccionWorkspace
          plantillas={plantillas}
          expedientes={expedientes}
          borradores={borradores}
          iaActiva={iaActiva}
          documento={documento}
          membrete={membrete}
        />
      </FadeIn>
    </div>
  );
}

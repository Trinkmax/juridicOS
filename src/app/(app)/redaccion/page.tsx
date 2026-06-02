import { Sparkles, Info } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { iaActivaEstudio } from "@/lib/actions/ia";
import { PageHeader } from "@/components/ui/page-header";
import { FadeIn } from "@/components/motion/fade-in";
import { RedaccionWorkspace } from "@/components/redaccion/redaccion-workspace";
import { construirMembrete } from "@/components/redaccion/tipos";
import type {
  PlantillaItem,
  BorradorItem,
  ExpedienteContexto,
} from "@/components/redaccion/tipos";

export const metadata = { title: "Redacción con IA" };

export default async function RedaccionPage() {
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();
  const estudioId = activeEstudio.id;

  const [plantillasRes, borradoresRes, expedientesRes] = await Promise.all([
    supabase
      .from("plantillas")
      .select("*")
      .or(`estudio_id.is.null,estudio_id.eq.${estudioId}`)
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
        "id, caratula, nro_sac, juzgado, secretaria, fuero, estado, etapa, clientes(nombre, documento)",
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
    const cliente = e.clientes as { nombre: string; documento: string | null } | null;
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
    };
  });

  const iaActiva = await iaActivaEstudio(activeEstudio.id);
  const membrete = construirMembrete(activeEstudio);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Redacción con IA"
        description="Escribí escritos con asistencia de IA, plantillas reutilizables y datos del expediente."
        icon={<Sparkles className="size-5" />}
      />

      {!iaActiva && (
        <FadeIn>
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="font-medium">La IA está desactivada</p>
              <p className="text-muted-foreground">
                Configurá <code className="rounded bg-muted px-1 py-0.5 text-xs">ANTHROPIC_API_KEY</code>{" "}
                en el entorno del servidor para activar el asistente de redacción. La
                edición manual y las plantillas funcionan igual.
              </p>
            </div>
          </div>
        </FadeIn>
      )}

      <FadeIn>
        <RedaccionWorkspace
          plantillas={plantillas}
          expedientes={expedientes}
          borradores={borradores}
          iaActiva={iaActiva}
          membrete={membrete}
        />
      </FadeIn>
    </div>
  );
}

import { Calculator } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { CatalogoPlazo } from "@/lib/types/domain";
import { PageHeader } from "@/components/ui/page-header";
import { Calculadora } from "@/components/plazos/calculadora";

export const metadata = { title: "Calculadora de plazos" };

export default async function CalculadoraPage({
  searchParams,
}: {
  searchParams: Promise<{ expediente?: string }>;
}) {
  const sp = await searchParams;
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();

  const [{ data: catalogo }, { data: expedientes }] = await Promise.all([
    supabase
      .from("catalogo_plazos")
      .select("*")
      .or(`estudio_id.is.null,estudio_id.eq.${activeEstudio.id}`)
      .eq("activo", true)
      .order("fuero")
      .order("acto_procesal"),
    supabase
      .from("expedientes")
      .select("id, caratula")
      .eq("estudio_id", activeEstudio.id)
      .eq("archivado", false)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Calculadora de plazos"
        description="Computá vencimientos en días hábiles judiciales de Córdoba, al instante."
        icon={<Calculator className="size-5" />}
      />

      <Calculadora
        estudioId={activeEstudio.id}
        catalogo={(catalogo as CatalogoPlazo[]) ?? []}
        expedientes={expedientes ?? []}
        expedientePreseleccionado={sp.expediente}
      />
    </div>
  );
}

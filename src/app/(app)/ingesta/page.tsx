import { ScanText } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { iaDisponible } from "@/lib/ai/claude";
import { PageHeader } from "@/components/ui/page-header";
import { FadeIn } from "@/components/motion/fade-in";
import { IngestaCliente, type ExpedienteLite } from "@/components/ingesta/ingesta-cliente";

export const metadata = { title: "Ingesta de cédulas" };

export default async function IngestaPage() {
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();

  const { data } = await supabase
    .from("expedientes")
    .select("id, caratula")
    .eq("estudio_id", activeEstudio.id)
    .eq("archivado", false)
    .order("updated_at", { ascending: false });

  const expedientes: ExpedienteLite[] = (data ?? []).map((e) => ({
    id: e.id,
    caratula: e.caratula,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ingesta de cédulas"
        description="Pegá una cédula o notificación y la IA detecta el acto y propone el plazo."
        icon={<ScanText className="size-5" />}
      />

      <FadeIn>
        <IngestaCliente expedientes={expedientes} iaActiva={iaDisponible()} />
      </FadeIn>
    </div>
  );
}

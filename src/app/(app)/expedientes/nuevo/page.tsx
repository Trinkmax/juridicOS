import Link from "next/link";
import { ArrowLeft, FolderPlus } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { ExpedienteForm } from "@/components/expedientes/expediente-form";

export const metadata = { title: "Nuevo expediente" };

export default async function NuevoExpedientePage() {
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();

  const { data } = await supabase
    .from("clientes")
    .select("id, nombre")
    .eq("estudio_id", activeEstudio.id)
    .eq("activo", true)
    .order("nombre", { ascending: true });

  const clientes = data ?? [];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
        <Link href="/expedientes">
          <ArrowLeft />
          Volver a expedientes
        </Link>
      </Button>

      <PageHeader
        title="Nuevo expediente"
        description="Cargá los datos de la causa. Después podés sumar partes, plazos y audiencias."
        icon={<FolderPlus className="size-5" />}
      />

      <FadeIn>
        <div className="max-w-3xl">
          <ExpedienteForm clientes={clientes} />
        </div>
      </FadeIn>
    </div>
  );
}

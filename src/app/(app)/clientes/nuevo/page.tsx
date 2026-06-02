import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { ClienteForm } from "@/components/clientes/cliente-form";

export const metadata = { title: "Nuevo cliente" };

export default async function NuevoClientePage() {
  await requireEstudio();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3">
          <Link href="/clientes">
            <ArrowLeft className="size-4" />
            Clientes
          </Link>
        </Button>
        <PageHeader
          title="Nuevo cliente"
          description="Cargá los datos del cliente para vincularlo a sus causas."
          icon={<UserPlus className="size-5" />}
        />
      </div>

      <FadeIn>
        <Card>
          <CardContent className="pt-5">
            <ClienteForm
              cancel={
                <Button asChild type="button" variant="ghost">
                  <Link href="/clientes">Cancelar</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}

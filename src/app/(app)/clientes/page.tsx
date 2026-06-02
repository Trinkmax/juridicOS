import Link from "next/link";
import { Users, UserPlus } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ClientesSearch } from "@/components/clientes/clientes-search";
import {
  ClientesTabla,
  type ClienteConCausas,
} from "@/components/clientes/clientes-tabla";

export const metadata = { title: "Clientes" };

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();

  let query = supabase
    .from("clientes")
    .select("*, expedientes(count)")
    .eq("estudio_id", activeEstudio.id)
    .eq("activo", true)
    .order("nombre", { ascending: true });

  const term = q?.trim();
  if (term) {
    query = query.or(`nombre.ilike.%${term}%,documento.ilike.%${term}%`);
  }

  const { data } = await query;

  const clientes: ClienteConCausas[] = (data ?? []).map((row) => {
    const { expedientes, ...cliente } = row;
    const causas = Array.isArray(expedientes)
      ? (expedientes[0]?.count ?? 0)
      : 0;
    return { ...cliente, causas };
  });

  const hayBusqueda = !!term;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="La cartera de personas y empresas que representa tu estudio."
        icon={<Users className="size-5" />}
      >
        <Button asChild>
          <Link href="/clientes/nuevo">
            <UserPlus className="size-4" />
            Nuevo cliente
          </Link>
        </Button>
      </PageHeader>

      <ClientesSearch initialQuery={term ?? ""} />

      {clientes.length === 0 ? (
        hayBusqueda ? (
          <EmptyState
            icon={Users}
            title="Sin resultados"
            description={`No encontramos clientes que coincidan con “${term}”.`}
          />
        ) : (
          <EmptyState
            icon={Users}
            title="Todavía no cargaste clientes"
            description="Sumá tu primer cliente para vincularlo a causas, plazos y audiencias."
            action={
              <Button asChild>
                <Link href="/clientes/nuevo">
                  <UserPlus className="size-4" />
                  Nuevo cliente
                </Link>
              </Button>
            }
          />
        )
      ) : (
        <ClientesTabla clientes={clientes} />
      )}
    </div>
  );
}

import { FolderOpen } from "lucide-react";
import { requireSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { CausaCard, type CausaPortal } from "@/components/portal/causa-card";

export const metadata = { title: "Mis causas" };

export default async function PortalHomePage() {
  const ctx = await requireSession();
  const supabase = await createClient();

  // RLS ya restringe a las causas del cliente.
  const { data } = await supabase
    .from("expedientes")
    .select("*, clientes(nombre)")
    .order("updated_at", { ascending: false });

  const causas = (data ?? []) as CausaPortal[];
  const nombre = ctx.profile?.nombre?.trim();

  return (
    <div className="space-y-8">
      <FadeIn>
        <header className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            {nombre ? `Hola, ${nombre}` : "Hola"}
          </h1>
          <p className="text-muted-foreground">
            {causas.length > 0
              ? "Acá podés seguir el estado de tus causas, ver audiencias y novedades."
              : "Este es tu espacio para seguir tus causas con tu estudio."}
          </p>
        </header>
      </FadeIn>

      {causas.length === 0 ? (
        <FadeIn delay={0.05}>
          <EmptyState
            icon={FolderOpen}
            title="Todavía no tenés causas asignadas"
            description="Tu estudio las cargará pronto. Cuando estén disponibles, vas a poder seguir su avance desde acá."
          />
        </FadeIn>
      ) : (
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {causas.map((causa) => (
            <StaggerItem key={causa.id}>
              <CausaCard causa={causa} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

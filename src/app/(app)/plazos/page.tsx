import Link from "next/link";
import { CalendarClock, Calculator, AlertTriangle } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { PlazoDetalle } from "@/lib/types/domain";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { PlazoCard } from "@/components/plazos/plazo-card";
import { PlazosFiltros } from "@/components/plazos/plazos-filtros";
import { PlazosTablero } from "@/components/plazos/plazos-tablero";
import { PlazosVistaToggle } from "@/components/plazos/plazos-vista-toggle";

export const metadata = { title: "Plazos" };

type Responsable = { id: string; nombre: string };

/** Normaliza una relación to-one embebida (objeto o array) a un objeto o null. */
function toOne<T>(rel: T | T[] | null | undefined): T | null {
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel ?? null;
}

export default async function PlazosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; responsable?: string; vista?: string }>;
}) {
  const sp = await searchParams;
  const estado = sp.estado ?? "pendiente";
  const vista: "tablero" | "lista" = sp.vista === "lista" ? "lista" : "tablero";
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();

  let query = supabase
    .from("v_plazos_detalle")
    .select("*")
    .eq("estudio_id", activeEstudio.id)
    .order("fecha_vencimiento", { ascending: true, nullsFirst: false });

  if (estado !== "__todos__")
    query = query.eq("estado", estado as NonNullable<PlazoDetalle["estado"]>);
  if (sp.responsable) query = query.eq("responsable_id", sp.responsable);

  const [{ data: plazosRaw }, { data: miembros }] = await Promise.all([
    query,
    supabase
      .from("miembros_estudio")
      .select(
        "usuario_id, usuarios!miembros_estudio_usuario_id_fkey(nombre_completo, nombre)",
      )
      .eq("estudio_id", activeEstudio.id)
      .eq("activo", true),
  ]);

  const plazos = (plazosRaw as PlazoDetalle[]) ?? [];

  const responsables: Responsable[] = (miembros ?? [])
    .map((m) => {
      const u = toOne(m.usuarios);
      return { id: m.usuario_id, nombre: u?.nombre_completo || u?.nombre || "Sin nombre" };
    })
    .filter((r) => r.nombre !== "Sin nombre");

  const requierenAtencion = plazos.filter(
    (p) => p.estado === "pendiente" && (p.dias_restantes ?? 99) <= 0,
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plazos"
        description="Vencimientos procesales del estudio, ordenados por urgencia."
        icon={<CalendarClock className="size-5" />}
      >
        <Button asChild>
          <Link href="/plazos/calculadora">
            <Calculator className="size-4" />
            Calcular nuevo plazo
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <PlazosFiltros responsables={responsables} />
        <PlazosVistaToggle vista={vista} />
      </div>

      {requierenAtencion > 0 && (
        <Card className="flex items-center gap-3 border-destructive/25 bg-destructive-soft p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-destructive/15 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-destructive">
              Tenés {requierenAtencion} plazo{requierenAtencion === 1 ? "" : "s"} que
              {requierenAtencion === 1 ? " requiere" : " requieren"} atención
            </p>
            <p className="text-destructive/80">
              Vencen hoy o ya están vencidos. Revisalos cuanto antes.
            </p>
          </div>
        </Card>
      )}

      {plazos.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No hay plazos para mostrar"
          description="Cuando computes un plazo en la calculadora y lo guardes en un expediente, va a aparecer acá."
          action={
            <Button asChild>
              <Link href="/plazos/calculadora">
                <Calculator className="size-4" />
                Calcular un plazo
              </Link>
            </Button>
          }
        />
      ) : vista === "tablero" ? (
        <PlazosTablero plazos={plazos} />
      ) : (
        <Stagger className="space-y-3">
          {plazos.map((p) => (
            <StaggerItem key={p.id}>
              <PlazoCard plazo={p} quickAction />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

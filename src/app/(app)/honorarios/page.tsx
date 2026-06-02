import { Receipt, Wallet, Clock, FileCheck2 } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { HonorariosTabs } from "@/components/honorarios/honorarios-tabs";
import type { HonorarioRow } from "@/components/honorarios/honorarios-tabla";
import type { TimeEntryRow } from "@/components/honorarios/time-tracking-panel";
import type { FacturaRow } from "@/components/honorarios/facturas-tabla";
import type { CuentaCliente } from "@/components/honorarios/estado-cuenta";

export const metadata = { title: "Honorarios y facturación" };

/** Normaliza una relación to-one embebida (objeto o array) a objeto o null. */
function toOne<T>(rel: T | T[] | null | undefined): T | null {
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel ?? null;
}

export default async function HonorariosPage() {
  const { activeEstudio } = await requireEstudio();
  const supabase = await createClient();
  const estudioId = activeEstudio.id;
  const valorJus = activeEstudio.valor_jus ?? 0;

  const [
    { data: honorariosRaw },
    { data: entriesRaw },
    { data: facturasRaw },
    { data: clientesRaw },
    { data: expedientesRaw },
  ] = await Promise.all([
    supabase
      .from("honorarios")
      .select("*, expedientes(caratula), clientes(nombre)")
      .eq("estudio_id", estudioId)
      .order("created_at", { ascending: false }),
    supabase
      .from("time_entries")
      .select(
        "*, expedientes(caratula), usuarios!time_entries_usuario_id_fkey(nombre_completo)",
      )
      .eq("estudio_id", estudioId)
      .order("fecha", { ascending: false }),
    supabase
      .from("facturas")
      .select("*, clientes(nombre)")
      .eq("estudio_id", estudioId)
      .order("created_at", { ascending: false }),
    supabase.from("clientes").select("id, nombre").eq("estudio_id", estudioId).order("nombre"),
    supabase
      .from("expedientes")
      .select("id, caratula")
      .eq("estudio_id", estudioId)
      .order("caratula"),
  ]);

  const honorarios: HonorarioRow[] = (honorariosRaw ?? []).map((h) => ({
    id: h.id,
    concepto: h.concepto,
    base: h.base,
    monto: h.monto,
    estado: h.estado,
    porcentaje: h.porcentaje,
    jus_cantidad: h.jus_cantidad,
    created_at: h.created_at,
    expediente: toOne(h.expedientes)?.caratula ?? null,
    cliente: toOne(h.clientes)?.nombre ?? null,
  }));

  const entries: TimeEntryRow[] = (entriesRaw ?? []).map((e) => ({
    id: e.id,
    fecha: e.fecha,
    minutos: e.minutos,
    descripcion: e.descripcion,
    facturable: e.facturable,
    expediente: toOne(e.expedientes)?.caratula ?? null,
    usuario: toOne(e.usuarios)?.nombre_completo ?? null,
  }));

  const facturas: FacturaRow[] = (facturasRaw ?? []).map((f) => ({
    id: f.id,
    numero: f.numero,
    tipo_comprobante: f.tipo_comprobante,
    fecha: f.fecha,
    total: f.total,
    estado: f.estado,
    cae: f.cae,
    cae_vencimiento: f.cae_vencimiento,
    cliente: toOne(f.clientes)?.nombre ?? null,
  }));

  const clientes = (clientesRaw ?? []).map((c) => ({ id: c.id, nombre: c.nombre }));
  const expedientes = (expedientesRaw ?? []).map((e) => ({ id: e.id, caratula: e.caratula }));

  /* ── KPIs ──────────────────────────────────────────────────── */
  const totalFacturado = facturas
    .filter((f) => f.estado === "emitida" || f.estado === "pagada")
    .reduce((acc, f) => acc + f.total, 0);

  const honorariosPendientes = honorarios
    .filter((h) => h.estado === "pendiente")
    .reduce((acc, h) => acc + h.monto, 0);

  const ahora = new Date();
  const minutosMes = entries
    .filter((e) => {
      const d = new Date(e.fecha);
      return d.getFullYear() === ahora.getFullYear() && d.getMonth() === ahora.getMonth();
    })
    .reduce((acc, e) => acc + e.minutos, 0);
  const horasMes = (minutosMes / 60).toLocaleString("es-AR", { maximumFractionDigits: 1 });

  const facturasPagadasTotal = facturas
    .filter((f) => f.estado === "pagada")
    .reduce((acc, f) => acc + f.total, 0);

  /* ── Estado de cuenta por cliente ──────────────────────────── */
  const cuentaMap = new Map<string, CuentaCliente>();
  function bucket(clienteId: string | null, nombre: string | null): CuentaCliente | null {
    if (!clienteId) return null;
    let c = cuentaMap.get(clienteId);
    if (!c) {
      c = {
        clienteId,
        nombre: nombre ?? "Cliente",
        honorariosPendientes: 0,
        facturasEmitidas: 0,
        facturasPagadas: 0,
        adeudado: 0,
      };
      cuentaMap.set(clienteId, c);
    }
    return c;
  }

  for (const h of honorariosRaw ?? []) {
    if (h.estado === "anulado") continue;
    const c = bucket(h.cliente_id, toOne(h.clientes)?.nombre ?? null);
    if (c && (h.estado === "pendiente" || h.estado === "facturado")) {
      c.honorariosPendientes += h.monto;
    }
  }
  for (const f of facturasRaw ?? []) {
    const c = bucket(f.cliente_id, toOne(f.clientes)?.nombre ?? null);
    if (!c) continue;
    if (f.estado === "emitida") c.facturasEmitidas += f.total;
    else if (f.estado === "pagada") c.facturasPagadas += f.total;
  }
  const cuentas = [...cuentaMap.values()]
    .map((c) => ({ ...c, adeudado: c.honorariosPendientes + c.facturasEmitidas }))
    .sort((a, b) => b.adeudado - a.adeudado);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Honorarios y facturación"
        description="Honorarios, registro de tiempo y facturación interna del estudio."
        icon={<Receipt className="size-5" />}
      />

      <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem>
          <StatCard
            icon={FileCheck2}
            label="Total facturado"
            value={formatMoney(totalFacturado)}
            hint={`${formatMoney(facturasPagadasTotal)} cobrado`}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={Wallet}
            label="Honorarios pendientes"
            value={formatMoney(honorariosPendientes)}
            hint="A facturar o cobrar"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={Clock}
            label="Horas del mes"
            value={`${horasMes} h`}
            hint="Tiempo registrado este mes"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={Receipt}
            label="Valor del JUS"
            value={formatMoney(valorJus)}
            hint="Configurado en el estudio"
          />
        </StaggerItem>
      </Stagger>

      <FadeIn>
        <HonorariosTabs
          honorarios={honorarios}
          entries={entries}
          facturas={facturas}
          cuentas={cuentas}
          clientes={clientes}
          expedientes={expedientes}
          valorJus={valorJus}
        />
      </FadeIn>
    </div>
  );
}

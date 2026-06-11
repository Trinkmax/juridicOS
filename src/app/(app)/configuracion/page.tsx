import { headers } from "next/headers";
import { CalendarClock, Settings, Sparkles, Stamp } from "lucide-react";
import { requireEstudio } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { IaConfigForm } from "@/components/configuracion/ia-config-form";
import {
  CalendarFeedCard,
  type FeedData,
} from "@/components/configuracion/calendar-feed-card";
import {
  MembreteForm,
  type MembreteFormValues,
} from "@/components/configuracion/membrete-form";
import type { MembreteConfig } from "@/components/redaccion/tipos";
import { formatMoney } from "@/lib/utils";

export const metadata = { title: "Configuración" };

const PLAN_LABEL: Record<string, string> = { basico: "Básico", pro: "Pro", premium: "Premium" };

function Dato({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

export default async function ConfiguracionPage() {
  const { activeEstudio, rol, userId } = await requireEstudio();
  const admin = rol === "owner";
  const supabase = await createClient();

  const { data: iaCfg } = await supabase
    .from("estudio_ia_config")
    .select("modelo, secret_id")
    .eq("estudio_id", activeEstudio.id)
    .maybeSingle();
  const configurada = !!iaCfg?.secret_id;
  const modelo = iaCfg?.modelo ?? "claude-opus-4-8";

  // Feed ICS del usuario en este estudio + URL base (para construir el enlace).
  const { data: feedRow } = await supabase
    .from("calendar_feeds")
    .select("token, alcance, last_accessed_at")
    .eq("estudio_id", activeEstudio.id)
    .eq("usuario_id", userId)
    .maybeSingle();
  const feed: FeedData | null = feedRow
    ? {
        token: feedRow.token,
        alcance: feedRow.alcance === "personal" ? "personal" : "estudio",
        lastAccessedAt: feedRow.last_accessed_at,
      }
    : null;

  const h = await headers();
  const hostHeader = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (hostHeader.includes("localhost") ? "http" : "https");
  const baseUrl = `${proto}://${hostHeader}`;

  const membreteCfg = ((activeEstudio.config as { membrete?: MembreteConfig } | null)
    ?.membrete ?? {}) as MembreteConfig;
  const membreteValores: MembreteFormValues = {
    nombre: activeEstudio.nombre ?? "",
    cuit: activeEstudio.cuit ?? "",
    domicilio: activeEstudio.domicilio ?? "",
    email: activeEstudio.email ?? "",
    telefono: activeEstudio.telefono ?? "",
    logoUrl: activeEstudio.logo_url ?? "",
    abogado: membreteCfg.abogado ?? "",
    matricula: membreteCfg.matricula ?? "",
    domicilioElectronico: membreteCfg.domicilio_electronico ?? "",
    incluirLogo: membreteCfg.incluir_logo ?? false,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Configuración"
        description="Datos del estudio e integraciones."
        icon={<Settings className="size-5" />}
      />

      <Card>
        <CardHeader>
          <CardTitle>Estudio</CardTitle>
          <CardDescription>Información general del estudio.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <Dato label="Nombre" value={activeEstudio.nombre} />
          <Dato label="CUIT" value={activeEstudio.cuit ?? "—"} />
          <Dato label="Localidad" value={activeEstudio.localidad ?? "—"} />
          <Dato label="Plan" value={PLAN_LABEL[activeEstudio.plan] ?? activeEstudio.plan} />
          <Dato label="Valor del jus" value={formatMoney(activeEstudio.valor_jus)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stamp className="size-4 text-primary" /> Membrete de escritos
          </CardTitle>
          <CardDescription>
            Encabezado y datos profesionales que aparecen en los documentos PDF
            generados desde Redacción (estudio, abogado/a, matrícula y domicilios).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admin ? (
            <MembreteForm valores={membreteValores} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Sólo el administrador del estudio puede editar el membrete.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" /> Inteligencia artificial
          </CardTitle>
          <CardDescription>
            Conectá tu propia API key de Anthropic (Claude) para activar la redacción asistida,
            la ingesta de cédulas y los resúmenes. Cada estudio usa su propia key, guardada
            cifrada en Vault y nunca visible para el cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admin ? (
            <IaConfigForm configurada={configurada} modelo={modelo} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Sólo el administrador del estudio puede configurar la IA. Estado actual:{" "}
              <span className="font-medium text-foreground">
                {configurada ? "configurada" : "no configurada"}
              </span>
              .
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="size-4 text-primary" /> Calendario · Apple, Google y Outlook
          </CardTitle>
          <CardDescription>
            Suscribí tu agenda —plazos, audiencias y eventos— desde el calendario de tu
            teléfono o computadora. El enlace es personal y de solo lectura: se actualiza
            solo y la gestión real sigue en juridicOS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarFeedCard feed={feed} baseUrl={baseUrl} />
        </CardContent>
      </Card>
    </div>
  );
}

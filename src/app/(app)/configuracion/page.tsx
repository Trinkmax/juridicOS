import { Settings, Sparkles } from "lucide-react";
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
  const { activeEstudio, rol } = await requireEstudio();
  const admin = rol === "owner";
  const supabase = await createClient();

  const { data: iaCfg } = await supabase
    .from("estudio_ia_config")
    .select("modelo, secret_id")
    .eq("estudio_id", activeEstudio.id)
    .maybeSingle();
  const configurada = !!iaCfg?.secret_id;
  const modelo = iaCfg?.modelo ?? "claude-opus-4-8";

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
    </div>
  );
}

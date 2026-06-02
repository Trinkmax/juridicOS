import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";

export const metadata = { title: "Configuración" };

export default function ConfiguracionPage() {
  return (
    <ComingSoon
      title="Configuración"
      description="Datos del estudio, branding, plantillas y suscripción."
      icon={Settings}
      fase="la Fase 2"
    />
  );
}

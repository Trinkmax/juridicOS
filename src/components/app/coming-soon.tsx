import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export function ComingSoon({
  title,
  description,
  icon: Icon,
  fase,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  fase?: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} icon={<Icon className="size-5" />} />
      <EmptyState
        icon={Icon}
        title="Próximamente"
        description={`Este módulo llega en ${fase ?? "una próxima fase"}. Estamos construyéndolo con el mismo cuidado que el resto de juridicOS.`}
      />
    </div>
  );
}

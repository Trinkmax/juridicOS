import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function LoadingClientes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3.5 w-64" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      <Skeleton className="h-10 w-full max-w-xs rounded-md" />

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-3 py-3">
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-border/70 px-3 py-3 last:border-0"
          >
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="ml-auto h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        ))}
      </Card>
    </div>
  );
}

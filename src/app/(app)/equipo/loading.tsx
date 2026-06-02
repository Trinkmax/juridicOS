import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function LoadingEquipo() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>

      <div className="grid gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center"
          >
            <div className="flex flex-1 items-center gap-4">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-40 max-w-full" />
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-sm" />
              <Skeleton className="h-9 w-44 max-w-full rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingTareas() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, col) => (
          <div key={col} className="w-72 shrink-0 space-y-2.5 sm:w-80">
            <Skeleton className="mb-3 h-5 w-28" />
            {Array.from({ length: 3 - (col % 2) }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

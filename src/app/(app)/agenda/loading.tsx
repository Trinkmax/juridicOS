import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAgenda() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, g) => (
        <div key={g} className="space-y-3">
          <Skeleton className="h-5 w-48" />
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

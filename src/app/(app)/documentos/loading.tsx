import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[220px]" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
          >
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-6 w-10 rounded-full" />
            <Skeleton className="size-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAgenda() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-7 border-b border-border bg-muted/40">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="px-2 py-2">
                <Skeleton className="mx-auto h-3 w-8" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="min-h-[5.5rem] border-b border-r border-border p-1.5 sm:min-h-[7rem] [&:nth-child(7n)]:border-r-0"
              >
                <div className="mb-1 flex justify-end">
                  <Skeleton className="size-6 rounded-md" />
                </div>
                {i % 3 === 0 && <Skeleton className="h-4 w-full rounded-sm" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

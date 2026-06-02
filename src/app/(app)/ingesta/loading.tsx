import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingIngesta() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4 rounded-xl border border-border/70 p-5">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-[280px] rounded-lg" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4 rounded-xl border border-border/70 p-5">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingHonorarios() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-32" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-lg" />
    </div>
  );
}

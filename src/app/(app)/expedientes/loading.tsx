import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Skeleton className="h-10 w-44" />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[170px]" />
      </div>

      <Card className="p-0">
        <div className="space-y-px p-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-3 py-3">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="hidden h-4 w-24 md:block" />
              <Skeleton className="hidden h-5 w-28 rounded-full sm:block" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

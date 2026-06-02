import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPlazos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-40" />
        </div>
        <Skeleton className="h-9 w-44 rounded-md" />
      </div>
      {/* Tablero por urgencia (vista por defecto): secciones con encabezado. */}
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, s) => (
          <div key={s} className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-1 rounded-full" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-8 rounded-sm" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

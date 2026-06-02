"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

/** Búsqueda en vivo de clientes vía ?q= (debounced). */
export function ClientesSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [pending, startTransition] = useTransition();

  function push(q: string) {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/clientes?${qs}` : "/clientes");
    });
  }

  function onChange(next: string) {
    setValue(next);
    push(next);
  }

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o documento…"
        className="pl-9 pr-9"
        aria-label="Buscar clientes"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {pending ? (
          <Spinner className="size-4 text-muted-foreground" />
        ) : value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Limpiar búsqueda"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

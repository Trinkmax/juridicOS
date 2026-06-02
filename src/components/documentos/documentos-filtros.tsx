"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const TODOS = "__todos__";

type ExpedienteOpcion = { id: string; caratula: string };

/** Filtros de la lista de documentos: sincronizan la URL (?q=&expediente=). */
export function DocumentosFiltros({
  expedientes,
}: {
  expedientes: ExpedienteOpcion[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const expediente = searchParams.get("expediente") ?? "";

  const [texto, setTexto] = React.useState(q);
  React.useEffect(() => {
    setTexto(q);
  }, [q]);

  const aplicar = React.useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      router.replace(qs ? `/documentos?${qs}` : "/documentos", { scroll: false });
    },
    [router, searchParams],
  );

  React.useEffect(() => {
    const t = setTimeout(() => {
      if (texto !== q) aplicar({ q: texto || null });
    }, 350);
    return () => clearTimeout(t);
  }, [texto, q, aplicar]);

  const hayFiltros = Boolean(q || expediente);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
        <Input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar por nombre de documento…"
          className="pl-9"
          aria-label="Buscar documentos"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={expediente || TODOS}
          onValueChange={(v) => aplicar({ expediente: v === TODOS ? null : v })}
        >
          <SelectTrigger
            className="min-w-0 flex-1 sm:w-[220px] sm:flex-none"
            aria-label="Filtrar por expediente"
          >
            <SelectValue placeholder="Expediente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS}>Todos los expedientes</SelectItem>
            {expedientes.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.caratula}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hayFiltros && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setTexto("");
              router.replace("/documentos", { scroll: false });
            }}
            aria-label="Limpiar filtros"
            title="Limpiar filtros"
            className="shrink-0"
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}

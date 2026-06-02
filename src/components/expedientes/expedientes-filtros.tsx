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
import { FUEROS, ESTADOS_EXPEDIENTE } from "@/lib/constants";

const TODOS = "__todos__";

/** Filtros de la lista de expedientes: sincronizan la URL (?q=&fuero=&estado=). */
export function ExpedientesFiltros() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const fuero = searchParams.get("fuero") ?? "";
  const estado = searchParams.get("estado") ?? "";

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
      router.replace(qs ? `/expedientes?${qs}` : "/expedientes", { scroll: false });
    },
    [router, searchParams],
  );

  // Debounce de la búsqueda libre.
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (texto !== q) aplicar({ q: texto || null });
    }, 350);
    return () => clearTimeout(t);
  }, [texto, q, aplicar]);

  const hayFiltros = Boolean(q || fuero || estado);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
        <Input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar por carátula o número SAC…"
          className="pl-9"
          aria-label="Buscar expedientes"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={fuero || TODOS}
          onValueChange={(v) => aplicar({ fuero: v === TODOS ? null : v })}
        >
          <SelectTrigger className="w-[180px]" aria-label="Filtrar por fuero">
            <SelectValue placeholder="Fuero" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS}>Todos los fueros</SelectItem>
            {FUEROS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={estado || TODOS}
          onValueChange={(v) => aplicar({ estado: v === TODOS ? null : v })}
        >
          <SelectTrigger className="w-[170px]" aria-label="Filtrar por estado">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS}>Todos los estados</SelectItem>
            {ESTADOS_EXPEDIENTE.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
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
              router.replace("/expedientes", { scroll: false });
            }}
            aria-label="Limpiar filtros"
            title="Limpiar filtros"
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}

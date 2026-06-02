"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ESTADOS_PLAZO } from "@/lib/constants";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Responsable = { id: string; nombre: string };

const TODOS = "__todos__";

export function PlazosFiltros({
  responsables,
}: {
  responsables: Responsable[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const estado = searchParams.get("estado") ?? "pendiente";
  const responsable = searchParams.get("responsable") ?? TODOS;

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === TODOS) params.delete(key);
    else params.set(key, value);
    router.push(`/plazos?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={estado} onValueChange={(v) => setParam("estado", v)}>
        <SelectTrigger className="h-9 w-auto min-w-[9rem]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS}>Todos los estados</SelectItem>
          {ESTADOS_PLAZO.map((e) => (
            <SelectItem key={e.value} value={e.value}>
              {e.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {responsables.length > 0 && (
        <Select value={responsable} onValueChange={(v) => setParam("responsable", v)}>
          <SelectTrigger className="h-9 w-auto min-w-[10rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS}>Todo el equipo</SelectItem>
            {responsables.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  FileInput,
  Globe,
  Search,
} from "lucide-react";
import { eliminarPlantilla } from "@/lib/actions/plantillas";
import type { Plantilla } from "@/lib/types/domain";
import {
  CATEGORIAS_PLANTILLA,
  FUERO,
  type Fuero,
  type CategoriaPlantilla,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { PlantillaDialog } from "./plantilla-dialog";
import type { PlantillaItem } from "./tipos";

export function PlantillasLista({
  plantillas,
  onUsar,
}: {
  plantillas: PlantillaItem[];
  /** Carga el contenido de la plantilla en el editor. */
  onUsar: (p: PlantillaItem) => void;
}) {
  const router = useRouter();
  const [editar, setEditar] = useState<Plantilla | null>(null);
  const [aEliminar, setAEliminar] = useState<PlantillaItem | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [pending, startTransition] = useTransition();

  /** Filtro de texto + agrupación por categoría en el orden del vocabulario. */
  const grupos = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const visibles = q
      ? plantillas.filter((p) =>
          [p.nombre, p.descripcion ?? "", p.tipo ?? "", p.contenido]
            .join("\n")
            .toLowerCase()
            .includes(q),
        )
      : plantillas;

    const porCategoria = new Map<CategoriaPlantilla, PlantillaItem[]>();
    for (const p of visibles) {
      const cat = (p.categoria ?? "otro") as CategoriaPlantilla;
      const lista = porCategoria.get(cat) ?? [];
      lista.push(p);
      porCategoria.set(cat, lista);
    }
    return CATEGORIAS_PLANTILLA.filter((c) => porCategoria.has(c.value)).map((c) => ({
      categoria: c,
      items: porCategoria.get(c.value)!,
    }));
  }, [plantillas, busqueda]);

  const total = grupos.reduce((acc, g) => acc + g.items.length, 0);

  function confirmarEliminar() {
    if (!aEliminar) return;
    const id = aEliminar.id;
    startTransition(async () => {
      const res = await eliminarPlantilla(id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Plantilla eliminada");
      setAEliminar(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Modelos con estructura forense de Córdoba. Tocá uno para cargarlo en el
          editor.
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar plantilla…"
              className="h-9 w-full pl-8 sm:w-56"
              aria-label="Buscar plantilla"
            />
          </div>
          <PlantillaDialog
            trigger={
              <Button size="sm" className="shrink-0">
                <Plus className="size-4" />
                Nueva plantilla
              </Button>
            }
          />
        </div>
      </div>

      {total === 0 ? (
        busqueda ? (
          <EmptyState
            icon={Search}
            title="Sin resultados"
            description={`Ninguna plantilla coincide con “${busqueda}”.`}
          />
        ) : (
          <EmptyState
            icon={FileText}
            title="Todavía no hay plantillas"
            description="Creá tu primer modelo de escrito para reutilizarlo en cada causa."
            action={
              <PlantillaDialog
                trigger={
                  <Button size="sm">
                    <Plus className="size-4" />
                    Nueva plantilla
                  </Button>
                }
              />
            }
          />
        )
      ) : (
        <div className="space-y-8">
          {grupos.map((g) => (
            <section key={g.categoria.value} className="space-y-4">
              <div className="flex items-baseline gap-2">
                <h3 className="font-display text-base font-semibold">
                  {g.categoria.label}
                </h3>
                <span className="text-data text-xs text-muted-foreground">
                  {g.items.length}
                </span>
                {g.categoria.hint && (
                  <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                    · {g.categoria.hint}
                  </span>
                )}
              </div>

              <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {g.items.map((p) => (
                  <StaggerItem key={p.id}>
                    <Card className="group flex h-full flex-col gap-3.5 p-5 shadow-xs transition-colors hover:border-foreground/20 hover:bg-accent/60">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onUsar(p)}
                          className="flex-1 text-left"
                        >
                          <h4 className="line-clamp-2 text-sm font-semibold leading-tight group-hover:text-primary">
                            {p.nombre}
                          </h4>
                        </button>
                        {p.esGlobal ? (
                          <Badge tone="muted">
                            <Globe className="size-3" />
                            Global
                          </Badge>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm" aria-label="Acciones">
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => onUsar(p)}>
                                <FileInput className="size-4" />
                                Usar en el editor
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setEditar(p)}>
                                <Pencil className="size-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:bg-destructive-soft focus:text-destructive [&_svg]:text-destructive"
                                onSelect={() => setAEliminar(p)}
                              >
                                <Trash2 className="size-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onUsar(p)}
                        className="flex-1 text-left"
                      >
                        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                          {p.descripcion ||
                            p.contenido.slice(0, 220) ||
                            "Plantilla sin contenido."}
                        </p>
                      </button>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {p.fuero && (
                          <Badge tone={FUERO[p.fuero as Fuero]?.tone ?? "default"}>
                            {FUERO[p.fuero as Fuero]?.label ?? p.fuero}
                          </Badge>
                        )}
                        {p.variables && p.variables.length > 0 && (
                          <Badge tone="primary">
                            <span className="text-data">{p.variables.length}</span>{" "}
                            {p.variables.length === 1 ? "variable" : "variables"}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          ))}
        </div>
      )}

      {/* Editor de plantilla del estudio */}
      <PlantillaDialog
        key={editar?.id ?? "nuevo"}
        plantilla={editar ?? undefined}
        open={editar !== null}
        onOpenChange={(v) => !v && setEditar(null)}
      />

      {/* Confirmación de borrado */}
      <Dialog open={aEliminar !== null} onOpenChange={(v) => !v && setAEliminar(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar plantilla</DialogTitle>
            <DialogDescription>
              ¿Seguro que querés eliminar “{aEliminar?.nombre}”? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={pending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmarEliminar}
              disabled={pending}
            >
              {pending ? <Spinner /> : <Trash2 className="size-4" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

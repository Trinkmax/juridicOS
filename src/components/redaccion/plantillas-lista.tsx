"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FileText, Plus, MoreVertical, Pencil, Trash2, FileInput, Globe } from "lucide-react";
import { eliminarPlantilla } from "@/lib/actions/plantillas";
import type { Plantilla } from "@/lib/types/domain";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  const [pending, startTransition] = useTransition();

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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Modelos reutilizables. Tocá una para cargarla en el editor.
        </p>
        <PlantillaDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" />
              Nueva plantilla
            </Button>
          }
        />
      </div>

      {plantillas.length === 0 ? (
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
      ) : (
        <Stagger className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {plantillas.map((p) => (
            <StaggerItem key={p.id}>
              <Card className="group flex h-full flex-col gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onUsar(p)}
                    className="flex-1 text-left"
                  >
                    <h3 className="line-clamp-1 text-sm font-semibold leading-tight group-hover:text-primary">
                      {p.nombre}
                    </h3>
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
                  <p className="line-clamp-3 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                    {p.contenido.slice(0, 220) || "Plantilla sin contenido."}
                  </p>
                </button>

                <div className="flex flex-wrap items-center gap-1.5">
                  {p.tipo && <Badge tone="info">{p.tipo}</Badge>}
                  {p.variables && p.variables.length > 0 && (
                    <Badge tone="primary">
                      {p.variables.length} {p.variables.length === 1 ? "variable" : "variables"}
                    </Badge>
                  )}
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
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

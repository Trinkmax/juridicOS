"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Archive, Loader2 } from "lucide-react";
import { archivarExpediente } from "@/lib/actions/expedientes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

/** Menú de acciones del detalle de expediente (archivar con confirmación). */
export function ExpedienteAcciones({
  id,
  archivado,
}: {
  id: string;
  archivado: boolean;
}) {
  const router = useRouter();
  const [confirmar, setConfirmar] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function onArchivar() {
    startTransition(async () => {
      const res = await archivarExpediente(id);
      if (res.ok) {
        toast.success("Expediente archivado.");
        setConfirmar(false);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Más acciones">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={archivado}
            onSelect={(e) => {
              e.preventDefault();
              setConfirmar(true);
            }}
          >
            <Archive />
            {archivado ? "Ya archivado" : "Archivar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmar} onOpenChange={setConfirmar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Archivar expediente</DialogTitle>
            <DialogDescription>
              El expediente pasará a estado “Archivado” y se ocultará de la lista activa.
              Vas a poder seguir consultándolo. ¿Querés continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={pending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={onArchivar} disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <Archive />}
              Archivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

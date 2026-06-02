"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AudienciaForm } from "@/components/agenda/audiencia-form";

type ExpedienteLite = { id: string; caratula: string };

export function NuevaAudienciaDialog({
  expedientes,
  abrirAlInicio,
  expedientePreseleccionado,
}: {
  expedientes: ExpedienteLite[];
  abrirAlInicio?: boolean;
  expedientePreseleccionado?: string;
}) {
  const [open, setOpen] = React.useState(Boolean(abrirAlInicio));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Nueva audiencia
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Nueva audiencia</DialogTitle>
          <DialogDescription>
            Programá una audiencia y asociala a un expediente.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="-mx-1 max-h-[65vh] px-1">
          <AudienciaForm
            expedientes={expedientes}
            expedientePreseleccionado={expedientePreseleccionado}
            onSuccess={() => setOpen(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

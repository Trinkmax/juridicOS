"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { Cliente } from "@/lib/types/domain";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ClienteForm } from "./cliente-form";

export function EditarClienteDialog({ cliente }: { cliente: Cliente }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="size-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
          <DialogDescription>
            Actualizá los datos de contacto y domicilios del cliente.
          </DialogDescription>
        </DialogHeader>
        <ClienteForm
          cliente={cliente}
          onSuccess={() => setOpen(false)}
          cancel={
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
          }
        />
      </DialogContent>
    </Dialog>
  );
}

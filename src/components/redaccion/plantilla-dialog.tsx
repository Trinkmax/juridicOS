"use client";

import { useState } from "react";
import type { Plantilla } from "@/lib/types/domain";
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
import { PlantillaForm } from "./plantilla-form";

export function PlantillaDialog({
  plantilla,
  trigger,
  open: openProp,
  onOpenChange,
}: {
  /** Si viene, el diálogo edita; si no, crea. */
  plantilla?: Plantilla;
  /** Trigger propio (botón). Omitir si se controla `open` desde afuera. */
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
}) {
  const [openInner, setOpenInner] = useState(false);
  const controlado = openProp !== undefined;
  const open = controlado ? openProp : openInner;
  const setOpen = controlado ? (onOpenChange ?? (() => {})) : setOpenInner;
  const modo = plantilla ? "editar" : "crear";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {modo === "crear" ? "Nueva plantilla" : "Editar plantilla"}
          </DialogTitle>
          <DialogDescription>
            Guardá modelos reutilizables. Las variables {"{{...}}"} se completan luego
            con los datos del expediente.
          </DialogDescription>
        </DialogHeader>
        <PlantillaForm
          plantilla={plantilla}
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

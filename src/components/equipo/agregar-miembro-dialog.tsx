"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, Loader2, Mail, UserRoundPlus } from "lucide-react";
import { agregarMiembro } from "@/lib/actions/equipo";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ROLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/lib/actions/_base";

type Modo = "nuevo" | "existente";

// El owner no se invita a sí mismo; al socio se asciende luego con "Cambiar rol".
const ROLES_INVITABLES = ROLES.filter((r) => r.value !== "owner");

function Enviar({ modo }: { modo: Modo }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <UserPlus />}
      {modo === "nuevo" ? "Crear y agregar" : "Agregar al estudio"}
    </Button>
  );
}

function ModoBtn({
  activo,
  onClick,
  icon: Icon,
  label,
}: {
  activo: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        activo
          ? "bg-card text-foreground shadow-xs"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

export function AgregarMiembroDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [modo, setModo] = React.useState<Modo>("nuevo");
  const [rol, setRol] = React.useState("abogado");
  const [state, action] = useActionState<ActionResult | null, FormData>(
    agregarMiembro,
    null,
  );

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(state.message ?? "Miembro agregado.");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  const fieldError = (campo: string) =>
    state && !state.ok ? state.fieldErrors?.[campo] : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="size-4" />
          Invitar miembro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar al equipo</DialogTitle>
          <DialogDescription>
            Sumá a alguien al estudio: creale la cuenta o agregá a quien ya tiene una.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
          <ModoBtn
            activo={modo === "nuevo"}
            onClick={() => setModo("nuevo")}
            icon={UserRoundPlus}
            label="Crear usuario nuevo"
          />
          <ModoBtn
            activo={modo === "existente"}
            onClick={() => setModo("existente")}
            icon={Mail}
            label="Ya tiene cuenta"
          />
        </div>

        <form action={action} className="space-y-4">
          <input type="hidden" name="modo" value={modo} />
          <FormError>{state && !state.ok ? state.error : undefined}</FormError>

          {modo === "nuevo" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre" htmlFor="m-nombre" required error={fieldError("nombre")}>
                <Input id="m-nombre" name="nombre" autoComplete="off" />
              </Field>
              <Field
                label="Apellido"
                htmlFor="m-apellido"
                required
                error={fieldError("apellido")}
              >
                <Input id="m-apellido" name="apellido" autoComplete="off" />
              </Field>
            </div>
          )}

          <Field
            label="Email"
            htmlFor="m-email"
            required
            error={fieldError("email")}
            hint={
              modo === "existente"
                ? "La persona ya debe tener una cuenta en juridicOS."
                : undefined
            }
          >
            <Input
              id="m-email"
              name="email"
              type="email"
              autoComplete="off"
              placeholder="persona@estudio.com"
            />
          </Field>

          {modo === "nuevo" && (
            <Field
              label="Contraseña inicial"
              htmlFor="m-password"
              required
              error={fieldError("password")}
              hint="Mínimo 8 caracteres. Compartísela con la persona para que ingrese."
            >
              <Input
                id="m-password"
                name="password"
                type="text"
                autoComplete="off"
                placeholder="Contraseña inicial"
                className="font-mono"
              />
            </Field>
          )}

          <Field label="Rol en el estudio" htmlFor="m-rol" error={fieldError("rol")}>
            <input type="hidden" name="rol" value={rol} />
            <Select value={rol} onValueChange={setRol}>
              <SelectTrigger id="m-rol">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES_INVITABLES.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {modo === "nuevo" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Matrícula" htmlFor="m-matricula" error={fieldError("matricula")}>
                <Input id="m-matricula" name="matricula" placeholder="Opcional" />
              </Field>
              <Field label="Título" htmlFor="m-titulo" error={fieldError("titulo")}>
                <Input id="m-titulo" name="titulo" placeholder="Ej.: Abogado/a" />
              </Field>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Enviar modo={modo} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

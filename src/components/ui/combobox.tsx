"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ComboboxOption = {
  value: string;
  label: string;
  /** Encabezado de grupo (opcional). Las opciones con el mismo `group` se agrupan. */
  group?: string;
  /** Texto secundario, también indexado para la búsqueda. */
  hint?: string;
};

/** Normaliza para una búsqueda sin acentos y sin distinción de mayúsculas (es-AR). */
function normalizar(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * Select con búsqueda. Combina Popover + cmdk. Para listas largas (localidades,
 * catálogos) donde el <Select> plano no alcanza. Integrable en forms vía `name`
 * (renderiza un input oculto con el valor actual).
 */
export function Combobox({
  options,
  value,
  onValueChange,
  name,
  id,
  placeholder = "Seleccioná una opción",
  searchPlaceholder = "Buscar…",
  emptyText = "Sin resultados.",
  clearable = true,
  disabled,
  className,
  contentClassName,
}: {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  id?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = React.useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  // Agrupa preservando el orden de aparición.
  const grupos = React.useMemo(() => {
    const map = new Map<string, ComboboxOption[]>();
    for (const o of options) {
      const g = o.group ?? "";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(o);
    }
    return Array.from(map.entries());
  }, [options]);

  function elegir(v: string) {
    onValueChange?.(v);
    setOpen(false);
  }

  return (
    <>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs transition-colors",
              "focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/25",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
          >
            <span className={cn("min-w-0 flex-1 truncate text-left", !selected && "text-muted-foreground/70")}>
              {selected ? selected.label : placeholder}
            </span>
            {clearable && selected ? (
              <span
                role="button"
                aria-label="Limpiar"
                className="grid size-4 shrink-0 place-items-center rounded-sm opacity-60 transition-opacity hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  elegir("");
                }}
              >
                <X className="size-4" />
              </span>
            ) : (
              <ChevronsUpDown className="size-4 shrink-0 opacity-60" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className={cn(
            "w-[var(--radix-popover-trigger-width)] overflow-hidden p-0",
            contentClassName,
          )}
        >
          <Command
            filter={(val, search) => (normalizar(val).includes(normalizar(search)) ? 1 : 0)}
            className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            <div className="border-b border-border px-3">
              <Command.Input
                placeholder={searchPlaceholder}
                className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </div>
            <Command.List className="max-h-64 overflow-y-auto overscroll-contain p-1.5">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </Command.Empty>
              {grupos.map(([g, items], gi) => (
                <Command.Group key={gi} heading={g || undefined}>
                  {items.map((o) => (
                    <Command.Item
                      key={o.value}
                      value={`${o.label} ${o.group ?? ""} ${o.hint ?? ""}`}
                      onSelect={() => elegir(o.value)}
                      className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                    >
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate">{o.label}</span>
                        {o.hint ? (
                          <span className="truncate text-xs text-muted-foreground">{o.hint}</span>
                        ) : null}
                      </span>
                      {value === o.value ? (
                        <Check className="size-4 shrink-0 text-primary" />
                      ) : null}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

import { createClient } from "@/lib/supabase/server";
import type { ComboboxOption } from "@/components/ui/combobox";

/**
 * Localidades con sede judicial en Córdoba, listas para el <Combobox>.
 * Agrupadas por circunscripción; la cabecera aparece primero en cada grupo.
 */
export async function getLocalidadesOptions(): Promise<ComboboxOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("localidades")
    .select("nombre, circunscripcion, cabecera, es_cabecera")
    .eq("activo", true)
    .order("circunscripcion", { ascending: true })
    .order("es_cabecera", { ascending: false })
    .order("nombre", { ascending: true });

  return (data ?? []).map((l) => ({
    value: l.nombre,
    label: l.nombre,
    group: `${l.circunscripcion}ª Circunscripción · ${l.cabecera}`,
    hint: l.es_cabecera ? "Cabecera de circunscripción" : undefined,
  }));
}

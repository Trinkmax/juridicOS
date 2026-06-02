/**
 * juridicOS · Paleta y helpers compartidos por los gráficos de Reportes.
 * Rediseño "Tinta": los charts se leen MONOCROMOS (escala de grises) con el
 * azul `primary` como ÚNICO acento; el rojo `destructive` queda reservado para
 * datos de riesgo (p.ej. plazos vencidos). Los valores espejan los tokens del
 * tema (oklch en `globals.css`) para integrarse con la UI en claro y oscuro.
 */

export const CHART_COLORS = {
  /** Acento principal — usar con moderación (serie destacada, foco). */
  primary: "oklch(0.455 0.155 260)",
  /** Estado OK / cumplido — gris medio (monocromo). */
  success: "oklch(0.520 0.012 260)",
  /** Próximo / en proceso — gris claro (monocromo). */
  warning: "oklch(0.670 0.010 260)",
  /** Riesgo — ÚNICO color cálido permitido (plazos vencidos). */
  destructive: "oklch(0.555 0.215 26)",
  /** Neutro / "otros" — gris tenue. */
  info: "oklch(0.620 0.012 260)",
  /** Vacío / sin dato — gris muy tenue. */
  muted: "oklch(0.760 0.008 260)",
} as const;

export type ChartColorKey = keyof typeof CHART_COLORS;

/**
 * Paleta secuencial para gráficos categóricos (fueros, etc.).
 * Rampa de grises con el azul `primary` como acento en la primera posición:
 * la categoría dominante destaca, el resto queda monocromo.
 */
export const CHART_SEQUENCE: string[] = [
  "oklch(0.455 0.155 260)", // primary (acento)
  "oklch(0.420 0.010 260)", // gris oscuro
  "oklch(0.520 0.012 260)", // gris medio
  "oklch(0.620 0.012 260)", // gris
  "oklch(0.700 0.010 260)", // gris claro
  "oklch(0.780 0.008 260)", // gris muy claro
  "oklch(0.500 0.020 260)", // gris azulado
  "oklch(0.840 0.006 260)", // gris tenue
];

/** Color de un slice por índice (rota la secuencia). */
export function colorAt(i: number): string {
  return CHART_SEQUENCE[i % CHART_SEQUENCE.length]!;
}

/** Estilos comunes para tooltips de recharts, alineados al tema (modo claro/oscuro vía CSS vars). */
export const TOOLTIP_STYLE = {
  background: "var(--popover, oklch(1 0 0))",
  border: "1px solid var(--border, oklch(0.905 0.004 258))",
  borderRadius: "0.375rem",
  boxShadow: "0 2px 8px -3px oklch(0 0 0 / 0.10)",
  padding: "0.5rem 0.75rem",
  fontSize: "0.8125rem",
  color: "var(--popover-foreground, oklch(0.215 0.012 260))",
} as const;

export const TOOLTIP_LABEL_STYLE = {
  color: "var(--popover-foreground, oklch(0.215 0.012 260))",
  fontWeight: 600,
  marginBottom: "0.125rem",
} as const;

export const TOOLTIP_ITEM_STYLE = {
  color: "var(--muted-foreground, oklch(0.520 0.012 260))",
} as const;

export const AXIS_STYLE = {
  fontSize: 12,
  fill: "var(--muted-foreground, oklch(0.520 0.012 260))",
} as const;

export const GRID_STROKE = "var(--border, oklch(0.905 0.004 258))";

/** Relleno del cursor de tooltip en gráficos de barras (gris-tinta tenue). */
export const CURSOR_FILL = "var(--accent, oklch(0.948 0.004 258))";

/** Estilo de las etiquetas numéricas sobre las barras. */
export const LABEL_STYLE = {
  fontSize: 12,
  fontWeight: 600,
  fill: "var(--foreground, oklch(0.215 0.012 260))",
} as const;

/** Estilo de los ítems de leyenda (mismo gris que los ejes). */
export const LEGEND_ITEM_STYLE = {
  color: "var(--muted-foreground, oklch(0.520 0.012 260))",
  fontSize: 12,
} as const;

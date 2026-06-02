/**
 * juridicOS · Paleta y helpers compartidos por los gráficos de Reportes.
 * Los colores espejan el tema (oklch) para que los charts se integren con la UI.
 */

export const CHART_COLORS = {
  primary: "oklch(0.548 0.225 282)",
  success: "oklch(0.62 0.16 155)",
  warning: "oklch(0.78 0.16 75)",
  destructive: "oklch(0.585 0.225 24)",
  info: "oklch(0.62 0.16 245)",
  muted: "oklch(0.62 0.02 282)",
} as const;

export type ChartColorKey = keyof typeof CHART_COLORS;

/** Paleta secuencial para gráficos categóricos (fueros, etc.). */
export const CHART_SEQUENCE: string[] = [
  "oklch(0.548 0.225 282)", // primary
  "oklch(0.62 0.16 245)", // info
  "oklch(0.62 0.16 155)", // success
  "oklch(0.78 0.16 75)", // warning
  "oklch(0.585 0.225 24)", // destructive
  "oklch(0.66 0.18 200)", // teal
  "oklch(0.64 0.2 330)", // magenta
  "oklch(0.62 0.02 282)", // muted
];

/** Color de un slice por índice (rota la secuencia). */
export function colorAt(i: number): string {
  return CHART_SEQUENCE[i % CHART_SEQUENCE.length]!;
}

/** Estilos comunes para tooltips de recharts, alineados al tema (modo claro/oscuro vía CSS vars). */
export const TOOLTIP_STYLE = {
  background: "var(--popover, oklch(1 0 0))",
  border: "1px solid var(--border, oklch(0.92 0.004 286))",
  borderRadius: "0.75rem",
  boxShadow: "0 4px 16px -4px oklch(0 0 0 / 0.12)",
  padding: "0.5rem 0.75rem",
  fontSize: "0.8125rem",
  color: "var(--popover-foreground, oklch(0.21 0.006 286))",
} as const;

export const TOOLTIP_LABEL_STYLE = {
  color: "var(--popover-foreground, oklch(0.21 0.006 286))",
  fontWeight: 600,
  marginBottom: "0.125rem",
} as const;

export const TOOLTIP_ITEM_STYLE = {
  color: "var(--muted-foreground, oklch(0.55 0.014 286))",
} as const;

export const AXIS_STYLE = {
  fontSize: 12,
  fill: "var(--muted-foreground, oklch(0.55 0.014 286))",
} as const;

export const GRID_STROKE = "var(--border, oklch(0.92 0.004 286))";

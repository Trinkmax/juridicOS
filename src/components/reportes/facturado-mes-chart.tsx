"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney } from "@/lib/utils";
import {
  AXIS_STYLE,
  CHART_COLORS,
  CURSOR_FILL,
  GRID_STROKE,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from "./chart-theme";

export type FacturadoMesDatum = { label: string; value: number };

/** Compacta montos del eje Y: 1.2M / 850k / 320. */
function compacto(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}k`;
  return `${v}`;
}

export function FacturadoMesChart({ data }: { data: FacturadoMesDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 16, right: 12, left: 4, bottom: 4 }} barCategoryGap="32%">
        <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={AXIS_STYLE}
          interval={0}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={AXIS_STYLE}
          width={48}
          tickFormatter={compacto}
        />
        <Tooltip
          cursor={{ fill: CURSOR_FILL, opacity: 0.5 }}
          contentStyle={TOOLTIP_STYLE}
          labelStyle={TOOLTIP_LABEL_STYLE}
          itemStyle={TOOLTIP_ITEM_STYLE}
          formatter={
            ((value: number | string | (number | string)[]) => [
              formatMoney(Number(value)),
              "Facturado",
            ]) as never
          }
        />
        <Bar
          dataKey="value"
          radius={[2, 2, 0, 0]}
          maxBarSize={48}
          fill={CHART_COLORS.primary}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

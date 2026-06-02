"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AXIS_STYLE,
  colorAt,
  GRID_STROKE,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from "./chart-theme";

export type FueroDatum = { label: string; value: number };

export function CausasFueroChart({ data }: { data: FueroDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 16, right: 12, left: -16, bottom: 4 }}
        barCategoryGap="28%"
      >
        <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={AXIS_STYLE}
          interval={0}
          height={48}
          tickFormatter={(v: string) => (v.length > 14 ? `${v.slice(0, 13)}…` : v)}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={AXIS_STYLE}
          width={36}
        />
        <Tooltip
          cursor={{ fill: "var(--accent, oklch(0.96 0.004 286))", opacity: 0.5 }}
          contentStyle={TOOLTIP_STYLE}
          labelStyle={TOOLTIP_LABEL_STYLE}
          itemStyle={TOOLTIP_ITEM_STYLE}
          formatter={(value: number) => [`${value} causa${value === 1 ? "" : "s"}`, "Activas"]}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
          {data.map((_, i) => (
            <Cell key={i} fill={colorAt(i)} />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            style={{ fontSize: 12, fontWeight: 600, fill: "var(--foreground, oklch(0.21 0.006 286))" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

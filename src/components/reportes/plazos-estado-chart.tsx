"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from "./chart-theme";

export type PlazoEstadoDatum = { label: string; value: number; color: string };

export function PlazosEstadoChart({ data }: { data: PlazoEstadoDatum[] }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={62}
          outerRadius={96}
          paddingAngle={2}
          strokeWidth={2}
          stroke="var(--card, oklch(1 0 0))"
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={TOOLTIP_LABEL_STYLE}
          itemStyle={TOOLTIP_ITEM_STYLE}
          formatter={(value: number, name: string) => {
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return [`${value} (${pct}%)`, name];
          }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={9}
          formatter={(value: string) => (
            <span style={{ color: "var(--muted-foreground, oklch(0.55 0.014 286))", fontSize: 12 }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

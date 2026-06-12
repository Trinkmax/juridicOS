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
  LEGEND_ITEM_STYLE,
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
          formatter={
            ((value: number | string | (number | string)[], name: number | string) => {
              const v = Number(value);
              const pct = total > 0 ? Math.round((v / total) * 100) : 0;
              return [`${v} (${pct}%)`, name];
            }) as never
          }
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={9}
          wrapperStyle={{ paddingTop: 12 }}
          formatter={(value: string) => (
            <span style={LEGEND_ITEM_STYLE}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

"use client";

import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { ChartCard } from "@/components/dashboard/cards/ChartCard";
import { useTrends } from "@/lib/metrics";
import { getTenant } from "@/lib/auth-client";

const PLATFORM_COLORS: Record<string, string> = {
  ios: "#F59E0B",
  windows: "#6366F1",
  android: "#22C55E",
  macos: "#EC4899",
  linux: "#06B6D4",
  unknown: "#9CA3AF",
};

export function PlatformStackedBars({ days = 30 }: { days?: number }) {
  const tenant = getTenant();
  const tenantId = tenant?.tenant_id as number | undefined;
  const { data, isLoading, error } = useTrends(tenantId, days);

  const keys = new Set<string>();
  const chartData = (data?.daily_trends || []).map(d => {
    const pd = d.platform_distribution || {};
    Object.keys(pd).forEach(k => keys.add(k));
    return { date: d.date, ...pd } as any;
  });

  const platformKeys = Array.from(keys);

  return (
    <ChartCard title="Platforms Over Time" subtitle={`Last ${days} days`} loading={isLoading} error={error ? (error as any).message : undefined}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB' }} formatter={(v: any, name: string) => [v, name]} />
            <Legend />
            {platformKeys.map((k) => (
              <Bar key={k} dataKey={k} stackId="a" fill={PLATFORM_COLORS[k] || PLATFORM_COLORS.unknown} isAnimationActive animationDuration={600} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

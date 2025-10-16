"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartCard } from "@/components/dashboard/cards/ChartCard";
import { useTrends } from "@/lib/metrics";
import { getTenant } from "@/lib/auth-client";

export function OpenRateTrend({ days = 30, data: prefetched }: { days?: number; data?: Array<{ date: string; rate: number }> }) {
  const tenant = getTenant();
  const tenantId = tenant?.tenant_id as number | undefined;
  const { data, isLoading, error } = prefetched ? { data: undefined, isLoading: false, error: undefined } as any : useTrends(tenantId, days);

  const chartData = prefetched || (data?.daily_trends || []).map((d: any) => ({
    date: d.date,
    rate: d.open_rate,
  }));

  return (
  <ChartCard title="Open Rate Trend" subtitle={`Last ${days} days`} loading={isLoading} error={error ? (error as any).message : undefined}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB' }} formatter={(v: any) => [`${v}%`, 'Open Rate']} />
            <Line type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} isAnimationActive animationDuration={600} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

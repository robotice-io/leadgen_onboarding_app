"use client";

import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { ChartCard } from "@/components/dashboard/cards/ChartCard";
import { useTimingAnalysis } from "@/lib/metrics";
import { getTenant } from "@/lib/auth-client";

export function TimingBreakdown({ days = 30, distribution: prefetched }: { days?: number; distribution?: { immediate?: number; fast?: number; moderate?: number; delayed?: number } }) {
  const tenant = getTenant();
  const tenantId = tenant?.tenant_id as number | undefined;
  const { data, isLoading, error } = prefetched ? { data: undefined, isLoading: false, error: undefined } as any : useTimingAnalysis(tenantId, days);

  const distribution = prefetched || data?.time_distribution || { immediate: 0, fast: 0, moderate: 0, delayed: 0 };
  const chartData = [
    { name: "Immediate", value: distribution.immediate },
    { name: "Fast", value: distribution.fast },
    { name: "Moderate", value: distribution.moderate },
    { name: "Delayed", value: distribution.delayed },
  ];

  return (
    <ChartCard title="Response Time Distribution" subtitle={`Last ${days} days`} loading={isLoading} error={error ? (error as any).message : undefined}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB' }} formatter={(v: any) => [v, 'Opens']} />
            <Bar dataKey="value" name="Opens" fill="#F59E0B" radius={[4,4,0,0]} isAnimationActive animationDuration={600} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

"use client";

import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line } from "recharts";
import { ChartCard } from "@/components/dashboard/cards/ChartCard";
import { useDeliverability } from "@/lib/metrics";
import { getTenant } from "@/lib/auth-client";

export function DeliverabilityProviders({ days = 30, providers }: { days?: number; providers?: Array<{ provider: string; opens_count: number; open_rate: number }> }) {
  const tenant = getTenant();
  const tenantId = tenant?.tenant_id as number | undefined;
  const { data, isLoading, error } = providers ? { data: undefined, isLoading: false, error: undefined } as any : useDeliverability(tenantId, days);

  const rows = (providers || data?.provider_performance || []).map((p: any) => ({
    provider: p.provider,
    opens: p.opens_count,
    openRate: p.open_rate,
  }));

  return (
    <ChartCard title="Deliverability by Provider" subtitle={`Last ${days} days`} loading={isLoading} error={error ? (error as any).message : undefined}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <ComposedChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="provider" stroke="#6B7280" fontSize={12} />
            <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB' }} />
            <Legend />
            <Bar yAxisId="left" dataKey="opens" name="Opens" fill="#3B82F6" radius={[4,4,0,0]} isAnimationActive animationDuration={600} />
            <Line yAxisId="right" type="monotone" dataKey="openRate" name="Open Rate" stroke="#10B981" strokeWidth={3} dot={{ r: 3 }} isAnimationActive animationDuration={600} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

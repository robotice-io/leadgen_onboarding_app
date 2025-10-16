"use client";

import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { ChartCard } from "@/components/dashboard/cards/ChartCard";
import { useTrends, useCampaignOverview } from "@/lib/metrics";
import { getTenant } from "@/lib/auth-client";

// As trends returns opens_count, we can pair with total_emails_sent normalized per day when available later.
// For now, show opens_count as bars and overlay open_rate as context (secondary axis) in future.

export function SentOpenedBars({ days = 30 }: { days?: number }) {
  const tenant = getTenant();
  const tenantId = tenant?.tenant_id as number | undefined;
  const { data, isLoading, error } = useTrends(tenantId, days);

  const chartData = (data?.daily_trends || []).map(d => ({
    date: d.date,
    opens: d.opens_count,
  }));

  return (
    <ChartCard title="Total Opened (Daily)" subtitle={`Last ${days} days`} loading={isLoading} error={error ? (error as any).message : undefined}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB' }} />
            <Legend />
            <Bar dataKey="opens" name="Opens" fill="#10B981" radius={[4,4,0,0]} isAnimationActive animationDuration={600} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

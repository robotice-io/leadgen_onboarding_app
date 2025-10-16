"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ChartCard } from "@/components/dashboard/cards/ChartCard";
import { usePlatformIntelligence } from "@/lib/metrics";
import { getTenant } from "@/lib/auth-client";

const COLORS = {
  desktop: "#3B82F6",
  mobile: "#10B981",
  unknown: "#6B7280",
};

export function DeviceTypeDonut({ days = 30 }: { days?: number }) {
  const tenant = getTenant();
  const tenantId = tenant?.tenant_id as number | undefined;
  const { data, isLoading, error } = usePlatformIntelligence(tenantId, days);

  const dist = data?.device_type_distribution || {};
  const entries = Object.entries(dist).map(([name, value]) => ({ name, value }));

  return (
    <ChartCard title="Device Types" subtitle={`Last ${days} days`} loading={isLoading} error={error ? (error as any).message : undefined}>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={entries} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={5} isAnimationActive animationDuration={600}>
              {entries.map((e, i) => (
                <Cell key={i} fill={(COLORS as any)[e.name] || COLORS.unknown} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB' }} formatter={(v: any) => [v, 'Count']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        {entries.map((e) => (
          <div key={e.name} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: (COLORS as any)[e.name] || COLORS.unknown }} />
            {e.name} ({e.value})
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

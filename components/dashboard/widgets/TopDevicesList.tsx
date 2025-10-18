"use client";

import { ListCard } from "@/components/dashboard/cards/ListCard";
import { usePlatformIntelligence } from "@/lib/metrics";
import { getTenant } from "@/lib/auth-client";

export function TopDevicesList({ days = 30, distribution }: { days?: number; distribution?: Record<string, number> }) {
  const tenant = getTenant();
  const tenantId = tenant?.tenant_id as number | undefined;
  const { data, isLoading } = distribution ? { data: undefined, isLoading: false } as any : usePlatformIntelligence(tenantId, days);

  const items = Object.entries((distribution || data?.device_type_distribution || {}) as Record<string, number>)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const total = items.reduce((s, i) => s + i.count, 0) || 1;

  return (
    <ListCard title="Top Device Opens" subtitle={`Last ${days} days`} loading={isLoading} empty={items.length === 0}>
      {items.map((item, idx) => {
        const pct = Math.round((item.count / total) * 100);
        return (
          <div key={item.name} className="flex items-center gap-3">
            <span className="w-6 text-xs text-gray-500 dark:text-gray-400">{String(idx + 1).padStart(2, '0')}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-900 dark:text-white capitalize">{item.name}</span>
                <span className="text-gray-500 dark:text-gray-400">{pct}%</span>
              </div>
              <div className="mt-1 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded">
                <div className="h-2 rounded bg-blue-600 dark:bg-blue-400" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </ListCard>
  );
}

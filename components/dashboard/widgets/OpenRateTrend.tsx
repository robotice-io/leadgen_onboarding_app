"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartCard } from "@/components/dashboard/cards/ChartCard";
import { useTrends } from "@/lib/metrics";
import { getTenant } from "@/lib/auth-client";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";

export function OpenRateTrend({ days = 30, data: prefetched, maxPoints = 20 }: { days?: number; data?: Array<{ date: string; rate: number }>; maxPoints?: number }) {
  const tenant = getTenant();
  const tenantId = tenant?.tenant_id as number | undefined;
  const { data, isLoading, error } = prefetched ? { data: undefined, isLoading: false, error: undefined } as any : useTrends(tenantId, days);
  const { lang } = useI18n();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const rawData = prefetched || (data?.daily_trends || []).map((d: any) => ({ date: d.date, rate: d.open_rate }));
  const chartData = useMemo(() => rawData.slice(-Math.max(1, Math.min(maxPoints ?? 20, 60))), [rawData, maxPoints]);
  const WD_MAP: Record<string, string[]> = { es: ['do','lu','ma','mi','ju','vi','sa'], en: ['su','mo','tu','we','th','fr','sa'] };
  const WD = WD_MAP[lang] || WD_MAP['es'];
  const fmtTick = (d: string) => {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    const dd = String(dt.getDate()).padStart(2, '0');
    if (isMobile) return dd;
    const abbr = WD[dt.getDay()] || '';
    return `${abbr} ${dd}`;
  };

  return (
  <ChartCard title="Open Rate Trend" subtitle={`Last ${days} days`} loading={isLoading} error={error ? (error as any).message : undefined}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickFormatter={fmtTick} />
            <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB' }} formatter={(v: any) => [`${v}%`, 'Open Rate']} />
            <Line type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} isAnimationActive animationDuration={600} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

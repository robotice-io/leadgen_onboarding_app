"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

// New production metrics types (server returns only these KPIs)
export type ProdWindowSummary = {
  analysis_period_days: number;
  summary: {
    emails_sent: number;
    hard_bounces: number;
    replies: number;
    meetings: number;
    reply_rate: number; // percentage 0..100
    bounce_rate: number; // percentage 0..100
    meeting_rate: number; // percentage 0..100
  };
};

export type ProdComprehensive = {
  tenant_id: number;
  tenant_name?: string;
  tenant_email?: string;
  last_updated?: string;
  today?: ProdWindowSummary;
  last_7_days?: ProdWindowSummary;
  last_14_days?: ProdWindowSummary;
  last_30_days?: ProdWindowSummary;
};

// Condensed payload type for the dashboard – now focused on prod metrics
export type CondensedDashboard = {
  prod?: ProdComprehensive;
  // Keep recent_emails for the activity feed
  recent_emails?: Array<any>;
};

function sortWindows(prod?: ProdComprehensive) {
  if (!prod) return [] as Array<{ key: string; label: string; win: ProdWindowSummary }>;
  const entries: Array<{ key: string; label: string; win?: ProdWindowSummary }> = [
    { key: "today", label: "Today", win: prod.today },
    { key: "last_7_days", label: "7d", win: prod.last_7_days },
    { key: "last_14_days", label: "14d", win: prod.last_14_days },
    { key: "last_30_days", label: "30d", win: prod.last_30_days },
  ];
  return entries.filter(e => !!e.win).map(e => ({ key: e.key, label: e.label, win: e.win! }));
}

// LocalStorage helpers to avoid re-fetching when the user toggles periods
function lsKey(tenantId: number) { return `robotice-prod-metrics-${tenantId}`; }

function readCached(tenantId?: number): ProdComprehensive | null {
  if (!tenantId || typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(lsKey(tenantId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch {
    return null;
  }
}

function writeCached(tenantId: number, data: ProdComprehensive) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(lsKey(tenantId), JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

export function useCondensedDashboard(tenantId?: number, _daysIgnored = 30) {
  const initial = readCached(tenantId || undefined);
  return useQuery<CondensedDashboard>({
    queryKey: ["prod-metrics", tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error("No tenant");
      // Fetch the comprehensive prod metrics once; UI will slice windows locally
      let res = await apiGet(`/api/v1/metrics/${tenantId}/prod-comprehensive`);
      if (!res.ok) {
        // Fallback to overview(30) if comprehensive isn't available
        const alt = await apiGet(`/api/v1/metrics/${tenantId}/prod-overview?days=30`);
        if (!alt.ok) {
          const txt = await res.text();
          const txt2 = await alt.text();
          throw new Error(txt2 || txt || `Failed to fetch prod metrics`);
        }
        const ov = await alt.json();
        const json: ProdComprehensive = { tenant_id: tenantId, last_30_days: ov } as any;
        writeCached(tenantId, json);
        return { prod: json } as CondensedDashboard;
      }
      const json = (await res.json()) as ProdComprehensive;
      writeCached(tenantId, json);
      return { prod: json } as CondensedDashboard;
    },
    enabled: !!tenantId,
    // Use cached value immediately if present to avoid flicker when toggling
    initialData: initial ? ({ prod: initial } as CondensedDashboard) : undefined,
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
}

// Utility accessors used by UI components
export function getWindowSummary(data: CondensedDashboard | undefined, days: 1 | 7 | 14 | 30) {
  const prod = data?.prod;
  if (!prod) return undefined as ProdWindowSummary | undefined;
  if (days === 1 && prod.today) return prod.today;
  if (days === 7 && prod.last_7_days) return prod.last_7_days;
  if (days === 14 && prod.last_14_days) return prod.last_14_days;
  return prod.last_30_days || prod.last_14_days || prod.last_7_days || prod.today;
}

export function buildMetricSeries(data: CondensedDashboard | undefined, metric: keyof ProdWindowSummary["summary"]) {
  const prod = data?.prod;
  const wins = sortWindows(prod);
  return wins.map(({ label, win }) => ({ name: label, value: (win.summary as any)[metric] ?? 0 }));
}


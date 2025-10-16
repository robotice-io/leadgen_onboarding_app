"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

// Condensed payload type (union de los campos necesarios para el dashboard)
export type CondensedDashboard = {
  overview?: {
    total_emails_sent?: number;
    total_opens?: number;
    unique_opens?: number;
    open_rate?: number; // %
    avg_opens_per_email?: number;
    fast_response_rate?: number; // %
    deliverability_score?: number; // %
    multi_device_rate?: number; // %
    engagement_depth?: number; // %
    weekly_change?: number; // %
    performance_grade?: string;
  };
  timing?: {
    time_distribution?: Record<string, number>;
    median_time_to_open_minutes?: number;
  };
  deliverability?: {
    provider_performance?: Array<{ provider: string; opens_count: number; open_rate: number }>;
    inbox_placement_score?: number;
  };
  platform?: {
    device_type_distribution?: Record<string, number>;
  };
  trends?: {
    daily_trends?: Array<{ date: string; opens_count: number; open_rate: number; platform_distribution?: Record<string, number> }>;
  };
  recent_emails?: Array<any>;
};

// Mapea la respuesta de /metrics/{tenantId}/comprehensive-analytics al shape CondensedDashboard usado por el Dashboard
function mapComprehensiveToCondensed(payload: any): CondensedDashboard {
  const overview = payload?.campaign_overview || payload?.performance_summary || {};
  const timing = payload?.timing_analysis || {};
  const deliverability = payload?.deliverability_health || {};
  const platform = payload?.platform_intelligence || {};
  const trends = payload?.trend_analysis || {};

  const mapped: CondensedDashboard = {
    overview: {
      total_emails_sent: overview.total_emails_sent ?? payload?.core_metrics?.emails_sent ?? 0,
      total_opens: overview.total_opens ?? payload?.core_metrics?.total_opens ?? 0,
      unique_opens: overview.unique_opens ?? payload?.core_metrics?.unique_opens ?? 0,
      avg_opens_per_email: overview.avg_opens_per_email ?? payload?.core_metrics?.avg_opens_per_email,
      // open_rate puede venir como porcentaje (overview.open_rate = 39.12) o como fracción (core_metrics.open_rate = 0.3912)
      open_rate: ((): number | undefined => {
        if (typeof overview.open_rate === 'number') return Number(overview.open_rate.toFixed(2));
        const frac = payload?.core_metrics?.open_rate;
        if (typeof frac === 'number') return Number((frac * 100).toFixed(2));
        return undefined;
      })(),
      fast_response_rate: overview.fast_response_rate ?? timing.fast_response_rate,
      deliverability_score: overview.deliverability_score ?? deliverability.inbox_placement_score,
      multi_device_rate: overview.multi_device_rate ?? payload?.engagement_patterns?.multi_device_rate,
      engagement_depth: overview.engagement_depth ?? payload?.engagement_patterns?.engagement_depth_score,
      weekly_change: overview.weekly_change ?? payload?.trend_analysis?.weekly_change,
      performance_grade: overview.performance_grade ?? payload?.performance_grade ?? payload?.performance_summary?.overall_grade,
    },
    timing: {
      time_distribution: timing.time_distribution,
      median_time_to_open_minutes: timing.median_time_to_open_minutes ?? payload?.timing_analysis?.median_time_to_open_minutes,
    },
    deliverability: {
      provider_performance: deliverability.provider_performance,
      inbox_placement_score: deliverability.inbox_placement_score,
    },
    platform: {
      device_type_distribution: platform.device_type_distribution ?? payload?.core_metrics?.device_breakdown,
    },
    trends: {
      daily_trends: (trends.daily_trends || []).map((d: any) => ({
        date: d.date,
        opens_count: d.opens_count ?? d.open_count ?? 0,
        open_rate: d.open_rate ?? 0,
        platform_distribution: d.platform_distribution,
      })),
    },
    recent_emails: payload?.recent_emails || payload?.dashboard_stats?.recent_activity || [],
  };

  return mapped;
}

export function useCondensedDashboard(tenantId?: number, days = 30) {
  return useQuery<CondensedDashboard>({
    queryKey: ["dashboard-condensed", tenantId, days],
    queryFn: async () => {
      if (!tenantId) throw new Error("No tenant");
      const res = await apiGet(`/metrics/${tenantId}/comprehensive-analytics?days=${days}`);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed to fetch condensed dashboard`);
      }
      const json = await res.json();
      return mapComprehensiveToCondensed(json);
    },
    enabled: !!tenantId,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

"use client";

import React from "react";
import { KpiCard } from "@/components/dashboard/cards/KpiCard";
import type { CondensedDashboard } from "@/lib/condensed";

type Props = {
  data?: CondensedDashboard;
  loading?: boolean;
};

export function KpiSummary({ data, loading }: Props) {
  const ov = data?.overview;
  const ti = data?.timing;
  const de = data?.deliverability;

  return (
    <div className="bg-white dark:bg-gray-900/70 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-white uppercase">Today's Emails</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Sales Summary</p>
        </div>
        {/* Placeholder para futuras acciones: Export, Date Range, etc. */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Emails" value={ov?.total_emails_sent ?? 0} loading={loading} delta={ov?.weekly_change !== undefined ? `${ov?.weekly_change}% vs last week` : undefined} deltaType={(ov?.weekly_change ?? 0) > 0 ? 'up' : (ov?.weekly_change ?? 0) < 0 ? 'down' : 'neutral'} />
        <KpiCard title="Total Opens" value={ov?.total_opens ?? 0} loading={loading} />
  <KpiCard title="Open Rate" value={(ov?.open_rate ?? 0).toFixed(2)} suffix="%" loading={loading} />
  <KpiCard title="Average opens" value={Number((ov?.avg_opens_per_email ?? 0).toFixed(2))} loading={loading} />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Fast response" value={(ov?.fast_response_rate ?? 0).toFixed(0)} suffix="%" loading={loading} />
        <KpiCard title="Deliverability" value={Number((ov?.deliverability_score ?? de?.inbox_placement_score ?? 0).toFixed(0))} suffix="%" loading={loading} />
        <KpiCard title="Multi-device" value={Number((ov?.multi_device_rate ?? 0).toFixed(0))} suffix="%" loading={loading} />
        <KpiCard title="Engagement depth" value={Number((ov?.engagement_depth ?? 0).toFixed(0))} suffix="%" loading={loading} />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Median time to open" value={Number((ti?.median_time_to_open_minutes ?? 0).toFixed(2))} suffix="m" loading={loading} />
        {ov?.performance_grade ? (
          <KpiCard title="Performance grade" value={ov?.performance_grade} loading={loading} />
        ) : null}
      </div>
    </div>
  );
}

export default KpiSummary;

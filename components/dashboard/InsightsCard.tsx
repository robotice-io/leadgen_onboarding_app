"use client";

import React from "react";
import type { CondensedDashboard } from "@/lib/condensed";
import { getWindowSummary } from "@/lib/condensed";
import { Gauge, Lightbulb } from "lucide-react";

export function InsightsCard({ data, loading }: { data?: CondensedDashboard; loading?: boolean }) {
  // Derive a simple grade from reply rate of the 30d window when available
  const win = getWindowSummary(data, 30);
  const rr = Number(win?.summary?.reply_rate ?? 0);
  const grade = rr >= 7 ? "A" : rr >= 4 ? "B" : rr >= 2 ? "C" : rr > 0 ? "D" : undefined;
  const insights: string[] = (data as any)?.insights || [];

  return (
    <div className="bg-white dark:bg-gray-900/70 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Insights</h3>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
          <Gauge className="h-4 w-4" />
          <span className="text-xs">Grade: {grade ?? '-'}</span>
        </div>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      ) : insights.length ? (
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {insights.slice(0,5).map((it, idx) => (
            <li key={idx}>{it}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">No insights available</p>
      )}
    </div>
  );
}

export default InsightsCard;

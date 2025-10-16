"use client";

import React from "react";
import { KpiCard } from "@/components/dashboard/cards/KpiCard";
import type { CondensedDashboard } from "@/lib/condensed";
import { useI18n } from "@/lib/i18n";
import { BarChart3, Mail, Gauge, Timer, Cpu, Repeat, Layers, TrendingUp } from "lucide-react";
import { KPIItem } from "@/components/dashboard/KPIItem";
import { MiniTrendTile } from "@/components/dashboard/widgets/MiniTrendTile";

type Props = {
  data?: CondensedDashboard;
  loading?: boolean;
  days?: number;
  onChangeDays?: (d: number) => void;
};

export function KpiSummary({ data, loading, days = 30, onChangeDays }: Props) {
  const { t } = useI18n();
  const ov = data?.overview;
  const ti = data?.timing;
  const de = data?.deliverability;
  const weekly = typeof ov?.weekly_change === 'number' ? `${ov?.weekly_change}${t("dashboard.vsLastWeek")}` : undefined;
  const dynamicTitle = days === 1
    ? t("dashboard.kpiBlock.titleToday")
    : `${t("dashboard.kpiBlock.titleLast")} ${days} ${t("dashboard.daysLabel")}`;

  return (
    <div className="bg-white dark:bg-gray-900/70 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-white uppercase">{dynamicTitle}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.kpiBlock.subtitle")}</p>
        </div>
        {/* Selector de rango */}
        <div className="inline-flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800/50" role="group" aria-label={t("dashboard.selectRange")}>
          {/* Hoy */}
          <button
            onClick={() => onChangeDays?.(1)}
            aria-pressed={days===1}
            aria-label={t("dashboard.todayShort")}
            className={`px-2 h-7 text-xs rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${days===1? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >{t("dashboard.todayShort")}</button>
          {[7,14,30].map((d) => (
            <button
              key={d}
              onClick={() => onChangeDays?.(d)}
              aria-pressed={days===d}
              aria-label={`${d} ${t("dashboard.daysLabel")}`}
              className={`px-2 h-7 text-xs rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${days===d? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >{d}{t("dashboard.daysShort")}</button>
          ))}
        </div>
      </div>

      {/* 3x3 KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <KPIItem labelKey="dashboard.totalEmails" value={ov?.total_emails_sent ?? 0} format="int" icon={<Mail className="h-4 w-4" />} delta={typeof ov?.weekly_change==='number'?{ value: ov!.weekly_change }:null} hintKey="dashboard.vsLastWeek" />
        <KPIItem labelKey="dashboard.totalOpens" value={ov?.total_opens ?? 0} format="int" icon={<BarChart3 className="h-4 w-4" />} />
        <KPIItem labelKey="dashboard.openRate" value={ov?.open_rate ?? 0} format="percent-2" suffix="%" icon={<TrendingUp className="h-4 w-4" />} delta={typeof ov?.weekly_change==='number'?{ value: ov!.weekly_change }:null} hintKey="dashboard.vsLastWeek" />

        <KPIItem labelKey="dashboard.avgOpens" value={ov?.avg_opens_per_email ?? 0} format="float-2" icon={<Layers className="h-4 w-4" />} />
        <KPIItem labelKey="dashboard.deliverability" value={(ov?.deliverability_score ?? de?.inbox_placement_score ?? 0)} format="percent-int" suffix="%" icon={<Gauge className="h-4 w-4" />} />
        <KPIItem labelKey="dashboard.fastResponse" value={ov?.fast_response_rate ?? 0} format="percent-int" suffix="%" icon={<Timer className="h-4 w-4" />} />

        <KPIItem labelKey="dashboard.multiDevice" value={ov?.multi_device_rate ?? 0} format="percent-int" suffix="%" icon={<Repeat className="h-4 w-4" />} />
        <KPIItem labelKey="dashboard.engagementDepth" value={ov?.engagement_depth ?? 0} format="percent-int" suffix="%" icon={<Cpu className="h-4 w-4" />} />
        <KPIItem labelKey="dashboard.medianTimeToOpen" value={ti?.median_time_to_open_minutes ?? 0} format="minutes-2" suffix="m" icon={<Timer className="h-4 w-4" />} />
      </div>

      {/* Mini trend tile */}
      <div className="mt-4">
        <MiniTrendTile
          title={t("dashboard.openRateTrend")}
          subtitle={days===1 ? t("dashboard.todayShort") : `${days}${t("dashboard.daysShort")}`}
          data={(data?.trends?.daily_trends || []).map(d => ({ date: d.date, value: Number((d.open_rate ?? 0).toFixed(2)) }))}
          height={150}
          ySuffix="%"
          maxPoints={Math.min(days, 20)}
        />
      </div>
    </div>
  );
}

export default KpiSummary;

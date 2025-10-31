"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { CondensedDashboard, ProdWindowSummary } from "@/lib/condensed";
import { getWindowSummary, buildMetricSeries } from "@/lib/condensed";
import { useI18n } from "@/lib/i18n";
import CircularProgressBar from "@/components/ui/CircularProgressBar";

type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  avatarUrl?: string;
  icon?: React.ReactNode;
  timeAgo: string;
};

type Props = {
  data?: CondensedDashboard;
  recent?: Array<any>;
  days?: 1 | 7 | 14 | 30;
  onChangeDays?: (d: 1 | 7 | 14 | 30) => void;
};

export function V2Overview({ data, recent = [], days = 30, onChangeDays }: Props) {
  const { t } = useI18n();
  const [metric, setMetric] = useState("reply_rate");
  const [campaign, setCampaign] = useState("all");
  // Select current window summary without re-fetching
  const win: ProdWindowSummary | undefined = getWindowSummary(data, days);

  const kpis = useMemo(() => {
    const s = win?.summary || ({} as any);
    // Build small 4-point spark series based on available windows
    const emailsSeries = buildMetricSeries(data, "emails_sent").map(p => p.value as number);
    const repliesSeries = buildMetricSeries(data, "replies").map(p => p.value as number);
    const meetingsSeries = buildMetricSeries(data, "meetings").map(p => p.value as number);
    const bounceRateSeries = buildMetricSeries(data, "bounce_rate").map(p => p.value as number);

    const pctDelta = (series: number[]) => {
      if (!series || series.length < 2) return undefined as string | undefined;
      const a = series[series.length - 1];
      const b = series[series.length - 2];
      if (b === 0) return undefined as string | undefined;
      const d = ((a - b) / Math.abs(b)) * 100;
      return (d >= 0 ? "+" : "") + d.toFixed(0) + "%";
    };
    const emailsMax = Math.max(1, ...emailsSeries);
    return [
      {
        key: "emails",
        label: t("dashboard.emailsSent"),
        numberText: (s.emails_sent ?? 0).toLocaleString(),
        percent: Math.round(((s.emails_sent ?? 0) / emailsMax) * 100),
        delta: pctDelta(emailsSeries) || undefined,
        barColor: "#0ea5e9", // sky-500
      },
      {
        key: "reply_rate",
        label: t("dashboard.replyRate"),
        numberText: `${Number(s.reply_rate ?? 0).toFixed(2)}%`,
        percent: Math.max(0, Math.min(100, Number(s.reply_rate ?? 0))),
        delta: pctDelta(buildMetricSeries(data, "reply_rate").map(p => p.value as number)) || undefined,
        barColor: "#8b5cf6", // violet-500
      },
      {
        key: "meet_rate",
        label: t("dashboard.meetingRate"),
        numberText: `${Number(s.meeting_rate ?? 0).toFixed(2)}%`,
        percent: Math.max(0, Math.min(100, Number(s.meeting_rate ?? 0))),
        delta: pctDelta(buildMetricSeries(data, "meeting_rate").map(p => p.value as number)) || undefined,
        barColor: "#10b981", // emerald-500
      },
      {
        key: "bounces",
        label: t("dashboard.bounceRate"),
        numberText: `${Number(s.bounce_rate ?? 0).toFixed(2)}%`,
        percent: Math.max(0, Math.min(100, Number(s.bounce_rate ?? 0))),
        delta: pctDelta(bounceRateSeries) || undefined,
        barColor: "#f43f5e", // rose-500
      },
    ];
  }, [data, t, win]);

  const activities: ActivityItem[] = useMemo(() => {
    // Map recent emails (if available) into the compact activity format
    const list = (recent || []).slice(0, 3).map((e: any, i: number) => ({
      id: e?.uuid || String(i),
      title: e?.subject || t("dashboard.newResponse"),
      subtitle: e?.to || e?.from || "john.doe@example.com",
      avatarUrl: e?.avatar || undefined,
      timeAgo: e?.ago || (i === 0 ? t("dashboard.ago.2h") : i === 1 ? t("dashboard.ago.4h") : t("dashboard.ago.6h")),
    }));
    // Fallback demo rows if no data
    if (list.length === 0) {
      return [
        { id: "a1", title: t("dashboard.newResponse"), subtitle: "john.doe@example.com", timeAgo: t("dashboard.ago.2h") },
        { id: "a2", title: t("dashboard.campaignReached20OpenRate"), subtitle: "Campaign X", timeAgo: t("dashboard.ago.4h") },
        { id: "a3", title: t("dashboard.newContactAdded"), subtitle: "jane.smith@company.com", timeAgo: t("dashboard.ago.6h") },
      ];
    }
    return list;
  }, [recent, t]);

  const campaigns = useMemo(() => {
    // Static demo table – wire to real endpoint later
    return [
      { name: "Campaign A", sent: "2,500", open: "25%", responses: "100", meetings: "10", status: t("dashboard.active") },
      { name: "Campaign B", sent: "3,000", open: "20%", responses: "120", meetings: "15", status: t("dashboard.paused") },
      { name: "Campaign C", sent: "2,000", open: "30%", responses: "80", meetings: "8", status: t("dashboard.active") },
      { name: "Campaign D", sent: "1,500", open: "15%", responses: "50", meetings: "5", status: t("dashboard.stopped") },
      { name: "Campaign E", sent: "3,500", open: "22%", responses: "150", meetings: "20", status: t("dashboard.active") },
    ];
  }, [t]);

  return (
    <div className="w-full bg-white dark:bg-gray-900/70 text-gray-900 dark:text-white rounded-2xl">
      {/* Title */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between gap-3 py-4">
          <h1 className="text-[28px] sm:text-[32px] font-bold leading-tight tracking-tight">{t("dashboard.overview")}</h1>
        </div>
      </div>

      {/* KPI cards (enhanced) */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <KpiCard
              key={k.key}
              label={k.label}
              numberText={k.numberText as any}
              percent={k.percent as any}
              delta={k.delta}
              barColor={(k as any).barColor}
            />
          ))}
        </div>
      </div>

      {/* Trend Explorer */}
      <div className="px-4 sm:px-6 lg:px-8">
  <h2 className="text-[22px] font-bold tracking-tight mt-6 mb-3">{t("dashboard.trendExplorer")}</h2>
        <div className="rounded-lg p-4 sm:p-6 bg-[#111315] border border-[#282c39]">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="appearance-none bg-[#282c39] text-white text-sm font-medium pl-4 pr-10 py-2 rounded-lg border border-[#282c39] focus:outline-none"
              >
                <option value="reply_rate">{t("dashboard.replyRate")}</option>
                <option value="meeting_rate">{t("dashboard.meetingRate")}</option>
                <option value="bounce_rate">{t("dashboard.bounceRate")}</option>
                <option value="emails_sent">{t("dashboard.emailsSent")}</option>
              </select>
              <select
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                className="appearance-none bg-[#282c39] text-white text-sm font-medium pl-4 pr-10 py-2 rounded-lg border border-[#282c39] focus:outline-none"
              >
                <option value="all">{t("dashboard.allCampaigns")}</option>
                <option value="A">Campaign A</option>
                <option value="B">Campaign B</option>
                <option value="C">Campaign C</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              {[{k:1,l:t("dashboard.todayShort")},{k:7,l:`7 ${t("dashboard.daysLabel")}`},{k:14,l:`14 ${t("dashboard.daysLabel")}`},{k:30,l:`30 ${t("dashboard.daysLabel")}`}].map(({k,l}) => (
                <button
                  key={k}
                  onClick={() => onChangeDays?.(k as 1|7|14|30)}
                  className={`h-9 px-3 rounded-lg text-sm ${days===k?"bg-white text-black":"bg-[#282c39] text-white"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <TrendChart dataPoints={buildMetricSeries(data, metric as any)} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 sm:px-6 lg:px-8">
  <h2 className="text-[22px] font-bold tracking-tight mt-6 mb-3">{t("dashboard.recentActivity")}</h2>
        <div className="space-y-3">
          {activities.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 bg-[#111315] border border-[#282c39]">
              <div className="flex items-center gap-4 min-w-0">
                {a.avatarUrl ? (
                  <div
                    className="h-14 w-14 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url('${a.avatarUrl}')` }}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-[#282c39]" />
                )}
                <div className="min-w-0">
                  <p className="text-base font-medium truncate">{a.title}</p>
                  <p className="text-sm text-white/60 truncate">{a.subtitle}</p>
                </div>
              </div>
              <div className="shrink-0 text-sm text-white/60">{a.timeAgo}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Comparison */}
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-[22px] font-bold tracking-tight mt-6 mb-3">{t("dashboard.campaignComparison")}</h2>
        <div className="rounded-lg overflow-hidden border border-[#3b4154] bg-[#111315]">
          <table className="w-full">
            <thead className="bg-[#1c1e27]">
              <tr>
                <th className="text-left px-4 py-3 text-sm">{t("dashboard.campaignLabel")}</th>
                <th className="text-left px-4 py-3 text-sm">{t("dashboard.sent")}</th>
                <th className="text-left px-4 py-3 text-sm">{t("dashboard.opensLabel")}</th>
                <th className="text-left px-4 py-3 text-sm">{t("dashboard.responses")}</th>
                <th className="text-left px-4 py-3 text-sm">{t("dashboard.meetings")}</th>
                <th className="text-left px-4 py-3 text-sm">{t("dashboard.statusLabel")}</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c, i) => (
                <tr key={c.name} className={i === 0 ? "" : "border-t border-[#3b4154]"}>
                  <td className="px-4 py-3 text-sm">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-white/70">{c.sent}</td>
                  <td className="px-4 py-3 text-sm text-white/70">{c.open}</td>
                  <td className="px-4 py-3 text-sm text-white/70">{c.responses}</td>
                  <td className="px-4 py-3 text-sm text-white/70">{c.meetings}</td>
                  <td className="px-4 py-3 text-sm">
                    <button className="h-8 px-4 rounded-lg bg-[#282c39] text-white text-sm">{c.status}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Chart ---

type TrendPoint = { name: string; value: number };

function formatDateLabel(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

// --- KPI Card ---
function KpiCard({
  label,
  numberText,
  percent,
  delta,
  barColor,
}: {
  label: string;
  numberText: string | number;
  percent: number;
  delta?: string;
  barColor?: string;
}) {
  const positive = typeof delta === "string" ? delta.trim().startsWith("+") : true;
  return (
    <div className="relative rounded-2xl p-5 sm:p-6 bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-gray-100 dark:bg-gray-800" />
            <p className="text-[13px] tracking-wide uppercase text-gray-700 dark:text-gray-300 font-medium">{label}</p>
          </div>
          {typeof delta === "string" && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border ${positive ? "text-emerald-600 border-emerald-200/20 bg-emerald-50/20" : "text-rose-600 border-rose-200/20 bg-rose-50/20"}`}>
              {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {delta}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-center">
          <div className="h-24 w-24">
            <CircularProgressBar
              number={numberText}
              percent={Math.max(0, Math.min(100, percent ?? 0))}
              strokeWidth={10}
              barColor={barColor || "#3154F0"}
              trackColor="#282c39"
              numberColor="#ffffff"
              fontSize={22}
              animate
              duration={1.0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendChart({ dataPoints }: { dataPoints: TrendPoint[] }) {
  const data = dataPoints || [];

  return (
    <div className="relative w-full h-[260px] mt-4">
      <div className="absolute inset-0 rounded-lg bg-[#0f1115] border border-[#282c39]" />
      <div className="absolute inset-0 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="#1f2330" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#9da3b9" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9da3b9" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#111315", border: "1px solid #282c39", color: "#fff" }} />
            <Line type="monotone" dataKey="value" stroke="#3154F0" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

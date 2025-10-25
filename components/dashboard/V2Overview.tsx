"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { CondensedDashboard } from "@/lib/condensed";
import { useI18n } from "@/lib/i18n";

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
  const [metric, setMetric] = useState("open_rate");
  const [campaign, setCampaign] = useState("all");
  const trend = data?.trends?.daily_trends || [];

  const kpis = useMemo(() => {
    const ov = data?.overview || {} as any;
    return [
      { label: "Emails Sent", value: ov.total_emails_sent ?? 0, delta: "+12%" },
      { label: "Open Rate", value: `${ov.open_rate ?? 0}%`, delta: "+5%" },
      { label: "Response Rate", value: `${ov.fast_response_rate ?? 0}%`, delta: "+2%" },
      { label: "Meetings Booked", value: ov.meetings ?? 45, delta: "+10%" },
    ];
  }, [data]);

  const activities: ActivityItem[] = useMemo(() => {
    // Map recent emails (if available) into the compact activity format
    const list = (recent || []).slice(0, 3).map((e: any, i: number) => ({
      id: e?.uuid || String(i),
      title: e?.subject || "New Response",
      subtitle: e?.to || e?.from || "john.doe@example.com",
      avatarUrl: e?.avatar || undefined,
      timeAgo: e?.ago || (i === 0 ? "2h ago" : i === 1 ? "4h ago" : "6h ago"),
    }));
    // Fallback demo rows if no data
    if (list.length === 0) {
      return [
        { id: "a1", title: "New Response", subtitle: "john.doe@example.com", timeAgo: "2h ago" },
        { id: "a2", title: "Campaign Reached 20% Open Rate", subtitle: "Campaign X", timeAgo: "4h ago" },
        { id: "a3", title: "New Contact Added", subtitle: "jane.smith@company.com", timeAgo: "6h ago" },
      ];
    }
    return list;
  }, [recent]);

  const campaigns = useMemo(() => {
    // Static demo table – wire to real endpoint later
    return [
      { name: "Campaign A", sent: "2,500", open: "25%", responses: "100", meetings: "10", status: "Active" },
      { name: "Campaign B", sent: "3,000", open: "20%", responses: "120", meetings: "15", status: "Paused" },
      { name: "Campaign C", sent: "2,000", open: "30%", responses: "80", meetings: "8", status: "Active" },
      { name: "Campaign D", sent: "1,500", open: "15%", responses: "50", meetings: "5", status: "Stopped" },
      { name: "Campaign E", sent: "3,500", open: "22%", responses: "150", meetings: "20", status: "Active" },
    ];
  }, []);

  return (
    <div className="w-full bg-[#0D0F12] text-white rounded-2xl">
      {/* Title */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between gap-3 py-4">
          <h1 className="text-[28px] sm:text-[32px] font-bold leading-tight tracking-tight">Overview</h1>
        </div>
      </div>

      {/* KPI cards */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-lg p-6 bg-[#111315] border border-[#282c39]">
              <p className="text-base font-medium text-white/90">{k.label}</p>
              <p className="text-2xl font-bold mt-1">{k.value}</p>
              <p className="text-[#0bda62] text-sm mt-1">{k.delta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Explorer */}
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-[22px] font-bold tracking-tight mt-6 mb-3">Interactive Trend Explorer</h2>
        <div className="rounded-lg p-4 sm:p-6 bg-[#111315] border border-[#282c39]">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="appearance-none bg-[#282c39] text-white text-sm font-medium pl-4 pr-10 py-2 rounded-lg border border-[#282c39] focus:outline-none"
              >
                <option value="open_rate">Open Rate</option>
                <option value="response_rate">Response Rate</option>
                <option value="emails_sent">Emails Sent</option>
                <option value="meetings">Meetings Booked</option>
              </select>
              <select
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                className="appearance-none bg-[#282c39] text-white text-sm font-medium pl-4 pr-10 py-2 rounded-lg border border-[#282c39] focus:outline-none"
              >
                <option value="all">All Campaigns</option>
                <option value="A">Campaign A</option>
                <option value="B">Campaign B</option>
                <option value="C">Campaign C</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              {[{k:1,l:"Now"},{k:7,l:"7 days"},{k:14,l:"14 days"},{k:30,l:"30 days"}].map(({k,l}) => (
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
          <TrendChart metric={metric} series={trend} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-[22px] font-bold tracking-tight mt-6 mb-3">Recent Activity</h2>
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
        <h2 className="text-[22px] font-bold tracking-tight mt-6 mb-3">Campaign Comparison</h2>
        <div className="rounded-lg overflow-hidden border border-[#3b4154] bg-[#111315]">
          <table className="w-full">
            <thead className="bg-[#1c1e27]">
              <tr>
                <th className="text-left px-4 py-3 text-sm">Campaign</th>
                <th className="text-left px-4 py-3 text-sm">Sent</th>
                <th className="text-left px-4 py-3 text-sm">Open</th>
                <th className="text-left px-4 py-3 text-sm">Responses</th>
                <th className="text-left px-4 py-3 text-sm">Meetings</th>
                <th className="text-left px-4 py-3 text-sm">Status</th>
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

type TrendPoint = { date: string; opens_count?: number; open_rate?: number; responses?: number; meetings?: number };

function formatDateLabel(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function TrendChart({ metric, series }: { metric: string; series: TrendPoint[] }) {
  // Build data safely; fallbacks if a metric is missing
  const key = metric === "open_rate" ? "open_rate"
    : metric === "emails_sent" ? "emails_sent"
    : metric === "response_rate" ? "responses"
    : metric === "meetings" ? "meetings"
    : "open_rate";

  const data = (series || []).map((p) => {
    const y = (() => {
      if (key === "open_rate") return p.open_rate ?? 0;
      if (key === "emails_sent") return (p as any).emails_sent ?? p.opens_count ?? 0; // fallback
      if (key === "responses") return p.responses ?? 0;
      if (key === "meetings") return p.meetings ?? 0;
      return 0;
    })();
    return { name: formatDateLabel(p.date), value: y };
  });

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

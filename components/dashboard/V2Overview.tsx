"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
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
    const ov = (data?.overview || {}) as any;
    const series = data?.trends?.daily_trends || [];
    const last = series[series.length - 1];
    const prev = series[series.length - 2];
    const pct = (a?: number, b?: number) => {
      if (typeof a !== "number" || typeof b !== "number" || b === 0) return undefined as string | undefined;
      const d = ((a - b) / Math.abs(b)) * 100;
      const s = (d >= 0 ? "+" : "") + d.toFixed(0) + "%";
      return s;
    };
    return [
      {
        key: "emails",
        label: "Emails Sent",
        value: ov.total_emails_sent ?? (last?.opens_count ?? 0),
        delta: pct(last?.opens_count, prev?.opens_count) || "+12%",
        accent: "from-sky-500/20 to-sky-300/10",
        line: series.map((p) => (p as any).emails_sent ?? p.opens_count ?? 0),
      },
      {
        key: "open",
        label: "Open Rate",
        value: `${(typeof (ov.open_rate ?? last?.open_rate) === 'number' ? Number(ov.open_rate ?? last?.open_rate).toFixed(2) : (ov.open_rate ?? last?.open_rate ?? 0))}%`,
        delta: pct(last?.open_rate, prev?.open_rate) || "+5%",
        accent: "from-violet-500/20 to-fuchsia-400/10",
        line: series.map((p) => p.open_rate ?? 0),
      },
      {
        key: "resp",
        label: "Response Rate",
        value: `${ov.fast_response_rate ?? 0}%`,
        delta: "+2%",
        accent: "from-emerald-500/20 to-lime-400/10",
        line: series.map((p) => (p as any).responses ?? 0),
      },
      {
        key: "meet",
        label: "Meetings Booked",
        value: ov.meetings ?? 45,
        delta: "+10%",
        accent: "from-amber-500/20 to-orange-400/10",
        line: series.map((p) => (p as any).meetings ?? 0),
      },
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

      {/* KPI cards (enhanced) */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <KpiCard
              key={k.key}
              label={k.label}
              value={k.value}
              delta={k.delta}
              accent={k.accent}
              line={k.line}
            />
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

// --- KPI Card ---
function KpiCard({
  label,
  value,
  delta,
  accent,
  line = [],
}: {
  label: string;
  value: string | number;
  delta?: string;
  accent: string; // tailwind gradient e.g. from-sky-500/20 to-sky-300/10
  line?: number[];
}) {
  const positive = typeof delta === "string" ? delta.trim().startsWith("+") : true;
  return (
    <div className="relative rounded-2xl p-5 sm:p-6 bg-[#0f1115] border border-white/10 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* subtle gradient glow */}
      <div className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${accent} opacity-60 blur-2`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-white/70" />
            <p className="text-[13px] tracking-wide uppercase text-white/70 font-medium">{label}</p>
          </div>
          {typeof delta === "string" && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border ${positive ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-rose-400 border-rose-500/30 bg-rose-500/10"}`}>
              {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {delta}
            </span>
          )}
        </div>

        <div className="mt-3">
          <div className="text-3xl sm:text-4xl font-black tracking-tight">{value}</div>
        </div>

        {/* micro sparkline */}
        <div className="mt-4 h-10">
          <MicroSparkline values={line} positive={positive} />
        </div>
      </div>
    </div>
  );
}

function MicroSparkline({ values = [], positive }: { values?: number[]; positive?: boolean }) {
  const width = 140;
  const height = 40;
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const d = pts.length ? `M ${pts[0]} L ${pts.slice(1).join(" ")}` : "";
  const stroke = positive ? "#34d399" : "#fb7185"; // emerald / rose
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" className="overflow-visible">
      <defs>
        <linearGradient id="kpiLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.2" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* baseline grid */}
      <path d={`M0 ${height} H ${width}`} stroke="#1f2330" strokeWidth="1" />
      {/* area fill */}
      {pts.length >= 2 && (
        <path
          d={`${d} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#kpiLine)"
          stroke="none"
        />
      )}
      {/* line */}
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
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

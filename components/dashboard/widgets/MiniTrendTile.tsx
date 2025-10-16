"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import React, { useEffect, useMemo, useState } from "react";

export function MiniTrendTile({
  title,
  subtitle,
  data,
  height = 150,
  ySuffix = "%",
  maxPoints = 20,
}: {
  title: string;
  subtitle?: string;
  data: Array<{ date: string; value: number }>;
  height?: number;
  ySuffix?: string;
  maxPoints?: number;
}) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const displayData = useMemo(() => {
    if (!Array.isArray(data)) return [] as typeof data;
    const n = Math.max(1, Math.min(maxPoints ?? 20, 60));
    return data.slice(-n);
  }, [data, maxPoints]);

  const WD = ['do','lu','ma','mi','jue','vi','sa'];
  const fmtTick = (d: string) => {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    const dd = String(dt.getDate()).padStart(2, '0');
    if (isMobile) return dd;
    const abbr = WD[dt.getDay()] || '';
    return `${abbr} ${dd}`;
  };
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</p>
          {subtitle ? <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p> : null}
        </div>
      </div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <AreaChart data={displayData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={fmtTick} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}${ySuffix || ''}`} width={40} />
            <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB' }} formatter={(v: any) => [`${v}${ySuffix || ''}`, '']} />
            <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fill="url(#gradBlue)" isAnimationActive animationDuration={600} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MiniTrendTile;

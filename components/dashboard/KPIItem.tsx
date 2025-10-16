"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";

type DeltaType = "up" | "down" | "neutral";

type FormatKind = "int" | "float-2" | "percent-int" | "percent-2" | "minutes-2" | "raw";

export type KPIItemProps = {
  labelKey: string; // i18n key
  value?: number | string | null;
  format?: FormatKind;
  suffix?: string;
  icon?: React.ReactNode;
  delta?: { value: number; type?: DeltaType } | null;
  hintKey?: string; // i18n key for hint, e.g., dashboard.vsLastWeek
  loading?: boolean;
  error?: string;
  ariaLabel?: string;
};

function formatValue(kind: FormatKind, value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  const v = Number(value);
  if (Number.isNaN(v)) return "—";
  switch (kind) {
    case "int":
      return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(v);
    case "float-2":
      return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
    case "percent-int":
      return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(v);
    case "percent-2":
      return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
    case "minutes-2":
      return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
    case "raw":
    default:
      return String(value);
  }
}

export function KPIItem({ labelKey, value, format = "raw", suffix, icon, delta, hintKey, loading, error, ariaLabel }: KPIItemProps) {
  const { t } = useI18n();
  const valText = formatValue(format, value);
  const hasDelta = delta && typeof delta.value === "number";
  const deltaType: DeltaType = !hasDelta
    ? "neutral"
    : delta!.value > 0
      ? "up"
      : delta!.value < 0
        ? "down"
        : "neutral";

  const badgeClass = deltaType === "up"
    ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
    : deltaType === "down"
      ? "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30"
      : "text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";

  const aria = ariaLabel || `${t(labelKey)} ${valText}${suffix ? ` ${suffix}` : ""}`;

  return (
    <div
      role="group"
      aria-label={aria}
      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 p-4 hover:border-gray-300 dark:hover:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500/40 transition-colors duration-150"
    >
      <div className="flex items-start justify-between">
        <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{t(labelKey)}</p>
        {icon ? <div className="text-gray-500 dark:text-gray-400 opacity-70">{icon}</div> : null}
      </div>

      {loading ? (
        <div className="mt-3 h-8 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      ) : error ? (
        <div className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</div>
      ) : (
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{valText}</span>
          {suffix ? <span className="text-sm text-gray-500 dark:text-gray-400">{suffix}</span> : null}
        </div>
      )}

      {hasDelta ? (
        <div className={`inline-flex mt-3 px-2 py-0.5 rounded-full text-[11px] font-medium ${badgeClass}`}>
          {`${delta!.value > 0 ? "+" : delta!.value < 0 ? "-" : ""}${Math.abs(delta!.value)}%`} {hintKey ? t(hintKey) : ""}
        </div>
      ) : null}
    </div>
  );
}

export default KPIItem;

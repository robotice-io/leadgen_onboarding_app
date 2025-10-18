"use client";

import React from "react";
import { FadeIn } from "@/lib/animations";

type DeltaType = "up" | "down" | "neutral";

export function KpiCard({
  title,
  value,
  suffix,
  delta,
  deltaType = "neutral",
  icon,
  loading = false,
  error,
}: {
  title: string;
  value?: string | number;
  suffix?: string;
  delta?: string;
  deltaType?: DeltaType;
  icon?: React.ReactNode;
  loading?: boolean;
  error?: string;
}) {
  const deltaClasses = deltaType === "up"
    ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
    : deltaType === "down"
    ? "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30"
    : "text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";

  return (
    <FadeIn>
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</p>
          {loading ? (
            <div className="mt-3 h-8 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ) : error ? (
            <div className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</div>
          ) : (
            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {value}{suffix ? <span className="text-base font-medium text-gray-500 dark:text-gray-400 ml-1">{suffix}</span> : null}
            </h3>
          )}
        </div>
        {icon ? <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 text-gray-600 dark:text-gray-300">{icon}</div> : null}
      </div>
      {delta && !loading && !error ? (
        <div className={`inline-flex mt-3 px-2 py-0.5 rounded-full text-xs font-medium ${deltaClasses}`}>{delta}</div>
      ) : null}
    </div>
    </FadeIn>
  );
}

"use client";

import React from "react";
import { FadeIn } from "@/lib/animations";

export function ChartCard({
  title,
  subtitle,
  children,
  loading,
  error,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
}) {
  return (
    <FadeIn>
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          {subtitle ? <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p> : null}
        </div>
      </div>
      {loading ? (
        <div className="h-56 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      ) : error ? (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      ) : (
        children
      )}
    </div>
    </FadeIn>
  );
}

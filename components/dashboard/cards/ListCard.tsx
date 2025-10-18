"use client";

import React from "react";

export function ListCard({
  title,
  subtitle,
  children,
  loading,
  empty,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          {subtitle ? <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p> : null}
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ))}
        </div>
      ) : empty ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">No data available</div>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  );
}

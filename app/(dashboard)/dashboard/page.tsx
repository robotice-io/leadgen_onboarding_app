"use client";

import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { getTenant } from "@/lib/auth-client";
// Metrics widgets obtain their own data or can be wired to condensed payload in future iterations
import { useCondensedDashboard } from "@/lib/condensed";
import { useTenantId } from "@/lib/use-tenant-id";
import { useEffect, useState } from "react";
import { V2Overview } from "@/components/dashboard/V2Overview";

export default function DashboardPage() {
  const { t } = useI18n();
  const [days, setDays] = useState<1 | 7 | 14 | 30>(30);
  const { tenantId, loading: tenantLoading } = useTenantId();
  const { data: condensed, isLoading: condensedLoading, error: condensedError } = useCondensedDashboard(tenantId ?? undefined, days);

  // Persistencia del rango (Hoy/7/14/30)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('robotice-dashboard-days');
  const n = saved ? Number(saved) : NaN;
  if (n === 1 || n === 7 || n === 14 || n === 30) setDays(n as 1|7|14|30);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try { localStorage.setItem('robotice-dashboard-days', String(days)); } catch {}
  }, [days]);

  // Recent emails stays from existing endpoint for continuity
  // We'll keep the old fetch logic for recent emails to avoid breaking changes in this pass
  // Reuse the existing section below which shows skeletons / list
  const { data: recentEmails = [], isLoading: emailsLoading } = useQuery({
    queryKey: ['recent-emails', tenantId],
    queryFn: async () => {
      if (!tenantId) return [] as any[];
      try {
        const res = await apiGet(`/api/v1/dashboard/${tenantId}/recent-emails?limit=10`);
        if (!res.ok) return [] as any[];
        const data = await res.json();
        return data.recent_emails || [];
      } catch {
        return [] as any[];
      }
    },
    enabled: !!tenantId,
    refetchInterval: 30000,
    retry: 1,
  });

  if (tenantLoading || condensedLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!tenantId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-yellow-500 mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {t("dashboard.noTenantId")}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t("dashboard.pleaseLogin")}
          </p>
        </div>
      </div>
    );
  }

  // If core overview endpoint fails, show a friendly error
  if (condensedError) {
  const message = t("dashboard.failedToLoad");
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {t("dashboard.failedToLoad")}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">{(condensedError as Error)?.message || message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <V2Overview
        data={condensed}
        recent={recentEmails}
        days={days}
        onChangeDays={setDays}
      />
    </div>
  );
}

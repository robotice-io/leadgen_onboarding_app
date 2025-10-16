"use client";

import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { getTenant } from "@/lib/auth-client";
// Metrics widgets obtain their own data or can be wired to condensed payload in future iterations
import { useCondensedDashboard } from "@/lib/condensed";
import { useTenantId } from "@/lib/use-tenant-id";
import { KpiCard } from "@/components/dashboard/cards/KpiCard";
import { KpiSummary } from "@/components/dashboard/KpiSummary";
import { OpenRateTrend } from "@/components/dashboard/widgets/OpenRateTrend";
import { SentOpenedBars } from "@/components/dashboard/widgets/SentOpenedBars";
import { DeviceTypeDonut } from "@/components/dashboard/widgets/DeviceTypeDonut";
import { PlatformStackedBars } from "@/components/dashboard/widgets/PlatformStackedBars";
import { TimingBreakdown } from "@/components/dashboard/widgets/TimingBreakdown";
import { DeliverabilityProviders } from "@/components/dashboard/widgets/DeliverabilityProviders";
import { TopDevicesList } from "@/components/dashboard/widgets/TopDevicesList";
import { RecentEmails } from "@/components/dashboard/RecentEmails";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const { t } = useI18n();
  const { tenantId, loading: tenantLoading } = useTenantId();
  const { data: condensed, isLoading: condensedLoading, error: condensedError } = useCondensedDashboard(tenantId ?? undefined, 30);

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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("dashboard.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("dashboard.welcome")}
          </p>
        </div>
      </div>

    {/* KPI Summary block (minimalista, un solo componente con cards internas) */}
    <KpiSummary data={condensed} loading={condensedLoading} />

      {/* Charts Section: diversos y configurados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OpenRateTrend days={30} data={(condensed?.trends?.daily_trends || []).map(d => ({ date: d.date, rate: d.open_rate }))} />
        <TimingBreakdown days={30} distribution={condensed?.timing?.time_distribution} />
        <DeliverabilityProviders days={30} providers={condensed?.deliverability?.provider_performance} />
        <DeviceTypeDonut days={30} distribution={condensed?.platform?.device_type_distribution} />
        <SentOpenedBars days={30} data={(condensed?.trends?.daily_trends || []).map(d => ({ date: d.date, opens: d.opens_count }))} />
        <PlatformStackedBars days={30} data={(condensed?.trends?.daily_trends || []).map(d => ({ date: d.date, ...(d.platform_distribution || {}) })) as any} />
        <TopDevicesList days={30} distribution={condensed?.platform?.device_type_distribution || undefined} />
      </div>

      {/* Recent Emails */}
      <div className="grid grid-cols-1 gap-8">
        <div>
          {emailsLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-48 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </div>
          ) : recentEmails ? (
            <RecentEmails emails={recentEmails} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

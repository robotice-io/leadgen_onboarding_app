"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { getTenant } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentEmails } from "@/components/dashboard/RecentEmails";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const { t } = useI18n();
  
  // Try multiple sources for tenant ID
  const tenant = getTenant();
  const tenantIdFromStorage = tenant?.tenant_id;
  const tenantIdFromLocalStorage = localStorage.getItem("robotice-tenant-id");
  
  // Use the most reliable tenant ID source
  const tenantId = tenantIdFromStorage || tenantIdFromLocalStorage;

  console.log('[DashboardPage] Tenant from localStorage:', tenant);
  console.log('[DashboardPage] tenantIdFromStorage:', tenantIdFromStorage);
  console.log('[DashboardPage] tenantIdFromLocalStorage:', tenantIdFromLocalStorage);
  console.log('[DashboardPage] Final tenantId:', tenantId);
  console.log('[DashboardPage] Tenant ID type:', typeof tenantId);

  // Fetch dashboard stats with polling
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('No tenant ID available');
      
      console.log('[DashboardPage] Fetching stats for tenant:', tenantId);
      
      // Fetch both current and previous day stats for comparison
      const [currentRes, previousRes] = await Promise.all([
        apiGet(`/api/v1/dashboard/${tenantId}/quick-stats`),
        apiGet(`/api/v1/dashboard/${tenantId}/quick-stats?period=yesterday`)
      ]);
      
      console.log('[DashboardPage] Current stats response:', currentRes.status, currentRes.ok);
      console.log('[DashboardPage] Previous stats response:', previousRes.status, previousRes.ok);
      
      if (!currentRes.ok) {
        const errorText = await currentRes.text();
        console.error('[DashboardPage] Failed to fetch current stats:', errorText);
        throw new Error(`Failed to fetch current stats: ${errorText}`);
      }
      
      const currentStats = await currentRes.json();
      console.log('[DashboardPage] Current stats data:', currentStats);
      
      let previousStats = null;
      
      // Try to get previous day stats (optional - if not available, we'll show no change)
      if (previousRes.ok) {
        previousStats = await previousRes.json();
        console.log('[DashboardPage] Previous stats data:', previousStats);
      }
      
      const result = {
        ...currentStats,
        previous: previousStats
      };
      
      console.log('[DashboardPage] Final stats result:', result);
      return result;
    },
    refetchInterval: 15000, // Poll every 15 seconds
    refetchIntervalInBackground: false,
    enabled: !!tenantId, // Only run if tenantId is available
  });

  // Fetch recent emails
  const { data: recentEmails, isLoading: emailsLoading } = useQuery({
    queryKey: ['recent-emails', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('No tenant ID available');
      
      console.log('[DashboardPage] Fetching recent emails for tenant:', tenantId);
      
      const res = await apiGet(`/api/v1/dashboard/${tenantId}/recent-emails?limit=10`);
      
      console.log('[DashboardPage] Recent emails response:', res.status, res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('[DashboardPage] Failed to fetch emails:', errorText);
        throw new Error(`Failed to fetch emails: ${errorText}`);
      }
      
      const data = await res.json();
      console.log('[DashboardPage] Recent emails data:', data);
      
      const emails = data.recent_emails || [];
      console.log('[DashboardPage] Extracted emails array:', emails);
      
      return emails;
    },
    refetchInterval: 30000, // Poll every 30 seconds
    enabled: !!tenantId, // Only run if tenantId is available
  });

  if (statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {t("dashboard.failedToLoad")}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t("dashboard.checkConnection")}
          </p>
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

      {/* Metrics Grid */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <MetricsGrid stats={stats} />
      ) : null}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {tenantId && <DashboardCharts tenantId={tenantId} />}
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

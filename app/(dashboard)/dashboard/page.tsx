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
  
  // Convert to number if it's a string
  const tenantId = tenantIdFromStorage || (tenantIdFromLocalStorage ? parseInt(tenantIdFromLocalStorage) : null);

  // Fetch dashboard stats with polling
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('No tenant ID available');
      
      try {
        // Fetch both current and previous day stats for comparison
        const [currentRes, previousRes] = await Promise.all([
          apiGet(`/api/v1/dashboard/${tenantId}/quick-stats`),
          apiGet(`/api/v1/dashboard/${tenantId}/quick-stats?period=yesterday`)
        ]);
        
        if (!currentRes.ok) {
          const errorText = await currentRes.text();
          console.error('Dashboard stats error:', errorText);
          // Return empty stats instead of throwing
          return {
            emails_sent_today: 0,
            opens_today: 0,
            open_rate_today: 0,
            unique_devices_today: 0,
            last_updated: new Date().toISOString(),
            previous: null
          };
        }
        
        const currentStats = await currentRes.json();
        
        let previousStats = null;
        
        // Try to get previous day stats (optional - if not available, we'll show no change)
        if (previousRes.ok) {
          try {
            previousStats = await previousRes.json();
          } catch (e) {
            console.warn('Could not parse previous stats:', e);
          }
        }
        
        const result = {
          emails_sent_today: currentStats.emails_sent_today ?? 0,
          opens_today: currentStats.opens_today ?? 0,
          open_rate_today: currentStats.open_rate_today ?? 0,
          unique_devices_today: currentStats.unique_devices_today ?? 0,
          last_updated: currentStats.last_updated ?? new Date().toISOString(),
          previous: previousStats
        };
        
        return result;
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Return empty stats instead of throwing
        return {
          emails_sent_today: 0,
          opens_today: 0,
          open_rate_today: 0,
          unique_devices_today: 0,
          last_updated: new Date().toISOString(),
          previous: null
        };
      }
    },
    refetchInterval: 15000, // Poll every 15 seconds
    refetchIntervalInBackground: false,
    enabled: !!tenantId, // Only run if tenantId is available
    retry: 1, // Only retry once
  });

  // Fetch recent emails
  const { data: recentEmails, isLoading: emailsLoading } = useQuery({
    queryKey: ['recent-emails', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('No tenant ID available');
      
      try {
        const res = await apiGet(`/api/v1/dashboard/${tenantId}/recent-emails?limit=10`);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Recent emails error:', errorText);
          return []; // Return empty array instead of throwing
        }
        
        const data = await res.json();
        
        const emails = data.recent_emails || [];
        
        return emails;
      } catch (error) {
        console.error('Failed to fetch recent emails:', error);
        return []; // Return empty array on error
      }
    },
    refetchInterval: 30000, // Poll every 30 seconds
    enabled: !!tenantId, // Only run if tenantId is available
    retry: 1, // Only retry once
  });

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

  if (statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {t("dashboard.failedToLoad")}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {statsError instanceof Error ? statsError.message : t("dashboard.checkConnection")}
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
        <>
          <MetricsGrid stats={stats} />
          {/* Show helpful message if no data */}
          {stats.emails_sent_today === 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 dark:text-blue-400 text-xl">💡</div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    {t("dashboard.noDataYet")}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {t("dashboard.sendFirstEmail")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
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

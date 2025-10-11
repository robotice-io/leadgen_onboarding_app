"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { getTenant } from "@/lib/auth-client";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentEmails } from "@/components/dashboard/RecentEmails";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardPage() {
  // Get tenant from localStorage
  const tenant = getTenant();
  const tenantId = tenant?.tenant_id;

  // Fetch dashboard stats with polling
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('No tenant ID available');
      const res = await apiGet(`/api/v1/dashboard/${tenantId}/quick-stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
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
      const res = await apiGet(`/api/v1/dashboard/${tenantId}/recent-emails?limit=10`);
      if (!res.ok) throw new Error('Failed to fetch emails');
      const data = await res.json();
      return data.recent_emails || []; // Extract emails array from response
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
            Failed to load dashboard
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Please check your connection and try again
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
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here's what's happening with your campaigns.
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

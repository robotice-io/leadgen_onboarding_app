"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserTenant } from "@/lib/auth-client";

export default function PostLoginGate() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[PostLoginGate] Starting account status check...');
        console.log('[PostLoginGate] localStorage robotice-tenant-id:', localStorage.getItem("robotice-tenant-id"));
        
        const tenant = await getUserTenant();
        console.log('[PostLoginGate] Successfully got tenant data:', tenant);
        // New flow: always go to dashboard; wizard is launched from there if user wants
        router.replace("/dashboard");
      } catch (e) {
        console.error("[PostLoginGate] Failed to check onboarding status:", e);
        console.error("[PostLoginGate] Error details:", e);
        setError(`Failed to check account status: ${e instanceof Error ? e.message : 'Unknown error'}`);
        
        // Instead of redirecting to dashboard on error, show the error and let user choose
        // router.replace("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Checking your account status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Account Status Check Failed
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-6 text-sm">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => (window.location.href = "/onboarding")}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Continue to Onboarding
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

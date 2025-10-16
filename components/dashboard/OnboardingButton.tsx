"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wrench, CheckCircle, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getTenant } from "@/lib/auth-client";

interface OnboardingButtonProps {
  user: any;
}

export function OnboardingButton({ user }: OnboardingButtonProps) {
  const { t } = useI18n();
  const [tenant, setTenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get tenant data from localStorage (stored during login)
    const tenantData = getTenant();
    setTenant(tenantData);
    setIsLoading(false);
  }, []);

  // Determine onboarding status and target URL
  const status: string | undefined = tenant?.onboarding_status;
  const isConnected = status === "completed" && tenant?.google_token_live !== false;
  const needsReconnect = status === "token_expired" || tenant?.google_token_live === false;
  // If needs reconnect, skip directly to step=3 in wizard via query
  const href = needsReconnect ? "/onboarding?step=3" : "/onboarding";

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 animate-pulse">
        <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <Link href={href} className="block">
      {isConnected ? (
        // Connected - solid green
        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-600 text-white border border-green-600 transition-colors hover:bg-green-700">
          <div className="h-8 w-8 rounded-md bg-green-500 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{t("dashboard.connected")}</p>
            <p className="text-xs opacity-90 truncate">{t("dashboard.gmailConnected")}</p>
          </div>
          <span className="text-xs font-medium">{t("dashboard.active")}</span>
        </div>
      ) : needsReconnect ? (
        // Needs re-auth - solid yellow
        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500 text-black border border-yellow-500 transition-colors hover:bg-yellow-400">
          <div className="h-8 w-8 rounded-md bg-yellow-600/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{t("dashboard.reconnect")}</p>
            <p className="text-xs opacity-90 truncate">{t("dashboard.reauthRequired")}</p>
          </div>
          <span className="text-xs font-medium">{t("dashboard.pending")}</span>
        </div>
      ) : (
        // Not connected - solid white with blue
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white text-blue-700 border border-blue-600 transition-colors hover:bg-blue-50 dark:bg-white/95">
          <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{t("dashboard.connectAccount")}</p>
            <p className="text-xs text-blue-600/90 truncate">{t("dashboard.setupGmail")}</p>
          </div>
          <span className="text-xs font-medium text-blue-700">{t("dashboard.pending")}</span>
        </div>
      )}
    </Link>
  );
}

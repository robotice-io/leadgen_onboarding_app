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
    <Link href={href} className="block w-full">
      {isConnected ? (
        // Connected - solid green
        <div className="flex items-start gap-3 p-3.5 rounded-md bg-green-600 text-white border border-green-600 transition-colors hover:bg-green-700 shadow-sm min-h-[72px]">
          <div className="h-9 w-9 rounded-md bg-green-500 flex items-center justify-center shrink-0">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 whitespace-normal break-words leading-tight">
            <p className="text-sm font-semibold">{t("dashboard.connected")}</p>
            <p className="text-xs opacity-90 mt-0.5">{t("dashboard.gmailConnected")}</p>
            <span className="inline-flex mt-2 text-[11px] font-medium bg-white/15 text-white px-2 py-0.5 rounded-full">{t("dashboard.active")}</span>
          </div>
        </div>
      ) : needsReconnect ? (
        // Needs re-auth - solid yellow
        <div className="flex items-start gap-3 p-3.5 rounded-md bg-yellow-500 text-black border border-yellow-500 transition-colors hover:bg-yellow-400 shadow-sm min-h-[72px]">
          <div className="h-9 w-9 rounded-md bg-yellow-600/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-black" />
          </div>
          <div className="flex-1 whitespace-normal break-words leading-tight">
            <p className="text-sm font-semibold">{t("dashboard.reconnect")}</p>
            <p className="text-xs opacity-90 mt-0.5">{t("dashboard.reauthRequired")}</p>
            <span className="inline-flex mt-2 text-[11px] font-medium bg-black/10 text-black px-2 py-0.5 rounded-full">{t("dashboard.pending")}</span>
          </div>
        </div>
      ) : (
        // Not connected - solid white with blue
        <div className="flex items-start gap-3 p-3.5 rounded-md bg-white text-blue-700 border border-blue-600 transition-colors hover:bg-blue-50 shadow-sm min-h-[72px]">
          <div className="h-9 w-9 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 whitespace-normal break-words leading-tight">
            <p className="text-sm font-semibold">{t("dashboard.connectAccount")}</p>
            <p className="text-xs text-blue-600/90 mt-0.5">{t("dashboard.setupGmail")}</p>
            <span className="inline-flex mt-2 text-[11px] font-medium border border-blue-600 text-blue-700 px-2 py-0.5 rounded-full">{t("dashboard.pending")}</span>
          </div>
        </div>
      )}
    </Link>
  );
}

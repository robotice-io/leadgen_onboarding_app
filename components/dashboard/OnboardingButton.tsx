"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wrench, CheckCircle, AlertCircle } from "lucide-react";
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

  // Determine onboarding status
  const isOnboardingCompleted = tenant?.onboarding_status === "completed";
  const onboardingStep = tenant?.onboarding_step || 0;

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
    <Link
      href="/onboarding"
      className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-105"
    >
      {isOnboardingCompleted ? (
        // Connected State - Green with checkmark
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all w-full">
          <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center relative">
            <CheckCircle className="h-5 w-5 text-white" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 truncate">
              {t("dashboard.connected")}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 truncate">
              {t("dashboard.gmailConnected")}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              {t("dashboard.active")}
            </span>
          </div>
        </div>
      ) : (
        // Not Connected State - Blue with wrench icon
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all w-full">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 truncate">
              {t("dashboard.connectAccount")}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
              {t("dashboard.setupGmail")}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {t("dashboard.pending")}
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}

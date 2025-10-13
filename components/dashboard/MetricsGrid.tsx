"use client";

import { Mail, TrendingUp, Users, Eye } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface MetricsGridProps {
  stats: {
    emails_sent_today: number;
    opens_today: number;
    open_rate_today: number;
    unique_devices_today: number;
    last_updated: string;
    previous?: {
      emails_sent_today: number;
      opens_today: number;
      open_rate_today: number;
      unique_devices_today: number;
    } | null;
  };
}

export function MetricsGrid({ stats }: MetricsGridProps) {
  const { t } = useI18n();
  
  // Helper function to calculate percentage change
  const calculatePercentageChange = (current: number, previous: number | undefined): { change: string; changeType: 'positive' | 'negative' | 'neutral' } => {
    if (!previous || previous === 0) {
      return { change: "—", changeType: "neutral" };
    }
    
    const percentage = ((current - previous) / previous) * 100;
    const roundedPercentage = Math.round(percentage * 10) / 10; // Round to 1 decimal place
    
    if (roundedPercentage > 0) {
      return { change: `+${roundedPercentage}%`, changeType: "positive" };
    } else if (roundedPercentage < 0) {
      return { change: `${roundedPercentage}%`, changeType: "negative" };
    } else {
      return { change: "0%", changeType: "neutral" };
    }
  };

  const emailsChange = calculatePercentageChange(stats.emails_sent_today, stats.previous?.emails_sent_today);
  const opensChange = calculatePercentageChange(stats.opens_today, stats.previous?.opens_today);
  const openRateChange = calculatePercentageChange(stats.open_rate_today * 100, stats.previous?.open_rate_today ? stats.previous.open_rate_today * 100 : undefined);
  const devicesChange = calculatePercentageChange(stats.unique_devices_today, stats.previous?.unique_devices_today);

  const metrics = [
    {
      name: t("dashboard.emailsSentToday"),
      value: stats.emails_sent_today.toLocaleString(),
      change: emailsChange.change,
      changeType: emailsChange.changeType,
      icon: Mail,
      color: "blue" as const,
      type: "count" as const,
    },
    {
      name: t("dashboard.opensToday"),
      value: stats.opens_today.toLocaleString(),
      change: opensChange.change,
      changeType: opensChange.changeType,
      icon: Eye,
      color: "green" as const,
      type: "count" as const,
    },
    {
      name: t("dashboard.openRate"),
      value: `${(stats.open_rate_today * 100).toFixed(1)}%`,
      change: openRateChange.change,
      changeType: openRateChange.changeType,
      icon: TrendingUp,
      color: "purple" as const,
      type: "rate" as const,
    },
    {
      name: t("dashboard.uniqueDevices"),
      value: stats.unique_devices_today.toLocaleString(),
      change: devicesChange.change,
      changeType: devicesChange.changeType,
      icon: Users,
      color: "orange" as const,
      type: "count" as const,
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      bar: "bg-blue-600 dark:bg-blue-400",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
      bar: "bg-green-600 dark:bg-green-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
      bar: "bg-purple-600 dark:bg-purple-400",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      icon: "text-orange-600 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800",
      bar: "bg-orange-600 dark:bg-orange-400",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const colors = colorClasses[metric.color];
        return (
          <div
            key={metric.name}
            className={`
              bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700
              hover:shadow-lg transition-all duration-200 hover:-translate-y-1
            `}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${colors.bg} ${colors.border} border`}>
                <metric.icon className={`h-6 w-6 ${colors.icon}`} />
              </div>
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                metric.changeType === 'positive' 
                  ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30' 
                  : metric.changeType === 'negative'
                  ? 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
                  : 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30'
              }`}>
                {metric.change}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {metric.name}
              </p>
            </div>

            {/* Progress bar: solo para Open Rate */}
            {metric.type === 'rate' && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${colors.bar}`}
                    style={{ width: `${Math.min(stats.open_rate_today * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

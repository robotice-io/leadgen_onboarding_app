"use client";

import { Mail, TrendingUp, Users, Eye } from "lucide-react";

interface MetricsGridProps {
  stats: {
    emails_sent_today: number;
    opens_today: number;
    open_rate_today: number;
    unique_devices_today: number;
    last_updated: string;
  };
}

export function MetricsGrid({ stats }: MetricsGridProps) {
  const metrics = [
    {
      name: "Emails Sent Today",
      value: stats.emails_sent_today.toLocaleString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Mail,
      color: "blue",
    },
    {
      name: "Opens Today",
      value: stats.opens_today.toLocaleString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: Eye,
      color: "green",
    },
    {
      name: "Open Rate",
      value: `${(stats.open_rate_today * 100).toFixed(1)}%`,
      change: "+2.1%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "purple",
    },
    {
      name: "Unique Devices",
      value: stats.unique_devices_today.toLocaleString(),
      change: "+5%",
      changeType: "positive" as const,
      icon: Users,
      color: "orange",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      icon: "text-orange-600 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800",
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
                  : 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
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

            {/* Progress bar for visual appeal */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full ${colors.icon.replace('text-', 'bg-')}`}
                  style={{ width: `${Math.min(stats.open_rate_today * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { getLast7Days, formatDateForChart, get7DayPeriod } from "@/lib/calendar-utils";
import { useI18n } from "@/lib/i18n";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Skeleton } from "@/components/ui/Skeleton";

interface DashboardChartsProps {
  tenantId: number;
}

interface DeviceDataItem {
  name: string;
  value: number;
  color: string;
}

interface OpenRateDataItem {
  date: string;
  rate: number;
  emails: number;
  displayDate: string;  // Added for accurate calendar display
  dayName: string;       // Added for day name
  dayNumber: number;    // Added for day number
}

// Helper function to process chart data with accurate calendar information
const processChartDataWithCalendar = (apiData: any[]): OpenRateDataItem[] => {
  const last7Days = getLast7Days();
  
  // Create a map of API data by date for quick lookup
  const apiDataMap = new Map();
  apiData.forEach(item => {
    apiDataMap.set(item.date, item);
  });
  
  // Process each day with accurate calendar information
  return last7Days.map(day => {
    const apiItem = apiDataMap.get(day.date);
    
    return {
      date: day.date,
      rate: apiItem?.rate || 0,
      emails: apiItem?.emails || 0,
      displayDate: formatDateForChart(day.date, 'short'), // e.g., "Mon 15"
      dayName: day.dayName,                               // e.g., "Mon"
      dayNumber: day.dayNumber                            // e.g., 15
    };
  });
};


export function DashboardCharts({ tenantId }: DashboardChartsProps) {
  const { t } = useI18n();
  
  // Fetch real chart data from API
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['chart-data', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('No tenant ID available');
      
      // Get accurate 7-day period
      const { startDate, endDate } = get7DayPeriod();
      
      // Fetch all chart data in parallel
      const [openRateRes, deviceRes] = await Promise.all([
        apiGet(`/api/v1/dashboard/${tenantId}/charts/open-rate-trend?start_date=${startDate}&end_date=${endDate}`),
        apiGet(`/api/v1/dashboard/${tenantId}/charts/device-breakdown`)
      ]);

      if (!openRateRes.ok) throw new Error('Failed to fetch open rate trend');
      if (!deviceRes.ok) throw new Error('Failed to fetch device breakdown');

      const [openRateData, deviceData] = await Promise.all([
        openRateRes.json(),
        deviceRes.json()
      ]);

      // Process the open rate data with accurate calendar information
      const processedOpenRateData = processChartDataWithCalendar(openRateData.trend_data || []);

      return {
        openRateData: processedOpenRateData,
        deviceData: deviceData.device_breakdown || [],
        campaignData: [] // TODO: Implement campaign performance endpoint
      };
    },
    refetchInterval: 60000, // Refresh every minute
    enabled: !!tenantId,
  });

  if (isLoading) {
    return (
      <>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Open Rate Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("dashboard.openRateTrend")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("dashboard.last7Days")}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm" aria-label={t("dashboard.openRate")}> 
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">{t("dashboard.openRate")}</span>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData?.openRateData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="displayDate" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number, name: string) => [
                name === 'rate' ? `${value}%` : value,
                name === 'rate' ? t("dashboard.openRate") : t("dashboard.emailsSentToday")
              ]}
              labelFormatter={(label: any, payload: any) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return `${data.dayName}, ${data.date}`; // Show full date in tooltip
                }
                return label;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Device Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("dashboard.deviceBreakdown")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("dashboard.deviceBreakdownSubtitle")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData?.deviceData || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {(chartData?.deviceData || []).map((entry: DeviceDataItem, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value: number) => [`${value}%`, 'Share']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-6 mt-4">
          {(chartData?.deviceData || []).map((item: DeviceDataItem) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Performance - Coming Soon */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("dashboard.campaignPerformance")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("dashboard.campaignPerformanceSubtitle")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📊</div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              {t("dashboard.comingSoon")}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("dashboard.comingSoonDescription")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
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
}


export function DashboardCharts({ tenantId }: DashboardChartsProps) {
  // Fetch real chart data from API
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['chart-data', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('No tenant ID available');
      
      // Fetch all chart data in parallel
      const [openRateRes, deviceRes] = await Promise.all([
        apiGet(`/api/v1/dashboard/${tenantId}/charts/open-rate-trend?days=7`),
        apiGet(`/api/v1/dashboard/${tenantId}/charts/device-breakdown`)
      ]);

      if (!openRateRes.ok) throw new Error('Failed to fetch open rate trend');
      if (!deviceRes.ok) throw new Error('Failed to fetch device breakdown');

      const [openRateData, deviceData] = await Promise.all([
        openRateRes.json(),
        deviceRes.json()
      ]);

      return {
        openRateData: openRateData.trend_data || [],
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
              Open Rate Trend
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last 7 days performance
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Open Rate</span>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData?.openRateData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="date" 
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
                name === 'rate' ? 'Open Rate' : 'Emails Sent'
              ]}
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
              Device Breakdown
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Email opens by device type
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
              Campaign Performance
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Top performing campaigns this month
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📊</div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              Coming Soon
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Campaign performance analytics will be available soon
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

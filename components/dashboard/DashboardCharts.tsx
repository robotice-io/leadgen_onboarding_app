"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Skeleton } from "@/components/ui/Skeleton";

interface DashboardChartsProps {
  tenantId: number;
}

// Mock data for charts (replace with real API data)
const openRateData = [
  { date: "Jan 1", rate: 24.5, emails: 120 },
  { date: "Jan 2", rate: 28.2, emails: 145 },
  { date: "Jan 3", rate: 31.8, emails: 167 },
  { date: "Jan 4", rate: 29.4, emails: 134 },
  { date: "Jan 5", rate: 35.2, emails: 189 },
  { date: "Jan 6", rate: 33.7, emails: 156 },
  { date: "Jan 7", rate: 40.1, emails: 203 },
];

const deviceData = [
  { name: "Desktop", value: 45, color: "#3B82F6" },
  { name: "Mobile", value: 35, color: "#10B981" },
  { name: "Tablet", value: 20, color: "#F59E0B" },
];

const campaignData = [
  { name: "Summer Sale", opens: 245, clicks: 89, conversions: 23 },
  { name: "Product Launch", opens: 189, clicks: 67, conversions: 18 },
  { name: "Newsletter", opens: 156, clicks: 45, conversions: 12 },
  { name: "Welcome Series", opens: 134, clicks: 56, conversions: 15 },
];

export function DashboardCharts({ tenantId }: DashboardChartsProps) {
  // In a real app, fetch chart data from API
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['chart-data', tenantId],
    queryFn: async () => {
      // Mock API call - replace with real endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        openRateData,
        deviceData,
        campaignData
      };
    },
    refetchInterval: 60000, // Refresh every minute
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
          <LineChart data={openRateData}>
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
              formatter={(value: any, name: string) => [
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
                data={deviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
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
                formatter={(value: any) => [`${value}%`, 'Share']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-6 mt-4">
          {deviceData.map((item) => (
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

      {/* Campaign Performance */}
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
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Opens</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Clicks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Conversions</span>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={campaignData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Bar dataKey="opens" fill="#3B82F6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="clicks" fill="#10B981" radius={[2, 2, 0, 0]} />
            <Bar dataKey="conversions" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

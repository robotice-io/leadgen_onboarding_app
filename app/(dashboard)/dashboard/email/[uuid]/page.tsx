"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { ArrowLeft, Eye, Users, Clock, Mail, Smartphone, Monitor, Tablet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getTenant } from "@/lib/auth-client";

// Timeline/device demo data kept for visualization; real series come from API once wired

const deviceData = [
  { name: "Desktop", value: 50, color: "#3B82F6" },
  { name: "Mobile", value: 30, color: "#10B981" },
  { name: "Tablet", value: 20, color: "#F59E0B" },
];

const timelineData = [
  { time: "15:30", opens: 0 },
  { time: "15:35", opens: 1 },
  { time: "16:00", opens: 1 },
  { time: "16:20", opens: 2 },
  { time: "17:00", opens: 2 },
  { time: "17:10", opens: 3 },
  { time: "18:00", opens: 3 },
  { time: "18:45", opens: 4 },
];

export default function EmailAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const emailUuid = params.uuid as string;
  const tenant = getTenant();
  const tenantId = tenant?.tenant_id as number | undefined;

  // Fetch email analytics
  const { data: emailData, isLoading, error } = useQuery({
    queryKey: ['email-analytics', tenantId, emailUuid],
    queryFn: async () => {
      if (!tenantId) {
        throw new Error("[NO_TENANT] Tenant not found in session. Link or select a tenant.");
      }
      const res = await apiGet(`/api/v1/dashboard/${tenantId}/email/${emailUuid}`);
      if (res.status === 404) {
        const txt = await res.text();
        throw new Error(`[404] ${txt || "Email not found"}`);
      }
      if (res.status === 401 || res.status === 403) {
        const txt = await res.text();
        throw new Error(`[${res.status}] ${txt || "Not authenticated"}`);
      }
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`[${res.status}] ${txt || "Failed to fetch email analytics"}`);
      }
      return res.json();
    },
    enabled: !!tenantId && !!emailUuid,
    refetchInterval: 15000, // Poll every 15 seconds
  });

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
  };

  if (error) {
    const message = (error as Error)?.message || "Failed to load email analytics";
    const notFound = message.startsWith("[404]");
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {notFound ? "Email not found" : "Failed to load email analytics"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-3">
            {message.replace(/^\[[0-9]{3}\]\s?/, "")}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Email Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Detailed performance metrics for this email
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : emailData ? (
        <>
          {/* Email Details */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {emailData.subject}
                </h2>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {emailData.recipient}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Sent {formatDate(emailData.sent_at)}
                  </span>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getEngagementColor(emailData.engagement_score)}`}>
                {emailData.engagement_score}% Engagement
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                  <Eye className="h-5 w-5" />
                  <span className="text-2xl font-bold">{emailData.opens}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Opens</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="text-2xl font-bold">{emailData.unique_devices}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unique Devices</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-lg font-bold">
                    {emailData.last_opened_at ? formatDate(emailData.last_opened_at).split(' ')[1] : 'N/A'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Opened</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
                  <span className="text-2xl font-bold">{Math.round(emailData.opens / emailData.unique_devices * 100) / 100}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Opens/Device</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Open Timeline */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Open Timeline
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="time" 
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
                  <Line 
                    type="stepAfter" 
                    dataKey="opens" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Device Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Device Breakdown
              </h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
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
            </Card>
          </div>

          {/* Event Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Event Timeline
            </h3>
            <div className="space-y-4">
              {emailData.events.map((event, index) => {
                const DeviceIcon = getDeviceIcon(event.device_type);
                return (
                  <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <DeviceIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Email opened
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          {event.device_type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(event.opened_at)} • {event.user_agent}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      #{index + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}

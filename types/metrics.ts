// Types for Metrics API endpoints

export interface CampaignOverviewResponse {
  total_emails_sent: number;
  total_opens: number;
  unique_opens: number;
  open_rate: number; // percentage 0..100
  top_platform?: string;
  platform_distribution?: Record<string, number>;
  avg_time_to_open?: number; // minutes
  fast_response_rate?: number; // percentage 0..100
  deliverability_score?: number; // percentage 0..100
  inbox_placement_rate?: number; // percentage 0..100
  data_quality_score?: number; // percentage 0..100
  bot_filter_rate?: number; // percentage 0..100
  multi_device_rate?: number; // percentage 0..100
  engagement_depth?: number; // percentage 0..100
  performance_trend?: string;
  weekly_change?: number; // percentage delta
  key_insights?: string[];
  performance_grade?: 'A' | 'B' | 'C' | 'D' | string;
}

export interface PlatformIntelligenceResponse {
  platform_distribution: Record<string, number>;
  device_type_distribution: Record<string, number>; // desktop/mobile/unknown
  total_platforms?: number;
  most_popular_platform?: string;
  cross_platform_rate?: number;
  platform_engagement_rate?: Record<string, number>;
}

export interface TimingAnalysisResponse {
  avg_time_to_open_minutes: number;
  median_time_to_open_minutes: number;
  fast_response_rate: number;
  time_distribution: Record<'immediate' | 'fast' | 'moderate' | 'delayed', number>;
  peak_hours: Array<{ hour: number; opens_count: number; percentage: number }>;
  peak_days: Array<{ day_of_week: string; opens_count: number; percentage: number }>;
  working_hours_rate: number;
  after_hours_rate: number;
}

export interface DeliverabilityHealthResponse {
  iphone_notification_rate?: number;
  notification_to_open_conversion?: number;
  inbox_placement_score: number;
  provider_performance: Array<{
    provider: string;
    opens_count: number;
    open_rate: number;
    avg_time_to_open: number;
  }>;
  email_client_distribution: Array<{ client: string; opens_count: number; percentage: number }>;
  spam_indicator_rate: number;
}

export interface QualityResponse {
  quality_metrics: {
    real_opens_identified: number;
    iphone_notifications_filtered: number;
    bots_filtered: number;
    total_events: number;
    data_accuracy_score: number;
    filter_success_rate: number;
  };
  classification_breakdown: Record<string, number>;
  platform_accuracy: Record<string, number>;
}

export interface EngagementPatternsResponse {
  multi_device_rate: number;
  avg_devices_per_email: number;
  repeat_open_rate: number;
  engagement_depth_score: number;
  device_switching_rate: number;
  re_engagement_rate: number;
}

export interface TrendsResponse {
  daily_trends: Array<{
    date: string; // YYYY-MM-DD
    opens_count: number;
    open_rate: number;
    platform_distribution?: Record<string, number>;
  }>;
  weekly_change?: number;
  monthly_change?: number;
  best_performing_period?: string;
  worst_performing_period?: string;
  platform_shifts?: Record<string, unknown>;
}

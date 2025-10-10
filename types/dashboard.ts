export interface DashboardStats {
  tenant_id: number;
  emails_sent_today: number;
  opens_today: number;
  open_rate_today: number;
  unique_devices_today: number;
  last_updated: string;
}

export interface EmailAnalytics {
  uuid: string;
  recipient: string;
  subject: string;
  sent_at: string;
  opens: number;
  unique_devices: number;
  last_opened_at?: string;
}

export interface EmailEvent {
  id: number;
  email_uuid: string;
  opened_at: string;
  device_fingerprint: string;
  user_agent?: string;
  ip_address?: string;
}

export interface TenantConfig {
  tenant_id: number;
  name: string;
  email: string;
  slug?: string;
}

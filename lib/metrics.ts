"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiGet } from "./api";
import type {
  CampaignOverviewResponse,
  PlatformIntelligenceResponse,
  TimingAnalysisResponse,
  DeliverabilityHealthResponse,
  QualityResponse,
  EngagementPatternsResponse,
  TrendsResponse,
} from "@/types/metrics";

async function getJson<T>(url: string): Promise<T> {
  const res = await apiGet(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function useCampaignOverview(tenantId?: number, days = 30, options?: UseQueryOptions<CampaignOverviewResponse>) {
  return useQuery<CampaignOverviewResponse>({
    queryKey: ["metrics", "overview", tenantId, days],
    queryFn: () => getJson(`/metrics/${tenantId}/campaign-overview?days=${days}`),
    enabled: !!tenantId,
    staleTime: 60_000,
    refetchInterval: 60_000,
    ...options,
  });
}

export function usePlatformIntelligence(tenantId?: number, days = 30, options?: UseQueryOptions<PlatformIntelligenceResponse>) {
  return useQuery<PlatformIntelligenceResponse>({
    queryKey: ["metrics", "platform", tenantId, days],
    queryFn: () => getJson(`/metrics/${tenantId}/platform-intelligence?days=${days}`),
    enabled: !!tenantId,
    staleTime: 60_000,
    refetchInterval: 60_000,
    ...options,
  });
}

export function useTimingAnalysis(tenantId?: number, days = 30, options?: UseQueryOptions<TimingAnalysisResponse>) {
  return useQuery<TimingAnalysisResponse>({
    queryKey: ["metrics", "timing", tenantId, days],
    queryFn: () => getJson(`/metrics/${tenantId}/timing-analysis?days=${days}`),
    enabled: !!tenantId,
    staleTime: 60_000,
    refetchInterval: 60_000,
    ...options,
  });
}

export function useDeliverability(tenantId?: number, days = 30, options?: UseQueryOptions<DeliverabilityHealthResponse>) {
  return useQuery<DeliverabilityHealthResponse>({
    queryKey: ["metrics", "deliverability", tenantId, days],
    queryFn: () => getJson(`/metrics/${tenantId}/deliverability?days=${days}`),
    enabled: !!tenantId,
    staleTime: 60_000,
    refetchInterval: 60_000,
    ...options,
  });
}

export function useQuality(tenantId?: number, days = 30, options?: UseQueryOptions<QualityResponse>) {
  return useQuery<QualityResponse>({
    queryKey: ["metrics", "quality", tenantId, days],
    queryFn: () => getJson(`/metrics/${tenantId}/quality?days=${days}`),
    enabled: !!tenantId,
    staleTime: 120_000,
    refetchInterval: 120_000,
    ...options,
  });
}

export function useEngagement(tenantId?: number, days = 30, options?: UseQueryOptions<EngagementPatternsResponse>) {
  return useQuery<EngagementPatternsResponse>({
    queryKey: ["metrics", "engagement", tenantId, days],
    queryFn: () => getJson(`/metrics/${tenantId}/engagement?days=${days}`),
    enabled: !!tenantId,
    staleTime: 60_000,
    refetchInterval: 60_000,
    ...options,
  });
}

export function useTrends(tenantId?: number, days = 30, options?: UseQueryOptions<TrendsResponse>) {
  return useQuery<TrendsResponse>({
    queryKey: ["metrics", "trends", tenantId, days],
    queryFn: () => getJson(`/metrics/${tenantId}/trends?days=${days}`),
    enabled: !!tenantId,
    staleTime: 60_000,
    refetchInterval: 60_000,
    ...options,
  });
}

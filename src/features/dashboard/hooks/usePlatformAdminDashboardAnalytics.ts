import { useQuery } from "@tanstack/react-query";
import { PLATFORM_ANALYTICS_QUERY_KEYS } from "../constants/platform-analytics.constants";
import { platformAnalyticsService } from "../services/platform-analytics.service";
import type { PlatformDashboardFilters } from "../types/platform-analytics.types";

export function usePlatformAdminDashboardAnalytics(filters: PlatformDashboardFilters) {
  return useQuery({
    queryKey: PLATFORM_ANALYTICS_QUERY_KEYS.dashboard(filters),
    queryFn: () => platformAnalyticsService.getDashboardAnalytics(filters),
    staleTime: 60 * 1000, // 1 minute fresh
    retry: 1,
  });
}

import { useQuery } from "@tanstack/react-query";
import { PLATFORM_ANALYTICS_QUERY_KEYS } from "@/features/dashboard/constants/platform-analytics.constants";
import { platformAnalyticsService } from "@/features/dashboard/services/platform-analytics.service";
import type { PlatformDashboardFilters } from "@/features/dashboard/types/platform-analytics.types";

export function usePlatformAdminDashboardAnalytics(filters: PlatformDashboardFilters) {
  return useQuery({
    queryKey: PLATFORM_ANALYTICS_QUERY_KEYS.dashboard(filters),
    queryFn: () => platformAnalyticsService.getDashboardAnalytics(filters),
    staleTime: 60 * 1000, // 1 minute fresh
    retry: 1,
  });
}

import { useQuery } from "@tanstack/react-query";
import { restaurantAnalyticsApi } from "@/features/analytics/api/restaurant-analytics.api";
import {
  RESTAURANT_ANALYTICS_DEFAULTS,
  RESTAURANT_ANALYTICS_QUERY_KEYS,
} from "@/features/analytics/constants/restaurant-analytics.constants";
import type { RestaurantAnalyticsQueryParams } from "@/features/analytics/types/restaurant-analytics.types";

export function useRestaurantAnalytics(
  restaurantId: string,
  params?: RestaurantAnalyticsQueryParams,
  options?: {
    enabled?: boolean;
    autoRefresh?: boolean;
  },
) {
  const normalizedId = (restaurantId ?? "").trim();
  const shouldAutoRefresh = options?.autoRefresh ?? true;

  return useQuery({
    queryKey: RESTAURANT_ANALYTICS_QUERY_KEYS.DASHBOARD(
      normalizedId,
      params as Record<string, unknown>,
    ),
    queryFn: () => restaurantAnalyticsApi.getDashboard(normalizedId, params),
    enabled: Boolean(normalizedId) && (options?.enabled ?? true),
    staleTime: RESTAURANT_ANALYTICS_DEFAULTS.STALE_TIME_MS,
    refetchInterval: shouldAutoRefresh ? RESTAURANT_ANALYTICS_DEFAULTS.REFETCH_INTERVAL_MS : false,
    refetchOnWindowFocus: true,
  });
}

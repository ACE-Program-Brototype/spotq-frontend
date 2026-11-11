import type { SuccessResponse } from "@/components/common/types/common.types";
import { RESTAURANT_ANALYTICS_ENDPOINTS } from "@/features/analytics/constants/restaurant-analytics.constants";
import type {
  RestaurantAnalyticsDashboardResponseDto,
  RestaurantAnalyticsQueryParams,
} from "@/features/analytics/types/restaurant-analytics.types";
import { apiClient } from "@/lib/api/client";

export const restaurantAnalyticsApi = {
  /**
   * Fetches the consolidated analytics dashboard for a given restaurant.
   * Endpoint: GET /api/v1/restaurants/:restaurantId/analytics/dashboard
   */
  async getDashboard(
    restaurantId: string,
    params?: RestaurantAnalyticsQueryParams,
  ): Promise<RestaurantAnalyticsDashboardResponseDto> {
    if (!restaurantId?.trim()) {
      throw new Error("Restaurant ID is required to fetch analytics dashboard");
    }

    const searchParams: Record<string, string | number> = {};

    if (params?.interval) {
      searchParams.interval = params.interval;
    }
    if (params?.day !== undefined && params?.day !== null) {
      searchParams.day = params.day;
    }
    if (params?.month !== undefined && params?.month !== null) {
      searchParams.month = params.month;
    }
    if (params?.year !== undefined && params?.year !== null) {
      searchParams.year = params.year;
    }
    if (params?.status && params.status !== "ALL") {
      searchParams.status = params.status;
    }
    if (params?.page) {
      searchParams.page = params.page;
    }
    if (params?.limit) {
      searchParams.limit = params.limit;
    }

    const response = await apiClient
      .get(RESTAURANT_ANALYTICS_ENDPOINTS.DASHBOARD(restaurantId.trim()), {
        searchParams,
      })
      .json<SuccessResponse<RestaurantAnalyticsDashboardResponseDto>>();

    return response.data;
  },
};

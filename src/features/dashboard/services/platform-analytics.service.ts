import type { SuccessResponse } from "@/components/common";
import { apiClient } from "@/lib/api/client";
import { PLATFORM_ANALYTICS_ENDPOINTS } from "../constants/platform-analytics.constants";
import type {
  PlatformDashboardAnalyticsResponse,
  PlatformDashboardFilters,
} from "../types/platform-analytics.types";

export const platformAnalyticsService = {
  /**
   * Fetches consolidated executive analytics dashboard data for the platform superadmin.
   */
  async getDashboardAnalytics(
    filters: PlatformDashboardFilters,
  ): Promise<PlatformDashboardAnalyticsResponse> {
    const searchParams: Record<string, string | number> = {
      period: filters.period,
      billingCycle: filters.billingCycle,
    };

    if (filters.day !== undefined && filters.day !== null) {
      searchParams.day = filters.day;
    }
    if (filters.month !== undefined && filters.month !== null) {
      searchParams.month = filters.month;
    }
    if (filters.year !== undefined && filters.year !== null) {
      searchParams.year = filters.year;
    }
    if (filters.from) {
      searchParams.from = filters.from;
    }
    if (filters.to) {
      searchParams.to = filters.to;
    }

    const response = await apiClient
      .get(PLATFORM_ANALYTICS_ENDPOINTS.DASHBOARD, {
        searchParams,
      })
      .json<SuccessResponse<PlatformDashboardAnalyticsResponse>>();

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to load platform dashboard analytics");
    }

    return response.data;
  },
};

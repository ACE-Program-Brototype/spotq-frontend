import { apiClient } from "@/lib/api/client";
import {
  RESTAURANT_DEFAULTS,
  RESTAURANT_ENDPOINTS,
  RESTAURANT_FILTER_PLANS,
  RESTAURANT_FILTER_STATUS,
  RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER,
} from "../constants/restaurant.constants";
import type {
  AdminRestaurantsApiResponse,
  AdminRestaurantsListData,
  GetAdminRestaurantsParams,
  RestaurantListItem,
} from "../types/restaurant.types";

export const restaurantService = {
  /**
   * Fetch paginated restaurant records for admin with full filtering, searching, and sorting
   */
  async getAdminRestaurants(params?: GetAdminRestaurantsParams): Promise<AdminRestaurantsListData> {
    const searchParams: Record<string, string | number | boolean> = {
      page: params?.page ?? RESTAURANT_DEFAULTS.PAGE,
      limit: params?.limit ?? RESTAURANT_DEFAULTS.LIMIT,
      sort_by: params?.sort_by ?? RESTAURANT_DEFAULTS.SORT_BY,
      sort_order: params?.sort_order ?? RESTAURANT_DEFAULTS.SORT_ORDER,
    };

    if (params?.search?.trim()) {
      searchParams.search = params.search.trim();
    }

    if (params?.status && params.status !== RESTAURANT_FILTER_STATUS.ALL) {
      searchParams.status = params.status;
    }

    if (params?.plan && params.plan !== RESTAURANT_FILTER_PLANS.ALL) {
      searchParams.plan = params.plan;
    }

    if (
      params?.is_subscription_active !== undefined &&
      params.is_subscription_active !== RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER.ALL
    ) {
      searchParams.is_subscription_active =
        params.is_subscription_active === true || params.is_subscription_active === "true";
    }

    if (params?.created_from?.trim()) {
      searchParams.created_from = params.created_from.trim();
    }

    if (params?.created_to?.trim()) {
      searchParams.created_to = params.created_to.trim();
    }

    const response = await apiClient
      .get(RESTAURANT_ENDPOINTS.ADMIN_LIST, {
        searchParams,
      })
      .json<AdminRestaurantsApiResponse>();

    const rawRestaurants: RestaurantListItem[] = response?.data?.restaurants || [];

    const pagination = response?.data?.pagination ?? {
      page: params?.page ?? RESTAURANT_DEFAULTS.PAGE,
      limit: params?.limit ?? RESTAURANT_DEFAULTS.LIMIT,
      total: rawRestaurants.length,
      total_pages:
        Math.ceil(rawRestaurants.length / (params?.limit ?? RESTAURANT_DEFAULTS.LIMIT)) || 1,
      has_next_page: false,
      has_prev_page: false,
    };

    return {
      restaurants: rawRestaurants,
      pagination,
    };
  },
};

export const getAdminRestaurants = restaurantService.getAdminRestaurants;

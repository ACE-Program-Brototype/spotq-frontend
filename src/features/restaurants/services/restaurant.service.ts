import { apiClient } from "@/lib/api/client";
import {
  RESTAURANT_DEFAULTS,
  RESTAURANT_ENDPOINTS,
  RESTAURANT_FILTER_PLANS,
  RESTAURANT_FILTER_STATUS,
  RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER,
} from "../constants/restaurant.constants";
import type {
  AdminRestaurantDetailsApiResponse,
  AdminRestaurantsApiResponse,
  AdminRestaurantsListData,
  BlockRestaurantInput,
  BlockRestaurantResponse,
  GetAdminRestaurantsParams,
  RestaurantDetails,
  RestaurantListItem,
  UnblockRestaurantInput,
  UnblockRestaurantResponse,
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

  /**
   * Fetch detailed restaurant information by ID for admin
   */
  async getAdminRestaurantById(id: string): Promise<RestaurantDetails> {
    if (!id?.trim()) {
      throw new Error("Restaurant ID is required");
    }

    const response = await apiClient
      .get(RESTAURANT_ENDPOINTS.ADMIN_DETAILS(id.trim()))
      .json<AdminRestaurantDetailsApiResponse>();

    if (!response?.data) {
      throw new Error(response?.message || "Failed to retrieve restaurant details");
    }

    return response.data;
  },
  /**
   * Block an active restaurant with an administrative reason
   */
  async blockRestaurant(input: BlockRestaurantInput): Promise<BlockRestaurantResponse> {
    if (!input.restaurantId?.trim()) {
      throw new Error("Restaurant ID is required");
    }
    const trimmedReason = input.reason?.trim();
    if (!trimmedReason) {
      throw new Error("A reason is required to block a restaurant");
    }

    const response = await apiClient
      .patch(RESTAURANT_ENDPOINTS.ADMIN_BLOCK(input.restaurantId.trim()), {
        json: { reason: trimmedReason },
      })
      .json<BlockRestaurantResponse>();

    return response;
  },

  /**
   * Unblock a blocked / suspended restaurant
   */
  async unblockRestaurant(input: UnblockRestaurantInput): Promise<UnblockRestaurantResponse> {
    if (!input.restaurantId?.trim()) {
      throw new Error("Restaurant ID is required");
    }

    const response = await apiClient
      .patch(RESTAURANT_ENDPOINTS.ADMIN_UNBLOCK(input.restaurantId.trim()))
      .json<UnblockRestaurantResponse>();

    return response;
  },
};

export const getAdminRestaurants = restaurantService.getAdminRestaurants;
export const getAdminRestaurantById = restaurantService.getAdminRestaurantById;
export const blockRestaurant = restaurantService.blockRestaurant;
export const unblockRestaurant = restaurantService.unblockRestaurant;

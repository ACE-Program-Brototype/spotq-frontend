import { apiClient } from "@/lib/api/client";
import {
  CUSTOMER_RESTAURANT_DEFAULTS,
  CUSTOMER_RESTAURANT_ENDPOINTS,
} from "../constants/customer-restaurant.constants";
import type {
  CustomerRestaurantItem,
  CustomerRestaurantsApiResponse,
  CustomerRestaurantsListData,
  GetCustomerRestaurantsParams,
} from "../types/customer-restaurant.types";
import type { CustomerRestaurantDetails } from "../types/customer-restaurant-details.types";

export const customerRestaurantService = {
  /**
   * Fetches paginated restaurant list for customers with optional search, category, and sorting filters.
   */
  async getRestaurants(
    params?: GetCustomerRestaurantsParams,
  ): Promise<CustomerRestaurantsListData> {
    const searchParams: Record<string, string | number> = {
      page: params?.page ?? CUSTOMER_RESTAURANT_DEFAULTS.PAGE,
      limit: params?.limit ?? CUSTOMER_RESTAURANT_DEFAULTS.LIMIT,
      sortBy: params?.sortBy ?? CUSTOMER_RESTAURANT_DEFAULTS.SORT_BY,
      sortOrder: params?.sortOrder ?? CUSTOMER_RESTAURANT_DEFAULTS.SORT_ORDER,
    };

    if (params?.search?.trim()) {
      searchParams.search = params.search.trim();
    }

    if (params?.city?.trim()) {
      searchParams.city = params.city.trim();
    }

    if (params?.cuisine?.trim() && params.cuisine.trim().toLowerCase() !== "all") {
      searchParams.cuisine = params.cuisine.trim();
    }

    if (params?.foodItem?.trim()) {
      searchParams.foodItem = params.foodItem.trim();
    }

    if (typeof params?.minRating === "number") {
      searchParams.minRating = params.minRating;
    }

    if (typeof params?.minPrice === "number") {
      searchParams.minPrice = params.minPrice;
    }

    if (typeof params?.maxPrice === "number") {
      searchParams.maxPrice = params.maxPrice;
    }

    const response = await apiClient
      .get(CUSTOMER_RESTAURANT_ENDPOINTS.LIST, {
        searchParams })
      .json<CustomerRestaurantsApiResponse>();

    const restaurants: CustomerRestaurantItem[] = Array.isArray(response?.data)
      ? response.data
      : [];

    return {
      restaurants,
      pagination: response?.pagination ?? {
        page: Number(searchParams.page) || 1,
        limit: Number(searchParams.limit) || 8,
        total: restaurants.length,
        totalPages: 1,
      },
    };
  },

  async getRestaurantDetails(
    restaurantId: string,
    includeMenu = true,
    signal?: AbortSignal,
  ): Promise<CustomerRestaurantDetails> {
    const response = await apiClient
      .get(CUSTOMER_RESTAURANT_ENDPOINTS.DETAILS(restaurantId), {
        searchParams: {
          includeMenu: String(includeMenu),
        },
        signal,
      })
      .json<{ success: boolean; data: CustomerRestaurantDetails }>();

    return response.data;
  },
};

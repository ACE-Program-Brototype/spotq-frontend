/**
 * Staff Menu Service
 * Consumes GET /restaurants/:restaurantId/staff/menu/items for staff operational view.
 */

import { apiClient } from "@/lib/api/client";
import { MENU_ENDPOINTS } from "../constants/menu.constants";
import type {
  StaffMenuItemsApiResponse,
  StaffMenuItemsQueryParams,
  StaffMenuItemsResponse,
} from "../types/staff-menu-item.types";

export const staffMenuService = {
  /**
   * Fetches real-time operational menu items for restaurant staff.
   * Calls: GET /api/v1/restaurants/{restaurantId}/staff/menu/items
   */
  async getStaffMenuItems(
    restaurantId: string,
    params?: StaffMenuItemsQueryParams,
  ): Promise<StaffMenuItemsResponse> {
    if (!restaurantId) {
      return {
        restaurantId: "",
        page: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 0,
        items: [],
      };
    }

    const searchParams: Record<string, string | number | boolean> = {};

    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;
    if (params?.search && params.search.trim() !== "") {
      searchParams.search = params.search.trim();
    }
    if (params?.categoryId && params.categoryId !== "ALL") {
      searchParams.categoryId = params.categoryId;
    }
    if (typeof params?.isAvailable === "boolean") {
      searchParams.isAvailable = params.isAvailable;
    }
    if (typeof params?.includeInactive === "boolean") {
      searchParams.includeInactive = params.includeInactive;
    }
    if (typeof params?.includeVariants === "boolean") {
      searchParams.includeVariants = params.includeVariants;
    }
    if (params?.sortBy) {
      searchParams.sortBy = params.sortBy;
    }
    if (params?.sortOrder) {
      searchParams.sortOrder = params.sortOrder;
    }

    const response = await apiClient
      .get(MENU_ENDPOINTS.STAFF_ITEMS(restaurantId), {
        searchParams: Object.keys(searchParams).length > 0 ? searchParams : undefined,
      })
      .json<StaffMenuItemsApiResponse>();

    return (
      response.data ?? {
        restaurantId,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalCount: 0,
        totalPages: 0,
        items: [],
      }
    );
  },

  /**
   * Fetches menu categories for restaurant staff.
   * Calls: GET /api/v1/restaurants/{restaurantId}/staff/menu/categories
   */
  async getStaffCategories(
    restaurantId: string,
  ): Promise<import("../types/menu-category.types").MenuCategory[]> {
    if (!restaurantId) return [];

    const response = await apiClient
      .get(MENU_ENDPOINTS.STAFF_CATEGORIES(restaurantId))
      .json<import("../types/menu-category.types").MenuCategoriesListApiResponse>();

    const rawData = response?.data;
    if (Array.isArray(rawData)) {
      return rawData;
    }

    if (
      rawData &&
      typeof rawData === "object" &&
      "categories" in rawData &&
      Array.isArray(rawData.categories)
    ) {
      const activeRestaurantId = rawData.restaurantId || restaurantId;
      return rawData.categories.map((cat) => ({
        ...cat,
        restaurantId: cat.restaurantId || activeRestaurantId,
      }));
    }

    return [];
  },
};

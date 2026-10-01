/**
 * Menu Item Service
 * Handles API communication for restaurant menu items via SpotQ HTTP client.
 */

import { apiClient } from "@/lib/api/client";
import { MENU_ENDPOINTS } from "../constants/menu.constants";
import type {
  ListMenuItemsApiResponse,
  ListMenuItemsData,
  ListMenuItemsQueryParams,
} from "../types/menu-item.types";

export const menuItemService = {
  /**
   * Fetches paginated list of menu items along with summary statistics.
   * Calls: GET /api/v1/restaurants/{restaurantId}/menu/items
   */
  async getMenuItems(
    restaurantId: string,
    params?: ListMenuItemsQueryParams,
  ): Promise<ListMenuItemsData> {
    if (!restaurantId) {
      return {
        stats: {
          totalCategories: 0,
          totalMenuItems: 0,
          availableItems: 0,
          outOfStockItems: 0,
        },
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    const searchParams: Record<string, string | number | boolean> = {};

    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;
    if (params?.search && params.search.trim() !== "") searchParams.search = params.search.trim();
    if (params?.categoryId && params.categoryId !== "ALL")
      searchParams.categoryId = params.categoryId;
    if (params?.status && params.status !== "ALL") searchParams.status = params.status;
    if (
      params?.minPrice !== undefined &&
      params.minPrice !== null &&
      !Number.isNaN(params.minPrice)
    )
      searchParams.minPrice = params.minPrice;
    if (
      params?.maxPrice !== undefined &&
      params.maxPrice !== null &&
      !Number.isNaN(params.maxPrice)
    )
      searchParams.maxPrice = params.maxPrice;

    if (params?.isVegetarian !== undefined && params.isVegetarian !== null)
      searchParams.isVegetarian = params.isVegetarian;
    if (params?.isFeatured !== undefined && params.isFeatured !== null)
      searchParams.isFeatured = params.isFeatured;
    if (params?.sortBy) searchParams.sortBy = params.sortBy;
    if (params?.sortOrder) searchParams.sortOrder = params.sortOrder;

    const response = await apiClient
      .get(MENU_ENDPOINTS.ITEMS(restaurantId), {
        searchParams: Object.keys(searchParams).length > 0 ? searchParams : undefined,
      })
      .json<ListMenuItemsApiResponse>();

    return (
      response.data ?? {
        stats: {
          totalCategories: 0,
          totalMenuItems: 0,
          availableItems: 0,
          outOfStockItems: 0,
        },
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }
    );
  },

  /**
   * Soft deletes a menu item.
   * Calls: DELETE /api/v1/restaurants/{restaurantId}/menu/items/{menuItemId}
   */
  async deleteMenuItem(restaurantId: string, menuItemId: string): Promise<void> {
    if (!restaurantId || !menuItemId) return;
    await apiClient.delete(MENU_ENDPOINTS.ITEM_DETAIL(restaurantId, menuItemId));
  },
};

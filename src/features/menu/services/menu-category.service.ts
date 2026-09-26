/**
 * Menu Category Service
 * Handles API communication for menu categories via SpotQ HTTP client.
 */

import { apiClient } from "@/lib/api/client";
import { MENU_ENDPOINTS } from "../constants/menu.constants";
import type {
  MenuCategoriesListApiResponse,
  MenuCategory,
  MenuCategoryApiResponse,
  UpdateMenuCategoryPayload,
} from "../types/menu-category.types";

export const menuCategoryService = {
  /**
   * Fetches existing menu categories for a restaurant directly from the API.
   * Lets errors bubble up so React Query surfaces the error state / retry actions.
   */
  async getCategories(restaurantId: string): Promise<MenuCategory[]> {
    if (!restaurantId) return [];

    const response = await apiClient
      .get(MENU_ENDPOINTS.CATEGORIES(restaurantId))
      .json<MenuCategoriesListApiResponse>();

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

  /**
   * Updates an existing menu category.
   * Calls: PATCH /api/v1/restaurants/{restaurantId}/menu/categories/{categoryId}
   * Sends only the fields supported by the backend API.
   */
  async updateCategory(
    restaurantId: string,
    categoryId: string,
    payload: UpdateMenuCategoryPayload,
  ): Promise<MenuCategory> {
    const response = await apiClient
      .patch(MENU_ENDPOINTS.CATEGORY_UPDATE(restaurantId, categoryId), {
        json: {
          name: payload.name,
          description: payload.description,
          displayOrder: payload.displayOrder,
          isActive: payload.isActive,
        },
      })
      .json<MenuCategoryApiResponse>();

    return response.data;
  },
};

/**
 * Menu Category Service
 * Handles API communication for menu categories via SpotQ HTTP client.
 */

import { apiClient } from "@/lib/api/client";
import { DUMMY_CATEGORIES, MENU_ENDPOINTS } from "../constants/menu.constants";
import type {
  MenuCategoriesListApiResponse,
  MenuCategory,
  MenuCategoryApiResponse,
  UpdateMenuCategoryPayload,
} from "../types/menu-category.types";

export const menuCategoryService = {
  /**
   * Fetches existing menu categories for a restaurant.
   * If backend listing API is not yet available, returns dummy categories with target IDs for testing.
   */
  async getCategories(restaurantId: string): Promise<MenuCategory[]> {
    if (!restaurantId) return [];

    try {
      const response = await apiClient
        .get(MENU_ENDPOINTS.CATEGORIES(restaurantId))
        .json<MenuCategoriesListApiResponse>();

      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch {
      // Listing API not yet mounted on backend, fallback to testing dummy data
    }

    return DUMMY_CATEGORIES.map((cat) => ({
      ...cat,
      restaurantId,
    }));
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

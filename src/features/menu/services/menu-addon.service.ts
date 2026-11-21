/**
 * Menu Addon Service
 * Handles API calls for restaurant menu add-ons and modifiers.
 */

import { MENU_ENDPOINTS, MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import type {
  CreateAddonPayload,
  MenuAddon,
  UpdateAddonPayload,
} from "@/features/menu/types/menu.types";
import { apiClient } from "@/lib/api/client";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const menuAddonService = {
  /**
   * Fetch all available add-ons for a restaurant
   */
  async getAddons(restaurantId: string): Promise<MenuAddon[]> {
    if (!restaurantId) return [];

    const response = await apiClient
      .get(MENU_ENDPOINTS.ADDONS(restaurantId))
      .json<ApiResponse<MenuAddon[]> | MenuAddon[]>();

    if (Array.isArray(response)) {
      return response;
    }
    return Array.isArray(response?.data) ? response.data : [];
  },

  /**
   * Create a new add-on for a restaurant
   */
  async createAddon(restaurantId: string, payload: CreateAddonPayload): Promise<MenuAddon> {
    const response = await apiClient
      .post(MENU_ENDPOINTS.ADDONS(restaurantId), {
        json: {
          name: payload.name.trim(),
          description: payload.description?.trim() || null,
          price: Number(payload.price),
          imageKey: payload.imageKey || null,
          isAvailable: payload.isAvailable ?? true,
        },
      })
      .json<ApiResponse<MenuAddon>>();

    if (!response.success) {
      throw new Error(response.message || MENU_MESSAGES.ADDON_CREATE_FAILED);
    }

    return response.data;
  },

  /**
   * Update an existing add-on for a restaurant
   */
  async updateAddon(
    restaurantId: string,
    addonId: string,
    payload: UpdateAddonPayload,
  ): Promise<MenuAddon> {
    const jsonBody: UpdateAddonPayload = {};

    if (payload.name !== undefined) jsonBody.name = payload.name.trim();
    if (payload.description !== undefined)
      jsonBody.description = payload.description ? payload.description.trim() : null;
    if (payload.price !== undefined) jsonBody.price = payload.price;
    if (payload.imageKey !== undefined) jsonBody.imageKey = payload.imageKey || null;
    if (payload.isAvailable !== undefined) jsonBody.isAvailable = payload.isAvailable;

    const response = await apiClient
      .patch(MENU_ENDPOINTS.ADDON_DETAIL(restaurantId, addonId), {
        json: jsonBody,
      })
      .json<ApiResponse<MenuAddon>>();

    if (!response.success) {
      throw new Error(response.message || MENU_MESSAGES.ADDON_UPDATE_FAILED);
    }

    return response.data;
  },

  async deleteAddon(restaurantId: string, addonId: string): Promise<void> {
    const response = await apiClient
      .delete(MENU_ENDPOINTS.ADDON_DETAIL(restaurantId, addonId))
      .json<ApiResponse<null>>();

    if (!response.success) {
      throw new Error(response.message || MENU_MESSAGES.ADDON_DELETE_FAILED);
    }
  },
};

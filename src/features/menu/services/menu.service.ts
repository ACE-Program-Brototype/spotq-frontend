/**
 * Menu API Service
 * Handles API calls for menu items, categories, variants, and add-ons.
 */

import { MENU_ENDPOINTS, MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import type {
  CreateAddonPayload,
  CreateCategoryPayload,
  CreateMenuItemPayload,
  MenuAddon,
  MenuCategory,
  MenuItemResponse,
} from "@/features/menu/types/menu.types";
import { apiClient } from "@/lib/api/client";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const menuService = {
  /**
   * Fetch all categories for a restaurant
   */
  async getCategories(restaurantId: string): Promise<MenuCategory[]> {
    if (!restaurantId) return [];

    try {
      const response = await apiClient
        .get(MENU_ENDPOINTS.CATEGORIES(restaurantId))
        .json<ApiResponse<MenuCategory[]> | MenuCategory[]>();

      if (Array.isArray(response)) {
        return response;
      }
      return Array.isArray(response?.data) ? response.data : [];
    } catch {
      return [];
    }
  },

  /**
   * Create a new category for a restaurant
   */
  async createCategory(
    restaurantId: string,
    payload: CreateCategoryPayload,
  ): Promise<MenuCategory> {
    const response = await apiClient
      .post(MENU_ENDPOINTS.CATEGORIES(restaurantId), {
        json: {
          name: payload.name.trim(),
          description: payload.description?.trim() || null,
          displayOrder: payload.displayOrder ?? 0,
        },
      })
      .json<ApiResponse<MenuCategory>>();

    if (!response.success && response.message) {
      throw new Error(response.message);
    }

    return response.data;
  },

  /**
   * Fetch all available add-ons for a restaurant
   */
  async getAddons(restaurantId: string): Promise<MenuAddon[]> {
    if (!restaurantId) return [];

    try {
      const response = await apiClient
        .get(MENU_ENDPOINTS.ADDONS(restaurantId))
        .json<ApiResponse<MenuAddon[]> | MenuAddon[]>();

      if (Array.isArray(response)) {
        return response;
      }
      return Array.isArray(response?.data) ? response.data : [];
    } catch {
      return [];
    }
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

    if (!response.success && response.message) {
      throw new Error(response.message);
    }

    return response.data;
  },

  /**
   * Create a new menu item with nested variants and linked addons
   */
  async createMenuItem(
    restaurantId: string,
    payload: CreateMenuItemPayload,
  ): Promise<MenuItemResponse> {
    const defaultVariant = payload.variants.find((v) => v.isDefault) ?? payload.variants[0];
    const calculatedPrice =
      payload.price !== undefined
        ? Number(payload.price)
        : defaultVariant
          ? Number(defaultVariant.price)
          : 0;

    const formattedAddons = payload.addons?.map((addon) => ({
      addonId: addon.addonId,
      ...(addon.priceOverride !== undefined ? { priceOverride: Number(addon.priceOverride) } : {}),
    }));

    const images = payload.imageUrl
      ? [{ objectKey: payload.imageUrl, displayOrder: 0 }]
      : undefined;

    const isVegetarian = payload.dietaryType === "VEG" || payload.dietaryType === "VEGAN";

    const response = await apiClient
      .post(MENU_ENDPOINTS.ITEMS(restaurantId), {
        json: {
          name: payload.name.trim(),
          categoryId: payload.categoryId,
          description: payload.description?.trim() || null,
          price: calculatedPrice,
          isVegetarian,
          preparationTime: payload.preparationTime ? Number(payload.preparationTime) : null,
          isAvailable: payload.isAvailable ?? true,
          ...(images ? { images } : {}),
          variants: payload.variants.map((v) => ({
            name: v.portion ? `${v.name.trim()} (${v.portion.trim()})` : v.name.trim(),
            price: Number(v.price),
            sku: v.sku?.trim() || null,
            isDefault: Boolean(v.isDefault),
          })),
          ...(formattedAddons && formattedAddons.length > 0 ? { addons: formattedAddons } : {}),
          ...(payload.addonIds && payload.addonIds.length > 0
            ? { addonIds: payload.addonIds }
            : {}),
        },
      })
      .json<ApiResponse<MenuItemResponse>>();

    if (!response.success && response.message) {
      throw new Error(response.message || MENU_MESSAGES.ITEM_CREATE_FAILED);
    }

    return response.data;
  },
};

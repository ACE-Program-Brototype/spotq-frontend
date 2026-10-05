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
  MenuItemDetails,
  MenuItemResponse,
  UpdateMenuItemPayload,
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

    const response = await apiClient
      .get(MENU_ENDPOINTS.CATEGORIES(restaurantId))
      .json<ApiResponse<MenuCategory[]> | MenuCategory[]>();

    if (Array.isArray(response)) {
      return response;
    }
    return Array.isArray(response?.data) ? response.data : [];
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

    if (!response.success) {
      throw new Error(response.message || MENU_MESSAGES.CATEGORY_CREATE_FAILED);
    }

    return response.data;
  },

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

    const images = payload.imageUrl?.trim()
      ? [{ objectKey: payload.imageUrl.trim(), displayOrder: 0 }]
      : [];

    const isVegetarian = payload.dietaryType === "VEG";

    const response = await apiClient
      .post(MENU_ENDPOINTS.ITEMS(restaurantId), {
        json: {
          name: payload.name.trim(),
          categoryId: payload.categoryId,
          description: (payload.description || "").trim(),
          price: calculatedPrice,
          isVegetarian,
          preparationTime: Number(payload.preparationTime || 0),
          isAvailable: payload.isAvailable ?? true,
          images,
          variants: payload.variants.map((v) => ({
            name: v.portion ? `${v.name.trim()} (${v.portion.trim()})` : v.name.trim(),
            price: Number(v.price),
            sku: v.sku?.trim() || null,
            isDefault: Boolean(v.isDefault),
          })),
          ...(formattedAddons && formattedAddons.length > 0 ? { addons: formattedAddons } : {}),
        },
      })
      .json<ApiResponse<MenuItemResponse>>();

    if (!response.success) {
      throw new Error(response.message || MENU_MESSAGES.ITEM_CREATE_FAILED);
    }

    return response.data;
  },

  /**
   * Fetch single menu item details for restaurant owner/admin
   */
  async getMenuItem(restaurantId: string, menuItemId: string): Promise<MenuItemDetails> {
    if (!restaurantId || !menuItemId) {
      throw new Error(MENU_MESSAGES.RESTAURANT_OR_ITEM_ID_REQUIRED);
    }

    const response = await apiClient
      .get(MENU_ENDPOINTS.ITEM_DETAIL(restaurantId, menuItemId))
      .json<ApiResponse<MenuItemDetails>>();

    if (!response.success) {
      throw new Error(response.message || MENU_MESSAGES.ITEMS_FETCH_ERROR);
    }

    return response.data;
  },

  /**
   * Update an existing menu item
   */
  async updateMenuItem(
    restaurantId: string,
    menuItemId: string,
    payload: UpdateMenuItemPayload,
  ): Promise<MenuItemResponse> {
    if (!restaurantId || !menuItemId) {
      throw new Error(MENU_MESSAGES.RESTAURANT_OR_ITEM_ID_REQUIRED);
    }

    const defaultVariant = payload.variants?.find((v) => v.isDefault) ?? payload.variants?.[0];
    const calculatedPrice =
      payload.price !== undefined
        ? Number(payload.price)
        : defaultVariant
          ? Number(defaultVariant.price)
          : undefined;

    const formattedAddons = payload.addons?.map((addon) => ({
      addonId: addon.addonId,
      ...(addon.priceOverride === null
        ? { priceOverride: null }
        : addon.priceOverride !== undefined
          ? { priceOverride: Number(addon.priceOverride) }
          : {}),
    }));

    let images: Array<{ id?: string; objectKey: string; displayOrder: number }> | undefined;
    if (payload.images !== undefined) {
      images = payload.images.map((img, idx) => ({
        ...(img.id ? { id: img.id } : {}),
        objectKey: img.objectKey.trim(),
        displayOrder: img.displayOrder ?? idx,
      }));
    } else if (payload.imageUrl !== undefined) {
      images = payload.imageUrl?.trim()
        ? [{ objectKey: payload.imageUrl.trim(), displayOrder: 0 }]
        : [];
    }

    const isVegetarian =
      payload.dietaryType !== undefined
        ? payload.dietaryType === "VEG"
        : payload.isVegetarian !== undefined
          ? payload.isVegetarian
          : undefined;

    const formattedVariants = payload.variants?.map((v) => ({
      ...(v.id ? { id: v.id } : {}),
      name: v.portion?.trim() ? `${v.name.trim()} (${v.portion.trim()})` : v.name.trim(),
      price: Number(v.price),
      sku: v.sku?.trim() || null,
      isDefault: Boolean(v.isDefault),
      isAvailable: v.isAvailable ?? true,
    }));

    const response = await apiClient
      .put(MENU_ENDPOINTS.ITEM_DETAIL(restaurantId, menuItemId), {
        json: {
          ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
          ...(payload.categoryId !== undefined ? { categoryId: payload.categoryId } : {}),
          ...(payload.description !== undefined
            ? { description: payload.description ? payload.description.trim() : null }
            : {}),
          ...(calculatedPrice !== undefined ? { price: calculatedPrice } : {}),
          ...(isVegetarian !== undefined ? { isVegetarian } : {}),
          ...(payload.preparationTime !== undefined
            ? {
                preparationTime:
                  payload.preparationTime !== null && payload.preparationTime !== undefined
                    ? Number(payload.preparationTime)
                    : null,
              }
            : {}),
          ...(payload.isAvailable !== undefined ? { isAvailable: payload.isAvailable } : {}),
          ...(payload.isFeatured !== undefined ? { isFeatured: payload.isFeatured } : {}),
          ...(images !== undefined ? { images } : {}),
          ...(formattedVariants !== undefined ? { variants: formattedVariants } : {}),
          ...(formattedAddons !== undefined ? { addons: formattedAddons } : {}),
        },
      })
      .json<ApiResponse<MenuItemResponse>>();

    if (!response.success) {
      throw new Error(response.message || MENU_MESSAGES.ITEM_UPDATE_FAILED);
    }

    return response.data;
  },
};

/**
 * Menu Category Constants
 * API endpoints, validation messages, and query keys.
 */

export const MENU_ENDPOINTS = {
  CATEGORIES: (restaurantId: string) => `restaurants/${restaurantId}/menu/categories`,
  CATEGORY_UPDATE: (restaurantId: string, categoryId: string) =>
    `restaurants/${restaurantId}/menu/categories/${categoryId}`,
} as const;

export const MENU_MESSAGES = {
  UPDATE_SUCCESS: "Menu category updated successfully.",
  UPDATE_ERROR: "Unable to update menu category. Please try again.",
  NAME_REQUIRED: "Category name cannot be empty.",
  NAME_MAX_LENGTH: "Category name must not exceed 255 characters.",
  DESCRIPTION_MAX_LENGTH: "Description must not exceed 1000 characters.",
  DISPLAY_ORDER_INVALID: "Display order must be a valid non-negative integer.",
  STATUS_INVALID: "Status must be valid.",
  RESTAURANT_ID_REQUIRED: "Restaurant ID is required.",
  FETCH_ERROR: "Failed to load menu categories.",
} as const;

export const MENU_CATEGORIES_QUERY_KEY = "menu-categories" as const;

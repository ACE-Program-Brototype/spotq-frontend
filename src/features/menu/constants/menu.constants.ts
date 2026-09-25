/**
 * Menu Category Constants
 * API endpoints, validation messages, query keys, and dummy data for testing.
 */

import type { MenuCategory } from "../types/menu-category.types";

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
  DESCRIPTION_REQUIRED: "Description cannot be empty.",
  DESCRIPTION_MAX_LENGTH: "Description must not exceed 1000 characters.",
  DISPLAY_ORDER_INVALID: "Display order must be a valid positive integer.",
  STATUS_INVALID: "Status must be valid.",
  RESTAURANT_ID_REQUIRED: "Restaurant ID is required.",
  FETCH_ERROR: "Failed to load menu categories.",
} as const;

export const MENU_CATEGORIES_QUERY_KEY = "menu-categories" as const;

/**
 * Dummy categories configured with existing category IDs for testing the PATCH update API.
 */
export const DUMMY_CATEGORIES: MenuCategory[] = [
  {
    id: "c7bc54b5-f077-4c81-a8ff-d4cb69643fc8",
    restaurantId: "05b1dfad-9fa2-4d78-82cf-bb44afc0d5ef",
    name: "Starters",
    description: "Crispy appetizers and starter delicacies.",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "472be91d-c952-42f6-8931-36ff5f1e91f2",
    restaurantId: "05b1dfad-9fa2-4d78-82cf-bb44afc0d5ef",
    name: "Main Course",
    description: "Chef specialty mains and seasonal entrees.",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "d57c2f05-4202-4f6f-8a02-21412c31ff59",
    restaurantId: "05b1dfad-9fa2-4d78-82cf-bb44afc0d5ef",
    name: "Desserts & Drinks",
    description: "Sweet desserts, milkshakes, and refreshing mocktails.",
    displayOrder: 3,
    isActive: false,
  },
];

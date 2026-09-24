/**
 * Menu Feature Type Definitions
 */

import type { DietaryType } from "@/features/menu/constants/menu.constants";

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuAddon {
  id: string;
  restaurantId: string;
  name: string;
  description?: string | null;
  price: number;
  imageKey?: string | null;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItemVariantInput {
  name: string;
  portion: string;
  price: number;
  sku?: string;
  isDefault: boolean;
  isAvailable: boolean;
}

export interface MenuItemAddonLinkInput {
  addonId: string;
  priceOverride?: number;
}

export interface CreateMenuItemPayload {
  price?: number;
  name: string;
  categoryId: string;
  description?: string;
  dietaryType: DietaryType;
  preparationTime?: number;
  imageUrl?: string;
  isAvailable: boolean;
  variants: MenuItemVariantInput[];
  addons?: MenuItemAddonLinkInput[];
  addonIds?: string[];
}

export interface MenuItemResponse {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string | null;
  dietaryType: DietaryType;
  preparationTime?: number | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  variants: Array<{
    id: string;
    menuItemId: string;
    name: string;
    portion: string;
    price: number;
    sku?: string | null;
    isDefault: boolean;
    isAvailable: boolean;
  }>;
  addons?: Array<{
    id: string;
    addonId: string;
    priceOverride?: number | null;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateAddonPayload {
  name: string;
  description?: string;
  price: number;
  imageKey?: string;
  isAvailable?: boolean;
}

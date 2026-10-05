import type { DietaryType } from "@/features/menu/constants/menu.constants";
import type { MenuItemDetailAddon, MenuItemDetailVariant } from "./menu-item.types";

export type { MenuCategory } from "./menu-category.types";
export type {
  MenuItemDetail,
  MenuItemDetailAddon,
  MenuItemDetailVariant,
} from "./menu-item.types";

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
  variants: MenuItemDetailVariant[];
  addons?: MenuItemDetailAddon[];
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

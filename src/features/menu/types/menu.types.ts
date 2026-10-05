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
  id?: string;
  name: string;
  portion: string;
  price: number;
  sku?: string;
  isDefault: boolean;
  isAvailable: boolean;
}

export interface MenuItemAddonLinkInput {
  addonId: string;
  priceOverride?: number | null;
}

export interface MenuItemImageInput {
  id?: string;
  objectKey: string;
  displayOrder?: number;
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

export interface UpdateMenuItemPayload {
  price?: number;
  name?: string;
  categoryId?: string;
  description?: string | null;
  dietaryType?: DietaryType;
  isVegetarian?: boolean;
  preparationTime?: number | null;
  imageUrl?: string | null;
  images?: MenuItemImageInput[];
  isAvailable?: boolean;
  isFeatured?: boolean;
  variants?: MenuItemVariantInput[];
  addons?: MenuItemAddonLinkInput[];
}

export interface MenuItemDetailCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface MenuItemDetailImage {
  id: string;
  objectKey: string;
  displayOrder: number;
}

export interface MenuItemDetailVariant {
  id: string;
  sku: string | null;
  name: string;
  price: number;
  isDefault: boolean;
  isAvailable: boolean;
}

export interface MenuItemDetailAddon {
  id: string;
  addonId: string;
  name: string;
  description: string | null;
  price: number;
  priceOverride: number | null;
  imageKey: string | null;
  isAvailable: boolean;
}

export interface MenuItemDetails {
  id: string;
  restaurantId: string;
  categoryId: string;
  categoryName: string;
  category: MenuItemDetailCategory | null;
  name: string;
  description: string | null;
  price: number;
  preparationTime: number | null;
  calories: number | null;
  isVegetarian: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  images: MenuItemDetailImage[];
  variants: MenuItemDetailVariant[];
  addons: MenuItemDetailAddon[];
  createdAt: string;
  updatedAt: string;
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

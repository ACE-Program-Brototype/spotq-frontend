/**
 * Menu Item Types & Interfaces
 * Data contracts matching spotq-restaurant-service API.
 */

export type MenuItemSortBy = "name" | "price" | "createdAt";
export type MenuItemSortOrder = "asc" | "desc" | "ASC" | "DESC";
export type MenuItemStatusFilter = "ALL" | "AVAILABLE" | "OUT_OF_STOCK";

export interface MenuItemSummary {
  id: string;
  restaurantId: string;
  categoryId: string;
  categoryName: string;
  name: string;
  price: number;
  isVegetarian: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemStats {
  totalCategories: number;
  totalMenuItems: number;
  availableItems: number;
  outOfStockItems: number;
}

export interface MenuItemPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ListMenuItemsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: MenuItemStatusFilter;
  minPrice?: number;
  maxPrice?: number;
  isVegetarian?: boolean;
  isFeatured?: boolean;
  sortBy?: MenuItemSortBy;
  sortOrder?: MenuItemSortOrder;
}

export interface ListMenuItemsData {
  stats: MenuItemStats;
  items: MenuItemSummary[];
  pagination: MenuItemPagination;
}

export interface ListMenuItemsApiResponse {
  success: boolean;
  message: string;
  data: ListMenuItemsData;
}

export interface MenuItemDetailVariant {
  id: string;
  menuItemId?: string;
  name: string;
  portion?: string | null;
  price: number;
  sku?: string | null;
  isDefault: boolean;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItemDetailAddon {
  id: string;
  addonId: string;
  name?: string;
  description?: string | null;
  price?: number;
  priceOverride?: number | null;
  isAvailable?: boolean;
  imageKey?: string | null;
}

export interface MenuItemDetail {
  id: string;
  restaurantId: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  description?: string | null;
  dietaryType?: "VEG" | "NON_VEG" | "EGG";
  isVegetarian: boolean;
  price: number;
  preparationTime?: number | null;
  imageUrl?: string | null;
  image?: string | null;
  images?: Array<{ objectKey?: string; url?: string; displayOrder?: number }>;
  isAvailable: boolean;
  isFeatured?: boolean;
  variants: MenuItemDetailVariant[];
  addons?: MenuItemDetailAddon[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GetMenuItemApiResponse {
  success: boolean;
  message?: string;
  data: MenuItemDetail;
}

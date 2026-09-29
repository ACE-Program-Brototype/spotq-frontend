/**
 * Menu Item Types & Interfaces
 * Data contracts matching spotq-restaurant-service API.
 */

export type MenuItemSortBy = "name" | "price" | "createdAt" | "category";
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

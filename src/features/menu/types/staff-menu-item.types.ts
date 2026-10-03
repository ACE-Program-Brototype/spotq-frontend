/**
 * Staff Menu Item Types & Interfaces
 * Matches spotq-restaurant-service GET /restaurants/:restaurantId/staff/menu/items
 */

export interface StaffMenuItemVariant {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  isDefault: boolean;
  isAvailable: boolean;
}

export interface StaffMenuItem {
  id: string;
  name: string;
  sku: string | null;
  description: string | null;
  basePrice: number;
  image?: string | null;
  imageUrl?: string | null;
  categoryId: string;
  categoryName: string;
  displayOrder: number;
  isActive: boolean;
  isAvailable: boolean;
  unavailabilityReason: string | null;
  autoResetAt: string | null;
  variantCount: number;
  hasVariants: boolean;
  variants: StaffMenuItemVariant[];
  updatedAt: string;
}

export interface StaffMenuItemsResponse {
  restaurantId: string;
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  items: StaffMenuItem[];
}

export interface StaffMenuItemsApiResponse {
  success: boolean;
  message: string;
  data: StaffMenuItemsResponse;
}

export type StaffMenuAvailabilityFilter = "ALL" | "AVAILABLE" | "UNAVAILABLE";

export type StaffMenuSortOption =
  | "createdAt"
  | "price"
  | "displayOrder"
  | "name"
  | "first_created"
  | "last_created";

export interface StaffMenuItemsQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  isAvailable?: boolean;
  includeInactive?: boolean;
  includeVariants?: boolean;
  search?: string;
  sortBy?: StaffMenuSortOption | string;
  sortOrder?: "asc" | "desc";
}

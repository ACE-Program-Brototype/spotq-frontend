export interface CustomerRestaurantItem {
  id: string;
  restaurantName: string;
  city: string | null;
  state: string | null;
  cuisineType: string | null;
  averageCost: number | null;
  coverImage?: string | null;
  isOpen?: boolean | null;
  isOpened?: boolean | null;
  acceptsQueue?: boolean | null;
  createdAt: string;
}

export interface CustomerRestaurantPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CustomerRestaurantsApiResponse {
  success: boolean;
  message?: string;
  statusCode?: number;
  data: CustomerRestaurantItem[];
  pagination: CustomerRestaurantPagination;
}

export interface CustomerRestaurantsListData {
  restaurants: CustomerRestaurantItem[];
  pagination: CustomerRestaurantPagination;
}

export interface GetCustomerRestaurantsParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  cuisine?: string;
  foodItem?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "createdAt" | "restaurantName" | "name" | "city" | "price" | "rating";
  sortOrder?: "asc" | "desc";
}

export type CustomerSortOptionValue = "newest" | "name_asc" | "price_asc" | "price_desc";

export interface CustomerSortConfig {
  value: CustomerSortOptionValue;
    label: string;
  sortBy: "createdAt" | "restaurantName" | "price";
  sortOrder: "asc" | "desc";
}

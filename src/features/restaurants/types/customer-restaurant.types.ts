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
  type?: "QUEUE_PRO" | "SELF_PRO" | string;
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

export interface CustomerRestaurantOperatingHour {
  id: string;
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

export interface CustomerRestaurantMenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  preparationTime?: number | null;
  calories?: number | null;
  isVegetarian: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  images?: Array<{ id: string; objectKey: string; displayOrder?: number }>;
  variants?: Array<{
    id: string;
    name: string;
    price: number;
    isDefault: boolean;
    isAvailable: boolean;
  }>;
  addons?: Array<{
    id: string;
    addonId: string;
    name: string;
    description?: string;
    price: number;
    imageKey?: string;
    isAvailable: boolean;
  }>;
}

export interface CustomerRestaurantMenuCategory {
  id: string;
  name: string;
  description?: string | null;
  displayOrder: number;
  items: CustomerRestaurantMenuItem[];
}

export interface CustomerRestaurantDetails extends CustomerRestaurantItem {
  phone: string;
  email: string;
  description?: string | null;
  address?: {
    id?: string;
    addressLine1?: string;
    addressLine2?: string | null;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  settings?: {
    isOpened?: boolean;
    isPreorder?: boolean;
    acceptsQueue?: boolean;
    acceptsQrOrders?: boolean;
  };
  operatingHours?: CustomerRestaurantOperatingHour[];
  images?: Array<{ id: string; objectKey: string; displayOrder?: number }>;
  menu?: CustomerRestaurantMenuCategory[];
  queue?: {
    isGuestUser: boolean;
    hasJoinedAnyQueue: boolean;
    hasJoinedThisRestaurantQueue: boolean;
  };
}

export interface CustomerRestaurantDetailsApiResponse {
  success: boolean;
  message?: string;
  data: CustomerRestaurantDetails;
  statusCode?: number;
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

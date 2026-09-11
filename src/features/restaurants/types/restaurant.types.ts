export type RestaurantStatusType =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  | "ACTIVE"
  | "INACTIVE";

export type RestaurantPlanType = "QUEUE_PRO" | "SELF_SERVICE_PRO";

export type RestaurantSortByType =
  | "created_at"
  | "restaurant_name"
  | "owner_name"
  | "status"
  | "plan"
  | "updated_at";

export type RestaurantSortOrderType = "asc" | "desc";

export interface RestaurantContact {
  email: string;
  phone: string | null;
  owner_email: string;
}

export interface RestaurantListItem {
  id: string;
  restaurant_name: string;
  owner_name: string;
  contact: RestaurantContact;
  plan: RestaurantPlanType | string | null;
  status: RestaurantStatusType;
  is_subscription_active: boolean;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface AdminRestaurantsApiResponse {
  success: boolean;
  data: {
    restaurants: RestaurantListItem[];
    pagination: RestaurantPagination;
  };
}

export interface AdminRestaurantsListData {
  restaurants: RestaurantListItem[];
  pagination: RestaurantPagination;
}

export interface GetAdminRestaurantsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RestaurantStatusType | "ALL";
  plan?: RestaurantPlanType | "ALL";
  is_subscription_active?: boolean | "true" | "false" | "ALL";
  created_from?: string;
  created_to?: string;
  sort_by?: RestaurantSortByType;
  sort_order?: RestaurantSortOrderType;
}

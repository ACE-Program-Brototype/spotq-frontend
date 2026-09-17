export type RestaurantStatusType =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  | "ACTIVE"
  | "INACTIVE"
  | "BLOCKED";

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

export interface RestaurantAddress {
  id?: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface RestaurantSettings {
  is_opened?: boolean;
  is_preorder?: boolean;
  is_loyalty?: boolean;
  cuisine_type?: string | null;
  seating_capacity?: number;
  open_time?: string | null;
  close_time?: string | null;
}

export interface RestaurantStaffMember {
  id: string;
  fullname: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  avatar_url?: string | null;
  created_at: string;
}

export interface RestaurantDocument {
  id: string;
  document_type: string;
  document_name: string;
  document_key: string;
  verification_status: string;
  uploaded_at: string;
}

export interface RestaurantImage {
  id: string;
  object_key: string;
  display_order?: number;
  created_at: string;
}

export interface OperatingHour {
  day: string;
  open_time: string;
  close_time: string;
  is_closed?: boolean;
}

export interface RestaurantDetails {
  id: string;
  restaurant_name: string;
  category?: string | null;
  email: string;
  phone: string;
  owner_name: string;
  owner_email: string;
  status: RestaurantStatusType;
  onboarding_status: string;
  is_blocked: boolean;
  block_reason?: string | null;
  is_subscription_active: boolean;
  subscription_plan_code?: string | null;
  subscription_ends_at?: string | null;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
  address?: RestaurantAddress | null;
  settings?: RestaurantSettings | null;
  profile?: string | null;
  operating_hours?: OperatingHour[];
  staff?: RestaurantStaffMember[];
  documents?: RestaurantDocument[];
  images?: RestaurantImage[];
}

export interface AdminRestaurantDetailsApiResponse {
  success: boolean;
  message?: string;
  data: RestaurantDetails;
  statusCode?: number;
}
export interface BlockRestaurantInput {
  restaurantId: string;
  reason: string;
}

export interface UnblockRestaurantInput {
  restaurantId: string;
}

export interface BlockRestaurantResponse {
  success: boolean;
  message?: string;
  data?: RestaurantDetails;
  statusCode?: number;
}

export interface UnblockRestaurantResponse {
  success: boolean;
  message?: string;
  data?: RestaurantDetails;
  statusCode?: number;
}

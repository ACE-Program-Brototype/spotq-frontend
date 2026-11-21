export type ApplicationStatusType = "PENDING" | "REJECTED" | "APPROVED";
export type ApplicationFilterStatusType = "ALL" | "PENDING" | "REJECTED";

export type ApplicationSortByType =
  | "created_at"
  | "restaurant_name"
  | "owner_name"
  | "status"
  | "updated_at";
export type ApplicationSortOrderType = "asc" | "desc";

export interface ApplicationAddress {
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

export interface ApplicationDocument {
  id: string;
  document_type: string;
  document_name: string;
  document_key: string;
  verification_status: string;
  uploaded_at: string;
}

export interface ApplicationImage {
  id: string;
  object_key: string;
  display_order?: number;
  created_at: string;
}

export interface RestaurantApplicationItem {
  id: string;
  restaurant_name: string;
  email: string;
  phone: string;
  owner_name: string;
  owner_email: string;
  status: ApplicationStatusType;
  onboarding_status: string;
  email_verified_at?: string | null;
  emailVerifiedAt?: string | null;
  is_blocked?: boolean;
  isBlocked?: boolean;
  block_reason?: string | null;
  blockReason?: string | null;
  is_subscription_active?: boolean;
  subscription_plan_code?: string | null;
  subscription_ends_at?: string | null;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
  rejection_reason?: string | null;
  rejectionReason?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  address?: ApplicationAddress | null;
  documents?: ApplicationDocument[];
  images?: ApplicationImage[];
}

export interface ApplicationPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface GetRestaurantApplicationsParams {
  page?: number;
  limit?: number;
  status?: ApplicationFilterStatusType | "ALL";
  search?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: ApplicationSortByType | string;
  sortOrder?: ApplicationSortOrderType;
}

export interface PaginatedApplicationsApiResponse {
  success: boolean;
  message?: string;
  data: {
    restaurants: RestaurantApplicationItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages?: number;
      total_pages?: number;
      hasNextPage?: boolean;
      has_next_page?: boolean;
      hasPrevPage?: boolean;
      has_prev_page?: boolean;
    };
  };
  statusCode?: number;
}

export interface SingleApplicationApiResponse {
  success: boolean;
  message?: string;
  data: RestaurantApplicationItem;
  statusCode?: number;
}

export interface ApproveApplicationResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    restaurant_name: string;
    status: string;
    reviewed_by?: string;
    reviewed_at?: string;
  };
  statusCode?: number;
}

export interface RejectApplicationInput {
  restaurantId: string;
  reason: string;
}

export interface RejectApplicationResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    restaurant_name: string;
    status: string;
    rejection_reason?: string;
    reviewed_by?: string;
    reviewed_at?: string;
  };
  statusCode?: number;
}

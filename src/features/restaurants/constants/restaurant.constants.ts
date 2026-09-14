import type { RestaurantSortByType, RestaurantSortOrderType } from "../types/restaurant.types";

export const RESTAURANT_ENDPOINTS = {
  ADMIN_LIST: "restaurants/admin/restaurants",
  ADMIN_DETAILS: (id: string) => `restaurants/admin/restaurants/${id}`,
  ADMIN_BLOCK: (id: string) => `restaurants/admin/restaurants/${id}/block`,
  ADMIN_UNBLOCK: (id: string) => `restaurants/admin/restaurants/${id}/unblock`,
} as const;

export const RESTAURANT_QUERY_KEYS = {
  ADMIN_LIST: ["admin", "restaurants"] as const,
  ADMIN_DETAILS: (id?: string) => ["admin", "restaurant", id] as const,
} as const;

export const RESTAURANT_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  SEARCH_DEBOUNCE_MS: 350,
  SORT_BY: "created_at" as RestaurantSortByType,
  SORT_ORDER: "desc" as RestaurantSortOrderType,
  FILTER_STATUS: "ALL" as const,
  FILTER_PLAN: "ALL" as const,
  FILTER_SUBSCRIPTION_ACTIVE: "ALL" as const,
  DETAILS_STALE_TIME_MS: 1000 * 60 * 5, // 5 minutes cache
} as const;

export const RESTAURANT_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
} as const;

export const RESTAURANT_FILTER_STATUS = {
  ALL: "ALL",
  ...RESTAURANT_STATUS,
} as const;

export type RestaurantFilterStatusType =
  (typeof RESTAURANT_FILTER_STATUS)[keyof typeof RESTAURANT_FILTER_STATUS];

export const RESTAURANT_PLANS = {
  QUEUE_PRO: "QUEUE_PRO",
  SELF_SERVICE_PRO: "SELF_SERVICE_PRO",
} as const;

export const RESTAURANT_FILTER_PLANS = {
  ALL: "ALL",
  ...RESTAURANT_PLANS,
} as const;

export type RestaurantFilterPlanType =
  (typeof RESTAURANT_FILTER_PLANS)[keyof typeof RESTAURANT_FILTER_PLANS];

export const RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER = {
  ALL: "ALL",
  ACTIVE: "true",
  INACTIVE: "false",
} as const;

export type RestaurantSubscriptionActiveFilterType =
  (typeof RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER)[keyof typeof RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER];

export const RESTAURANT_MESSAGES = {
  PAGE_TITLE: "Restaurant Management",
  PAGE_SUBTITLE: "Manage, review, and monitor restaurant partners across the platform",
  SEARCH_PLACEHOLDER: "Search by restaurant name, owner, email, or phone...",
  ERROR_TITLE: "Failed to load restaurants",
  ERROR_DESCRIPTION:
    "There was a problem fetching the restaurant records. Please check your connection and try again.",
  RETRY_BUTTON: "Retry",
  EMPTY_TITLE: "No restaurants found",
  EMPTY_DESCRIPTION: "There are currently no restaurant records matching your filter criteria.",
  EMPTY_DEFAULT: "No restaurants have registered on the platform yet.",
  CLEAR_FILTERS: "Clear Filters",
  COL_RESTAURANT: "Restaurant",
  COL_OWNER: "Owner & Contact",
  COL_PLAN: "Plan",
  COL_STATUS: "Status",
  COL_SUBSCRIPTION: "Subscription",
  COL_JOINED: "Joined Date",

  // Details Page
  DETAILS_BACK_BUTTON: "Back to Restaurants",
  DETAILS_PAGE_TITLE: "Restaurant Details",
  DETAILS_PAGE_SUBTITLE:
    "Complete profile, operational settings, staff members, and verification documents",
  DETAILS_NOT_FOUND_TITLE: "Restaurant Not Found",
  DETAILS_NOT_FOUND_DESCRIPTION:
    "The requested restaurant profile could not be located or may have been removed.",
  DETAILS_ERROR_TITLE: "Failed to load restaurant details",
  DETAILS_TAB_OVERVIEW: "Overview & Settings",
  DETAILS_TAB_STAFF: "Staff Members",
  DETAILS_TAB_DOCUMENTS: "Verification Documents",
  DETAILS_TAB_IMAGES: "Gallery & Photos",

  // Block & Unblock Actions
  BLOCK_BUTTON: "Block Restaurant",
  UNBLOCK_BUTTON: "Unblock Restaurant",
  BLOCK_MODAL_TITLE: "Block Restaurant",
  BLOCK_MODAL_DESCRIPTION:
    "Blocking this restaurant will immediately revoke access for all associated managers, staff members, and active sessions.",
  BLOCK_REASON_LABEL: "Reason for Blocking",
  BLOCK_REASON_PLACEHOLDER:
    "Provide a detailed reason for blocking this restaurant (e.g. policy violation, regulatory order, payment default)...",
  BLOCK_REASON_REQUIRED: "A reason is required to block a restaurant.",
  BLOCK_REASON_MIN_LENGTH: "Reason must be at least 5 characters long.",
  BLOCK_CONFIRM_BUTTON: "Confirm & Block Restaurant",
  BLOCK_CANCEL_BUTTON: "Cancel",
  BLOCK_SUCCESS: "Restaurant has been blocked successfully.",
  BLOCK_ERROR: "Failed to block restaurant. Please try again.",

  UNBLOCK_CONFIRM_TITLE: "Unblock Restaurant",
  UNBLOCK_CONFIRM_DESCRIPTION: (name: string) =>
    `Are you sure you want to unblock ${name}? Access to restaurant management tools and portal services will be restored immediately.`,
  UNBLOCK_CONFIRM_BUTTON: "Confirm & Unblock Restaurant",
  UNBLOCK_CANCEL_BUTTON: "Cancel",
  UNBLOCK_SUCCESS: "Restaurant has been unblocked successfully.",
  UNBLOCK_ERROR: "Failed to unblock restaurant. Please try again.",
} as const;

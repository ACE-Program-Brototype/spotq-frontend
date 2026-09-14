import type { RestaurantSortByType, RestaurantSortOrderType } from "../types/restaurant.types";

export const RESTAURANT_ENDPOINTS = {
  ADMIN_LIST: "restaurants/admin/restaurants",
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
} as const;

export const RESTAURANT_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
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
} as const;

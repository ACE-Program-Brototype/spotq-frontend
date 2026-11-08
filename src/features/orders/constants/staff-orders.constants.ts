/**
 * Staff Orders Constants & Configurations
 */

import type { StaffOrderStatus, StaffOrderType } from "../types/staff-orders.types";

export const STAFF_ORDERS_ENDPOINTS = {
  LIST: (restaurantId: string) => `orders/staff/restaurants/${restaurantId}/orders`,
} as const;

export const STAFF_ORDERS_QUERY_KEYS = {
  ROOT: ["staff-orders"] as const,
  LIST: (restaurantId: string, params?: Record<string, unknown>) =>
    ["staff-orders", restaurantId, "list", params] as const,
} as const;

export const STAFF_ORDERS_DEFAULTS = {
  PAGE: 1,
  LIMIT: 12,
  SORT_ORDER: "asc" as const, // FIFO ordering (oldest orders first for kitchen/staff)
  SEARCH_DEBOUNCE_MS: 350,
} as const;

export const STAFF_ORDER_STATUS_CONFIG: Record<
  StaffOrderStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  PLACED: {
    label: "Placed",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
  },
  CONFIRMED: {
    label: "Confirmed",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotClass: "bg-indigo-500",
  },
  PREPARING: {
    label: "Preparing",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500 animate-pulse",
  },
  READY: {
    label: "Ready",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  COMPLETED: {
    label: "Completed",
    badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-200",
    dotClass: "bg-neutral-400",
  },
};

export const STAFF_ORDER_TYPE_CONFIG: Record<
  StaffOrderType,
  { label: string; badgeClass: string }
> = {
  QUEUE_PRO: {
    label: "Queue Pro",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  SELF_PRO: {
    label: "Self Pro",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
  },
};

export const STAFF_ORDERS_MESSAGES = {
  RESTAURANT_ID_REQUIRED: "Restaurant ID is required to fetch staff orders",
  FETCH_FAILED: "Unable to load restaurant orders. Please check your connection and retry.",
  EMPTY_ORDERS_TITLE: "No orders found",
  EMPTY_ORDERS_DESC:
    "There are currently no orders matching your selected filters. Try adjusting your status or search query.",
  EMPTY_NO_ORDERS_YET: "No orders have been received yet for this restaurant shift.",
} as const;

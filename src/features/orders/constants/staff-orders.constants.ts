/**
 * Staff Orders Constants & Configurations
 */

import type { StaffOrderStatus, StaffOrderType } from "../types/staff-orders.types";

export const STAFF_ORDERS_ENDPOINTS = {
  LIST: (restaurantId: string) => `orders/staff/restaurants/${restaurantId}/orders`,
  DETAILS: (restaurantId: string, orderId: string) =>
    `orders/staff/restaurants/${restaurantId}/orders/${orderId}`,
  UPDATE_STATUS: (orderId: string) => `orders/staff/${orderId}/status`,
} as const;

export const STAFF_ORDERS_QUERY_KEYS = {
  ROOT: ["staff-orders"] as const,
  LIST: (restaurantId: string, params?: Record<string, unknown>) =>
    ["staff-orders", restaurantId, "list", params] as const,
  DETAIL: (restaurantId: string, orderId: string) =>
    ["staff-orders", restaurantId, "detail", orderId] as const,
} as const;

export const STAFF_ORDERS_DEFAULTS = {
  PAGE: 1,
  LIMIT: 12,
  SORT_ORDER: "asc" as const, // FIFO ordering (oldest orders first for kitchen/staff)
  SEARCH_DEBOUNCE_MS: 350,
  POLL_INTERVAL_MS: 15_000, // 15s auto-polling for active order states
} as const;

export const STAFF_ORDER_FILTER_STATUS = {
  ALL: "ALL",
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  READY: "READY",
  COMPLETED: "COMPLETED",
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

export interface StaffStatusActionConfig {
  label: string;
  nextStatus: StaffOrderStatus;
  buttonClass: string;
}

/**
 * Status Action Button definitions for the kitchen workflow.
 * Note: If order is PLACED, it is treated as CONFIRMED by the backend,
 * so the staff action transitions directly to PREPARING ("Start Cooking").
 */
export const STAFF_STATUS_ACTIONS: Record<StaffOrderStatus, StaffStatusActionConfig | null> = {
  PLACED: {
    label: "Start Cooking",
    nextStatus: "PREPARING",
    buttonClass: "bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs",
  },
  CONFIRMED: {
    label: "Start Cooking",
    nextStatus: "PREPARING",
    buttonClass: "bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs",
  },
  PREPARING: {
    label: "Food is Ready",
    nextStatus: "READY",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs",
  },
  READY: {
    label: "Complete Order",
    nextStatus: "COMPLETED",
    buttonClass: "bg-neutral-900 hover:bg-black text-white shadow-xs",
  },
  COMPLETED: null,
};

export const STAFF_ORDERS_MESSAGES = {
  RESTAURANT_ID_REQUIRED: "Restaurant ID is required to fetch staff orders",
  ORDER_ID_REQUIRED: "Order ID is required to fetch staff order details",
  FETCH_FAILED: "Unable to load restaurant orders. Please check your connection and retry.",
  FETCH_ERROR_TITLE: "Failed to load orders",
  EMPTY_ORDERS_TITLE: "No orders found",
  EMPTY_ORDERS_DESC:
    "There are currently no orders matching your selected filters. Try adjusting your status or search query.",
  EMPTY_NO_ORDERS_YET: "No orders have been received yet for this restaurant shift.",
  NO_RESTAURANT_TITLE: "No restaurant assigned",
  NO_RESTAURANT_DESC:
    "Your staff account is not associated with an active restaurant. Please sign in again or contact your administrator.",
} as const;

export const STAFF_ORDER_DETAILS_MESSAGES = {
  ORDER_NOT_FOUND_TITLE: "Order Not Found",
  ORDER_NOT_FOUND_DESC:
    "The requested order could not be found or does not belong to your restaurant.",
  STATUS_UPDATE_SUCCESS: (orderNumber: string, statusLabel: string) =>
    `Order #${orderNumber} updated to ${statusLabel}`,
  STATUS_UPDATE_ERROR: "Failed to update order status. Please try again.",
  CONCURRENT_UPDATE_ERROR: "Order was updated concurrently. Showing latest status.",
  FETCH_ERROR_TITLE: "Failed to load order details",
  FETCH_FAILED: "Unable to load order details. Please check your connection and retry.",
  NO_SPECIAL_INSTRUCTIONS: "No special instructions",
  NO_CUSTOMER_NOTES: "No customer dining notes provided for this order.",
} as const;

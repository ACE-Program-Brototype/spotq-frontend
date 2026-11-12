/**
 * Platform Admin Orders Constants
 * Centralized configuration, endpoints, defaults, and user-facing messages.
 */

import type {
  AdminOrderFilterPaymentStatus,
  AdminOrderFilterStatus,
  AdminOrdersSortBy,
  AdminOrdersSortOrder,
} from "../types/admin-orders.types";

export const ADMIN_ORDERS_ENDPOINTS = {
  LIST: "orders/admin",
} as const;

export const ADMIN_ORDERS_QUERY_KEYS = {
  ALL: ["admin", "orders"] as const,
  LIST: (params?: Record<string, unknown>) => ["admin", "orders", "list", params ?? {}] as const,
} as const;

export const ADMIN_ORDERS_DEFAULTS = {
  PAGE: 1,
  LIMIT: 25,
  SORT_BY: "createdAt" as AdminOrdersSortBy,
  SORT_ORDER: "desc" as AdminOrdersSortOrder,
  SEARCH_DEBOUNCE_MS: 300,
  INITIAL_METRICS: {
    totalOrders: 0,
    ordersByStatus: {},
    totalOrderValue: 0,
  },
} as const;

export const ADMIN_ORDER_FILTER_STATUS = {
  ALL: "ALL",
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  READY: "READY",
  SERVED: "SERVED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const satisfies Record<string, AdminOrderFilterStatus>;

export const ADMIN_PAYMENT_FILTER_STATUS = {
  ALL: "ALL",
  PAID: "PAID",
  PENDING: "PENDING",
  REFUNDED: "REFUNDED",
  FAILED: "FAILED",
} as const satisfies Record<string, AdminOrderFilterPaymentStatus>;

export const ADMIN_ORDER_STATUS_OPTIONS: { label: string; value: AdminOrderFilterStatus }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Placed", value: "PLACED" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Ready", value: "READY" },
  { label: "Served", value: "SERVED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export const ADMIN_PAYMENT_STATUS_OPTIONS: {
  label: string;
  value: AdminOrderFilterPaymentStatus;
}[] = [
  { label: "All Payment States", value: "ALL" },
  { label: "Paid", value: "PAID" },
  { label: "Pending", value: "PENDING" },
  { label: "Refunded", value: "REFUNDED" },
  { label: "Failed", value: "FAILED" },
];

export const ADMIN_ORDERS_MESSAGES = {
  PAGE_TITLE: "Platform Orders",
  PAGE_SUBTITLE: "System-wide order monitor, financial ledger summaries, and real-time statuses.",
  REFRESH_TITLE: "Refresh orders",
  SEARCH_PLACEHOLDER: "Search by order #, ID, restaurant, or customer...",
  NO_ORDERS_FOUND_TITLE: "No orders found",
  NO_ORDERS_FOUND_DESC: "Try adjusting your search query, status filters, or date range.",
  FETCH_ERROR_TITLE: "Failed to load platform orders",
  FETCH_ERROR_DESC:
    "Unable to retrieve orders from the server. Please check your connection and try again.",
  TRY_AGAIN: "Try again",
  ORDER_DETAILS_TITLE: "Order Breakdown",
  COPIED_TO_CLIPBOARD: "Copied to clipboard",
} as const;

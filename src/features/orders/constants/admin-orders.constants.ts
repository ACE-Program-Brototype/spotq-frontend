/**
 * Platform Admin Orders Constants
 * Centralized configuration, endpoints, defaults, and user-facing messages.
 */

import type {
  AdminOrderFilterPaymentStatus,
  AdminOrderFilterStatus,
  AdminOrdersSortBy,
  AdminOrdersSortOrder,
} from "@/features/orders/types/admin-orders.types";

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

export const ADMIN_ORDERS_STATUS_FILTERS = ADMIN_ORDER_FILTER_STATUS;

export const ADMIN_PAYMENT_FILTER_STATUS = {
  ALL: "ALL",
  PAID: "PAID",
  PENDING: "PENDING",
  REFUNDED: "REFUNDED",
  FAILED: "FAILED",
} as const satisfies Record<string, AdminOrderFilterPaymentStatus>;

export const ADMIN_ORDERS_PAYMENT_STATUS_FILTERS = ADMIN_PAYMENT_FILTER_STATUS;

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

export const ADMIN_DATE_PRESETS = {
  ALL: "ALL",
  TODAY: "TODAY",
  LAST_7_DAYS: "LAST_7_DAYS",
  LAST_30_DAYS: "LAST_30_DAYS",
} as const;

export type AdminDatePreset = (typeof ADMIN_DATE_PRESETS)[keyof typeof ADMIN_DATE_PRESETS];

export const ADMIN_DATE_PRESET_OPTIONS: { label: string; value: AdminDatePreset }[] = [
  { label: "All Time", value: ADMIN_DATE_PRESETS.ALL },
  { label: "Today", value: ADMIN_DATE_PRESETS.TODAY },
  { label: "Last 7 Days", value: ADMIN_DATE_PRESETS.LAST_7_DAYS },
  { label: "Last 30 Days", value: ADMIN_DATE_PRESETS.LAST_30_DAYS },
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
  COPY_FAILED: "Failed to copy to clipboard",
} as const;

export const ADMIN_ORDERS_METRICS_LABELS = {
  SECTION_ARIA: "Platform Order Metrics",
  TOTAL_ORDERS: "Total Orders",
  TOTAL_ORDERS_SUBTITLE: "All-time orders",
  GROSS_ORDER_VALUE: "Gross Order Value",
  GROSS_ORDER_VALUE_SUBTITLE: "Platform GMV",
  COMPLETED: "Completed",
  ACTIVE_ORDERS: "Active Orders",
  ACTIVE_ORDERS_SUBTITLE: "Kitchen & Service",
  CANCELLED: "Cancelled",
  RATE_COMPLETED: "completed",
  RATE_CANCELLED: "rate",
} as const;

export const ADMIN_ORDERS_FILTER_LABELS = {
  STATUS: "Status:",
  PAYMENT: "Payment:",
  MOBILE_STATUS_LABEL: "Order Status",
  MOBILE_PAYMENT_LABEL: "Payment Status",
  MOBILE_STATUS_ARIA: "Filter by order status",
  MOBILE_PAYMENT_ARIA: "Filter by payment status",
} as const;

export const ADMIN_ORDERS_TABLE_COLUMNS = {
  ORDER: "Order #",
  RESTAURANT: "Restaurant",
  STATUS: "Order Status",
  PAYMENT: "Payment",
  AMOUNT: "Amount",
  DATE: "Date",
  ACTION: "Action",
} as const;

export const ADMIN_ORDERS_SORT_BY = {
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
  TOTAL_AMOUNT: "totalAmount",
  STATUS: "status",
} as const satisfies Record<string, AdminOrdersSortBy>;

export const ADMIN_ORDERS_SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
} as const satisfies Record<string, AdminOrdersSortOrder>;

export const ARIA_SORT_VALUES = {
  ASCENDING: "ascending",
  DESCENDING: "descending",
  NONE: "none",
} as const;

export const ADMIN_ORDERS_TABLE_LABELS = {
  SORT_BY_STATUS: "Sort by Status",
  SORT_BY_TOTAL_AMOUNT: "Sort by Total Amount",
  SORT_BY_DATE: "Sort by Date Created",
  COPY_ORDER_NUMBER: "Copy order number",
  PLATFORM_FEE_ASSESSED: "Platform fee assessed",
  VIEW_ORDER_BREAKDOWN: "View order breakdown",
  VIEW_DETAILS: "View Details",
  FEE_PREFIX: "Fee:",
  TOTAL: "Total",
  PLATFORM_FEE: "Platform Fee",
  DEFAULT_RESTAURANT_NAME: "SpotQ Restaurant",
  VIEW_ORDER_ARIA: (orderNumber: string) => `View order ${orderNumber}`,
} as const;

export const ADMIN_ORDER_DETAIL_LABELS = {
  TITLE_PREFIX: "Order #",
  ORDER_LIFECYCLE: "Order Lifecycle",
  PAYMENT_STATUS: "Payment Status",
  RESTAURANT: "Restaurant",
  CUSTOMER: "Customer",
  REGISTERED_CUSTOMER: "Registered Customer",
  GUEST_CUSTOMER: "Guest Customer",
  PAYMENT_REFERENCE: "Payment Reference",
  NO_GATEWAY_REFERENCE: "No gateway reference (Pending or not recorded)",
  FINANCIAL_BREAKDOWN: "Authoritative Financial Breakdown",
  SUBTOTAL: "Subtotal (Items Net)",
  TAX_AMOUNT: "Tax Amount (GST / VAT)",
  PLATFORM_FEE: "Platform Fee Assessed",
  GRAND_TOTAL: "Grand Total",
  CREATED: "Created:",
  UPDATED: "Updated:",
  CLOSE: "Close",
  COPIED: "Copied",
  COPY: "Copy",
  CLOSE_OVERLAY_ARIA: "Close modal overlay",
  CLOSE_DIALOG_ARIA: "Close dialog",
} as const;

export const ADMIN_ORDER_COPY_FIELDS = {
  ORDER_NUMBER: "orderNumber",
  PAYMENT_REF: "paymentRef",
} as const;



/**
 * Orders Feature Constants
 * Filter chip definitions, default settings, query keys, query params, status options, and user-facing messages.
 */

import type { OrderFilterStatus, OrderPaginationData } from "../types/orders.types";

export const ORDER_QUERY_PARAMS = {
  PAGE: "page",
  LIMIT: "limit",
  STATUS: "status",
} as const;

export const ORDER_FILTER_STATUS = {
  ALL: "ALL",
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  READY: "READY",
  SERVED: "SERVED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const ORDER_FILTER_CHIPS: Array<{
  label: string;
  value: OrderFilterStatus;
}> = [
  { label: "All", value: ORDER_FILTER_STATUS.ALL },
  { label: "Placed", value: ORDER_FILTER_STATUS.PLACED },
  { label: "Confirmed", value: ORDER_FILTER_STATUS.CONFIRMED },
  { label: "Preparing", value: ORDER_FILTER_STATUS.PREPARING },
  { label: "Ready", value: ORDER_FILTER_STATUS.READY },
  { label: "Served", value: ORDER_FILTER_STATUS.SERVED },
  { label: "Completed", value: ORDER_FILTER_STATUS.COMPLETED },
  { label: "Cancelled", value: ORDER_FILTER_STATUS.CANCELLED },
];

export const ORDER_STATUS = {
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  READY: "READY",
  SERVED: "SERVED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const ORDER_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  TOTAL_PAGES: 1,
  TOTAL_ORDERS: 0,
  HAS_NEXT: false,
  FILTER_STATUS: ORDER_FILTER_STATUS.ALL as OrderFilterStatus,
} as const;

export const ORDER_DEFAULT_PAGINATION = (
  page: number = ORDER_DEFAULTS.PAGE,
): OrderPaginationData => ({
  current_page: page,
  total_pages: ORDER_DEFAULTS.TOTAL_PAGES,
  total_orders: ORDER_DEFAULTS.TOTAL_ORDERS,
  has_next: ORDER_DEFAULTS.HAS_NEXT,
});

export const ORDER_ENDPOINTS = {
  HISTORY: "orders/history",
} as const;

export const ORDER_QUERY_KEYS = {
  HISTORY: (params?: { page?: number; limit?: number; status?: string }) =>
    ["customer", "orders", "history", params] as const,
} as const;

export const ORDER_MESSAGES = {
  PAGE_TITLE: "Order History",
  PAGE_SUBTITLE: "Track and re-visit your past dining and takeaway orders.",
  ALL_ORDERS: "All Orders",
  ITEMS_LABEL: "Items",
  TOTAL_AMOUNT: "Total Amount",
  ORDER_SUMMARY: "Order Summary",
  CLOSE: "Close",
  NO_ORDERS_TITLE: "No orders found",
  NO_ORDERS_SUBTITLE:
    "You haven't placed any orders matching this filter. Explore top restaurants and start ordering!",
  EXPLORE_RESTAURANTS: "Explore Restaurants",
  FETCH_ERROR_TITLE: "Failed to load orders",
  FETCH_ERROR_DESCRIPTION:
    "We encountered an issue retrieving your order history. Please check your connection and try again.",
  RETRY: "Try Again",
} as const;

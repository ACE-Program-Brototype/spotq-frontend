import {
  ANALYTICS_PERIODS,
  ANALYTICS_SECTION_STATUSES,
  ORDER_STATUS_FILTERS,
  PRODUCT_CLASSIFICATIONS,
} from "@/features/analytics/types/restaurant-analytics.types";

export * from "./order-status-chart.constants";
export { ANALYTICS_SECTION_STATUSES, ORDER_STATUS_FILTERS, PRODUCT_CLASSIFICATIONS };

export const RESTAURANT_ANALYTICS_ENDPOINTS = {
  DASHBOARD: (restaurantId: string) => `restaurants/${restaurantId}/analytics/dashboard`,
} as const;

export const RESTAURANT_ANALYTICS_QUERY_KEYS = {
  ALL: ["restaurant-analytics"] as const,
  DASHBOARD: (restaurantId: string, params?: Record<string, unknown>) =>
    ["restaurant-analytics", "dashboard", restaurantId, params ?? {}] as const,
} as const;

export const RESTAURANT_ANALYTICS_DEFAULTS = {
  INTERVAL: ANALYTICS_PERIODS.MONTH,
  STATUS: ORDER_STATUS_FILTERS.ALL,
  PAGE: 1,
  LIMIT: 10,
  STALE_TIME_MS: 30_000,
  REFETCH_INTERVAL_MS: 60_000,
  LOW_VOLUME_THRESHOLD: 3,
} as const;

export const RESTAURANT_ANALYTICS_INTERVAL_LABELS: Record<keyof typeof ANALYTICS_PERIODS, string> =
  {
    DAY: "Today",
    WEEK: "This Week",
    MONTH: "This Month",
    YEAR: "This Year",
  };

export const ORDER_STATUS_FILTER_LABELS: Record<keyof typeof ORDER_STATUS_FILTERS, string> = {
  ALL: "All Orders",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

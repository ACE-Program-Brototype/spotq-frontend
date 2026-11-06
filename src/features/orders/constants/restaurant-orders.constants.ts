export const RESTAURANT_ORDERS_ENDPOINTS = {
  OVERVIEW: (restaurantId: string) => `orders/restaurants/${restaurantId}/orders/overview`,
  LIST: (restaurantId: string) => `orders/restaurants/${restaurantId}/orders`,
  DETAIL: (restaurantId: string, orderId: string) =>
    `orders/restaurants/${restaurantId}/orders/${orderId}`,
} as const;

export const RESTAURANT_ORDERS_QUERY_KEYS = {
  ROOT: ["restaurant-orders"] as const,
  OVERVIEW: (restaurantId: string, filters?: { from?: string; to?: string }) =>
    ["restaurant-orders", restaurantId, "overview", filters] as const,
  LIST: (restaurantId: string, params?: Record<string, unknown>) =>
    ["restaurant-orders", restaurantId, "list", params] as const,
  DETAIL: (restaurantId: string, orderId: string) =>
    ["restaurant-orders", restaurantId, "detail", orderId] as const,
} as const;

export const RESTAURANT_ORDERS_SERVICE_ERRORS = {
  OVERVIEW_RESTAURANT_ID_REQUIRED: "Restaurant ID is required to fetch orders overview",
  LIST_RESTAURANT_ID_REQUIRED: "Restaurant ID is required to fetch orders list",
  DETAIL_IDS_REQUIRED: "Restaurant ID and Order ID are required to fetch order details",
} as const;

export const RESTAURANT_ORDERS_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  TOTAL_PAGES: 1,
  TOTAL_ORDERS: 0,
  DEFAULT_COMPLETION_RATE: "0% completion rate",
  DEFAULT_CANCELLATION_RATE: "0% cancellation rate",
  DEFAULT_SORT_BY: "createdAt" as const,
  DEFAULT_SORT_ORDER: "desc" as const,
  SEARCH_DEBOUNCE_MS: 400,
  INITIAL_METRICS: {
    totalOrders: 0,
    grossRevenue: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  },
} as const;

export const RESTAURANT_ORDERS_MESSAGES = {
  FETCH_FAILED: "Unable to load restaurant orders. Please check your connection and retry.",
  ORDER_NOT_FOUND_TITLE: "Order not found",
  ORDER_NOT_FOUND_DESC:
    "We couldn't retrieve the order details. The order may have been removed or does not exist.",
  NO_ORDERS_FOUND_TITLE: "No orders found",
  NO_ORDERS_FOUND_DESC:
    "There are currently no orders matching your selected filters. Try adjusting your date range, status, or search query.",
} as const;

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

export const RESTAURANT_ORDERS_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  TOTAL_PAGES: 1,
  TOTAL_ORDERS: 0,
} as const;


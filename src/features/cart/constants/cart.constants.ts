export const CART_ENDPOINTS = {
  ADD_ITEM: "carts/items",
} as const;

export const CART_QUERY_KEYS = {
  ALL: ["cart"] as const,
  ITEMS: ["cart", "items"] as const,
} as const;

export const CART_MESSAGES = {
  ADD_SUCCESS: "Item added to cart successfully!",
  ADD_ERROR: "Failed to add item to cart. Please try again.",
  RESTAURANT_REQUIRED: "Restaurant identification is required to add items to cart.",
} as const;

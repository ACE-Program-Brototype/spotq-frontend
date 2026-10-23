/**
 * Cart Data Types
 * Matches the Add to Cart API specification for /api/v1/carts/items.
 */

export interface AddToCartPayload {
  restaurantId: string;
  menuItemId: string;
  quantity: number;
  addonIds: string[];
  specialInstructions?: string;
}

export interface CartItemAddon {
  id: string;
  addonId: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  addonIds?: string[];
  addons?: CartItemAddon[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface AddToCartResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

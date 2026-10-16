export interface CartItemAddon {
  addonId: string;
  addonName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  menuItemName: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions: string | null;
  addons: CartItemAddon[];
}

export interface Cart {
  cartId: string;
  restaurantId: string;
  restaurantName?: string;
  userId: string;
  status: "ACTIVE" | "EXPIRED" | "ABANDONED" | "CONVERTED" | string;
  itemCount: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  items: CartItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

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

export interface AddCartItemInput {
  restaurantId: string;
  menuItemId: string;
  variantId?: string | null;
  addonIds?: string[];
  quantity: number;
  specialInstructions?: string | null;
}

export interface AddCartItemResponseItem {
  id: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AddCartItemData {
  cartId: string;
  restaurantId: string;
  itemCount: number;
  subtotal: number;
  updatedAt: string;
  items: AddCartItemResponseItem[];
}

export interface UpdateCartItemQuantityInput {
  quantity: number;
}

export interface UpdateCartItemQuantityResponseItem {
  cartItemId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface UpdateCartItemQuantityData {
  cartId: string;
  restaurantId: string;
  itemCount: number;
  subtotal: number;
  updatedAt: string;
  items: UpdateCartItemQuantityResponseItem[];
}

export type RemoveCartItemData = UpdateCartItemQuantityData;
export type ClearCartData = UpdateCartItemQuantityData;

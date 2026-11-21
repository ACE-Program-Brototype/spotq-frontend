export interface CartItemVariant {
  id: string;
  name: string;
  price: number;
}

export interface CartItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  imageUrl?: string | null;
  isVegetarian: boolean;
  selectedVariant: CartItemVariant | null;
  selectedAddons: CartItemAddon[];
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface AddCartItemInput {
  restaurantId: string;
  restaurantName: string;
  menuItemId: string;
  name: string;
  imageUrl?: string | null;
  isVegetarian: boolean;
  basePrice: number;
  selectedVariant: CartItemVariant | null;
  selectedAddons: CartItemAddon[];
  quantity?: number;
}

export interface CartState {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  totalCount: number;
  totalAmount: number;
  savedAt: number | null;
}

export interface AddItemResult {
  success: boolean;
  requiresConfirmation?: boolean;
  currentRestaurantName?: string;
  maxQuantityExceeded?: boolean;
  availableToAdd?: number;
}

export interface CartActions {
  addItem: (input: AddCartItemInput) => AddItemResult;
  confirmReplaceCartAndAdd: (input: AddCartItemInput) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
}

export type CartStore = CartState & CartActions;

export interface BatchCartItemInput {
  menuItemId: string;
  quantity: number;
  variantId?: string | null;
  addonIds?: string[];
  specialInstructions?: string | null;
}

export interface AddBatchCartItemsPayload {
  restaurantId: string;
  items: BatchCartItemInput[];
}

export interface AddBatchCartItemsResponse {
  success: boolean;
  message: string;
  data: {
    cartId: string;
    restaurantId: string;
    items: unknown[];
    itemCount: number;
    subtotal: number;
  };
}

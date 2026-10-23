export type OrderFlowType = "SELF_SERVICE_TABLE" | "QUEUE_PRE_ORDER" | "RUNNING_ADDON";

export type PaymentModeType = "ONLINE" | "PAY_AT_COUNTER";

export interface CartAddon {
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
  addons: CartAddon[];
  imageUrl?: string;
  description?: string;
}

export interface CartData {
  cartId: string;
  restaurantId: string;
  restaurantName?: string;
  userId: string;
  status: string;
  itemCount: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  items: CartItem[];
}

export interface CartApiResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: CartData;
}

export interface DiningContext {
  flow: OrderFlowType;
  tableNumber: string | number;
  restaurantName: string;
  restaurantId: string;
  queueToken?: string;
  estimatedWaitMinutes?: number;
  activeOrderNumber?: string;
}

export interface PlaceOrderPayload {
  restaurantId: string;
  cartId?: string;
  paymentMode: PaymentModeType;
  userName?: string | null;
  userPhone?: string | null;
  specialInstructions?: string | null;
  order_type?: string;
  orderType?: string;
  tableNumber?: number | null;
  queueToken?: string | null;
}

export interface OrderPlacementResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: {
    orderId: string;
    orderNumber: string;
    restaurantId: string;
    restaurantName: string;
    totalAmount: number;
    paymentMode: PaymentModeType;
    orderType?: string;
    tableNumber?: number | null;
    queueToken?: string | null;
    estimatedPrepTimeMinutes?: number;
    createdAt: string;
  };
}

export interface CustomerFormValues {
  userName: string;
  userPhone: string;
  specialInstructions?: string;
}

export interface PriceBreakdown {
  itemsSubtotal: number;
  gstAmount: number;
  gstRate: number;
  platformFee: number;
  grandTotal: number;
}

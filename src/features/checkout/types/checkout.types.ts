export type PaymentModeType = "ONLINE";

export type OrderingModeType = "SELF_ORDER" | "QUEUE_ORDER" | "TAKEAWAY";

export type OrderStatusType =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatusType = "PENDING" | "PAID" | "FAILED";

export interface CheckoutItemAddon {
  addonId: string;
  name: string;
  price: number;
  addonName?: string;
}

export interface CheckoutItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  menuItemName?: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions: string | null;
  addons: CheckoutItemAddon[];
  imageUrl?: string;
  description?: string;
}

export interface CheckoutPaymentContract {
  mode: PaymentModeType;
  paymentRequired: boolean;
}

export interface CheckoutDetailsData {
  cartId: string;
  restaurantId: string;
  restaurantName: string;
  payment: CheckoutPaymentContract;
  itemCount: number;
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  items: CheckoutItem[];
}

export interface CheckoutDetailsResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: CheckoutDetailsData;
}

// Aliases for compatibility
export type CartAddon = CheckoutItemAddon;
export type CartItem = CheckoutItem;
export type CartData = CheckoutDetailsData;
export type CartApiResponse = CheckoutDetailsResponse;

export interface GetCheckoutDetailsParams {
  restaurantId?: string;
  cartId?: string;
}

export interface PlaceOrderPayload {
  restaurantId: string;
  cartId?: string;
  paymentMode: PaymentModeType;
  userName?: string | null;
  userPhone?: string | null;
  specialInstructions?: string | null;
}

export interface PaymentDraftData {
  paymentId: string;
  orderId: string;
  razorpayOrderId: string;
  amountPaise: number;
  currency: string;
  keyId: string;
}

export interface OrderItemAddonResponse {
  id: string;
  addonId: string;
  addonName: string;
  price: number;
}

export interface OrderItemResponse {
  id: string;
  menuItemId: string;
  itemName: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions: string | null;
  addons: OrderItemAddonResponse[];
}

export interface PlacedOrderData {
  id: string;
  orderId?: string;
  orderNumber: string;
  restaurantId: string;
  restaurantName: string | null;
  restaurantPlan?: string | null;
  userId: string | null;
  userName: string | null;
  userPhone: string | null;
  tableId: string | null;
  tableNumber: number | null;
  queueEntryId: string | null;
  paymentId: string | null;
  orderingMode: OrderingModeType;
  paymentMode: PaymentModeType;
  paymentStatus: PaymentStatusType;
  orderStatus: OrderStatusType;
  subtotal: number;
  taxAmount: number;
  platformFee: number;
  discountAmount: number;
  grandTotal: number;
  totalAmount?: number;
  estimatedReadyAt: string | null;
  estimatedPrepTimeMinutes?: number;
  specialInstructions: string | null;
  paymentDraft?: PaymentDraftData | null;
  items: OrderItemResponse[];
  createdAt: string;
}

export interface OrderPlacementResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: PlacedOrderData;
}

export interface VerifyOrderPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyOrderPaymentResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: {
    paymentId: string;
    orderId: string;
    gatewayPaymentId: string;
    status: "CAPTURED" | "FAILED";
    verifiedAt: string;
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

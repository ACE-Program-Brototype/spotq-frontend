import type { OrderStatus } from "./orders.types";

export type OrderingMode = "QUEUE_ORDER" | "SELF_ORDER" | string;
export type CustomerPaymentMode = "ONLINE" | string;
export type CustomerPaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED" | string;

export interface CustomerOrderItemVariant {
  variant_id: string;
  name: string;
}

export interface CustomerOrderItemAddon {
  addon_id: string;
  name: string;
  price: number;
}

export interface CustomerOrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  variant: CustomerOrderItemVariant | null;
  addons: CustomerOrderItemAddon[];
  line_total: number;
}

export interface CustomerOrderRestaurant {
  restaurant_id: string;
  name: string | null;
}

export interface CustomerOrderPricing {
  subtotal: number;
  discounts: number;
  taxes: number;
  platform_fee: number;
  grand_total: number;
  currency: string;
}

export interface CustomerOrderPayment {
  status: CustomerPaymentStatus;
  method: CustomerPaymentMode;
  payment_id: string | null;
  amount_paid: number;
}

export interface CustomerOrderStatusHistory {
  previous_status: OrderStatus | null;
  current_status: OrderStatus;
  notes: string | null;
  created_at: string;
}

export interface CustomerOrderDetails {
  order_id: string;
  order_number: string;
  restaurant: CustomerOrderRestaurant;
  order_type: OrderingMode;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  table_number?: number | null;
  queue_entry_id?: string | null;
  special_instructions?: string | null;
  items: CustomerOrderItem[];
  pricing: CustomerOrderPricing;
  payment: CustomerOrderPayment;
  status_history: CustomerOrderStatusHistory[];
}

export interface CustomerOrderDetailsApiResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  data: {
    order: CustomerOrderDetails;
  };
}

import type { OrderStatus } from "./orders.types";

export interface ReceiptAddon {
  addon_id: string;
  name: string;
  price: number;
}

export interface ReceiptItem {
  id?: string;
  menu_item_id: string;
  name: string;
  variant_id: string | null;
  variant_name: string | null;
  addons: ReceiptAddon[];
  quantity: number;
  unit_price: number;
  line_total: number;
  special_instructions: string | null;
}

export interface ReceiptRestaurant {
  restaurant_id: string;
  name: string;
}

export interface OrderReceipt {
  order_id: string;
  order_number: string;
  restaurant: ReceiptRestaurant;
  status: OrderStatus | string;
  items: ReceiptItem[];
  sub_total: number;
  tax_amount: number;
  tax_rate?: number;
  platform_fee: number;
  total_amount: number;
  created_at: string;
}

export interface OrderReceiptApiResponse {
  success: boolean;
  data: OrderReceipt;
  message?: string;
}

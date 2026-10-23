/**
 * Orders Domain Types & Interfaces
 * Types matching the Customer Order History API response.
 */

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export type OrderFilterStatus = "ALL" | OrderStatus;

export interface OrderHistoryItem {
  order_id: string;
  order_number: string;
  restaurant_id: string;
  restaurant_name: string;
  status: OrderStatus;
  items_count: number;
  total_amount: number;
  created_at: string;
}

export interface OrderPaginationData {
  current_page: number;
  total_pages: number;
  total_orders: number;
  has_next: boolean;
}

export interface OrderHistoryApiResponse {
  success: boolean;
  message: string;
  data: {
    orders: OrderHistoryItem[];
    pagination: OrderPaginationData;
  };
}

export interface GetOrderHistoryParams {
  page?: number;
  limit?: number;
  status?: OrderFilterStatus;
}

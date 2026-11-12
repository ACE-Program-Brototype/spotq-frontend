/**
 * Restaurant Admin Orders Types
 * Type definitions matching the Restaurant Admin Orders Dashboard & Order Details UI.
 */

export type RestaurantOrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export type RestaurantOrderFilterStatus = "ALL" | RestaurantOrderStatus;

export type OrderDateRangeFilter = "TODAY" | "LAST_7_DAYS" | "CUSTOM";

export type OrderType = "DINE_IN" | "TAKEAWAY" | "PRE_ORDER";

export type PaymentMode = "ONLINE" | "COD" | "PAY_AT_COUNTER";

export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";

export interface RestaurantOrderMetricItem {
  id: string;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
}

export interface RestaurantOrderMetrics {
  totalOrders: number;
  totalOrdersTrend?: string;
  grossRevenue: number;
  grossRevenueTrend?: string;
  completedOrders: number;
  completedOrdersRate?: string;
  cancelledOrders: number;
  cancelledOrdersRate?: string;
}

export interface RestaurantOrderListItem {
  orderId: string;
  orderNumber: string;
  orderStatus: RestaurantOrderStatus;
  orderType?: OrderType;
  tableNumber?: number | null;
  customerName?: string | null;
  customerPhone?: string | null;
  itemsCount: number;
  itemsSummary?: string | null;
  grandTotal: number;
  createdAt: string;
}

export interface RestaurantOrderAddon {
  addonId: string;
  addonName: string;
  price: number;
}

export interface RestaurantOrderItemDetail {
  itemId: string;
  menuItemId?: string;
  itemName: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string | null;
  addons?: RestaurantOrderAddon[];
}

export interface RestaurantOrderCustomer {
  userId?: string | null;
  name: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface RestaurantOrderPricing {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  couponCode?: string | null;
  platformFee: number;
  grandTotal: number;
}

export interface RestaurantOrderStatusHistory {
  previousStatus: RestaurantOrderStatus | null;
  currentStatus: RestaurantOrderStatus;
  changedBy: string;
  notes: string | null;
  createdAt: string;
}

export interface RestaurantOrderDetail {
  orderId: string;
  orderNumber: string;
  orderStatus: RestaurantOrderStatus;
  orderType: OrderType;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  customer: RestaurantOrderCustomer;
  tableNumber: number | null;
  estimatedReadyAt?: string | null;
  createdAt: string;
  items: RestaurantOrderItemDetail[];
  pricing: RestaurantOrderPricing;
  statusHistory?: RestaurantOrderStatusHistory[];
  specialInstructions?: string | null;
  cancellationReason?: string | null;
  cancelledAt?: string | null;
}

// API Payloads & Responses
export interface RestaurantOrdersOverviewSummary {
  total_orders: number;
  gross_revenue: number;
  completed_orders: number;
  cancelled_orders: number;
}

export interface GetRestaurantOrdersOverviewApiResponse {
  success: boolean;
  message?: string;
  data: {
    summary: RestaurantOrdersOverviewSummary;
  };
}

export interface RestaurantOrdersPagination {
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
}

export interface RestaurantOrdersListApiResponse {
  success: boolean;
  message?: string;
  data: {
    orders: RestaurantOrderListItem[];
    pagination: RestaurantOrdersPagination;
  };
}

export interface RestaurantOrderDetailApiResponse {
  success: boolean;
  message?: string;
  data: RestaurantOrderDetail;
}

export type RestaurantOrderSortBy = "createdAt" | "grandTotal";
export type RestaurantOrderSortOrder = "asc" | "desc";

export interface GetRestaurantOrdersParams {
  search?: string;
  status?: RestaurantOrderFilterStatus;
  from?: string;
  to?: string;
  sortBy?: RestaurantOrderSortBy;
  sortOrder?: RestaurantOrderSortOrder;
  page?: number;
  limit?: number;
}

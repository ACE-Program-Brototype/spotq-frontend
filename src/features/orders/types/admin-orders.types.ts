/**
 * Platform Admin Orders Domain Types
 * Matching spotq-order-service Admin Orders API DTOs.
 */

export type AdminOrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export type AdminOrderPaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "FAILED";

export type AdminOrderFilterStatus = "ALL" | AdminOrderStatus;
export type AdminOrderFilterPaymentStatus = "ALL" | AdminOrderPaymentStatus;

export type AdminOrdersSortBy = "createdAt" | "updatedAt" | "totalAmount" | "status";
export type AdminOrdersSortOrder = "asc" | "desc";

export interface AdminOrderListItem {
  orderId: string;
  orderNumber: string;
  restaurantId: string;
  restaurantName: string | null;
  customerId: string | null;
  status: AdminOrderStatus;
  paymentStatus: AdminOrderPaymentStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  platformFeeAssessed: number;
  paymentReference: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrdersPaginationData {
  currentPage: number;
  limit: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AdminOrdersMetricsData {
  totalOrders: number;
  ordersByStatus: Partial<Record<AdminOrderStatus, number>>;
  totalOrderValue: number;
}

export interface AdminOrdersApiResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: {
    orders: AdminOrderListItem[];
    pagination: AdminOrdersPaginationData;
    metrics: AdminOrdersMetricsData;
  };
}

export interface GetAdminOrdersParams {
  search?: string;
  status?: string;
  restaurantId?: string;
  customerId?: string;
  paymentStatus?: AdminOrderFilterPaymentStatus;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: AdminOrdersSortBy;
  sortOrder?: AdminOrdersSortOrder;
  page?: number;
  limit?: number;
}

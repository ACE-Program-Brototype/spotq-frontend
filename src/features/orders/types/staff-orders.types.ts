/**
 * Staff Orders Domain Types
 * Matching the Staff Orders Listing API endpoint:
 * GET /api/v1/orders/staff/restaurants/:restaurantId/orders
 */

export type StaffOrderStatus = "PLACED" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED";

export type StaffOrderFilterStatus = "ALL" | StaffOrderStatus;

export type StaffOrderType = "QUEUE_PRO" | "SELF_PRO";
export type StaffOrderTypeFilter = "ALL" | StaffOrderType;

export type StaffOrderSortOrder = "asc" | "desc";

export interface StaffOrderItemAddon {
  id: string;
  name: string;
}

export interface StaffOrderItemVariant {
  id: string | null;
  name: string | null;
}

export interface StaffOrderItem {
  id?: string;
  menuItemId: string;
  name: string;
  quantity: number;
  variant: StaffOrderItemVariant | null;
  addons: StaffOrderItemAddon[];
}

export interface StaffOrderListItem {
  id: string;
  orderNumber: string;
  orderType: StaffOrderType;
  status: StaffOrderStatus;
  createdAt: string;
  queueId: string | null;
  items: StaffOrderItem[];
}

export interface StaffOrdersPaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StaffOrdersListApiResponse {
  success: boolean;
  message: string;
  data: {
    orders: StaffOrderListItem[];
    pagination: StaffOrdersPaginationData;
  };
}

export interface GetStaffOrdersParams {
  search?: string;
  status?: string;
  orderType?: StaffOrderType;
  sortOrder?: StaffOrderSortOrder;
  page?: number;
  limit?: number;
}

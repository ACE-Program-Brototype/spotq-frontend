/**
 * Staff Orders Domain Types
 * Matching the Staff Orders Listing & Details API endpoints:
 * - GET orders/staff/restaurants/:restaurantId/orders
 * - GET orders/staff/restaurants/:restaurantId/orders/:orderId
 * - PATCH orders/staff/:orderId/status
 */

import type {
  ELAPSED_URGENCY,
  STAFF_ORDER_FILTER_STATUS,
  STAFF_ORDER_PRIORITY,
  STAFF_ORDER_SORT_ORDER,
  STAFF_ORDER_STATUS,
  STAFF_ORDER_TYPE,
} from "@/features/orders/constants/staff-orders.constants";

export type StaffOrderStatus = (typeof STAFF_ORDER_STATUS)[keyof typeof STAFF_ORDER_STATUS];

export type StaffOrderFilterStatus =
  (typeof STAFF_ORDER_FILTER_STATUS)[keyof typeof STAFF_ORDER_FILTER_STATUS];

export type StaffOrderType = (typeof STAFF_ORDER_TYPE)[keyof typeof STAFF_ORDER_TYPE];
export type StaffOrderTypeFilter = "ALL" | StaffOrderType;

export type StaffOrderPriority = (typeof STAFF_ORDER_PRIORITY)[keyof typeof STAFF_ORDER_PRIORITY];

export type StaffOrderSortOrder =
  (typeof STAFF_ORDER_SORT_ORDER)[keyof typeof STAFF_ORDER_SORT_ORDER];

export type ElapsedUrgency = (typeof ELAPSED_URGENCY)[keyof typeof ELAPSED_URGENCY];

export interface ElapsedTimerResult {
  formattedElapsed: string;
  totalMinutes: number;
  totalSeconds: number;
  urgency: ElapsedUrgency;
}

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

// ---------------------------------------------------------------------------
// Staff Order Details Types
// ---------------------------------------------------------------------------

export interface StaffOrderDetailAddon {
  id: string;
  name: string;
  price?: number;
}

export interface StaffOrderDetailItem {
  id?: string;
  menuItemId: string;
  name: string;
  quantity: number;
  variant: StaffOrderItemVariant | null;
  addons: StaffOrderDetailAddon[];
  specialInstructions: string | null;
}

export interface StaffOrderDetail {
  id: string;
  orderNumber: string;
  orderType: StaffOrderType | null;
  status: StaffOrderStatus;
  createdAt: string;
  queueId: string | null;
  tableNumber: number | null;
  customerNotes: string | null;
  priority?: StaffOrderPriority | null;
  items: StaffOrderDetailItem[];
  totalQuantity: number;
}

export interface RawStaffOrderDetailAddon {
  addon_id: string;
  name: string;
  price?: number;
}

export interface RawStaffOrderDetailItem {
  id?: string;
  menu_item_id: string;
  name: string;
  variant_id: string | null;
  variant_name: string | null;
  addons: RawStaffOrderDetailAddon[];
  quantity: number;
  special_instructions: string | null;
}

export interface RawStaffOrderDetailResponse {
  order_id: string;
  order_number: string;
  status: StaffOrderStatus;
  customer_notes: string | null;
  items: RawStaffOrderDetailItem[];
  created_at: string;
  order_type?: StaffOrderType | null;
  queue_id?: string | null;
  table_number?: number | null;
  priority?: StaffOrderPriority | null;
}

export interface StaffOrderDetailApiResponse {
  success: boolean;
  message: string;
  data: RawStaffOrderDetailResponse;
}

export interface UpdateStaffOrderStatusPayload {
  orderId: string;
  status: StaffOrderStatus;
  notes?: string;
}

export interface UpdateStaffOrderStatusApiResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    previousStatus: StaffOrderStatus;
    status: StaffOrderStatus;
  };
}

/**
 * Staff Orders Domain Types
 * Matching the Staff Orders Listing & Details API endpoints:
 * - GET orders/staff/restaurants/:restaurantId/orders
 * - GET orders/staff/restaurants/:restaurantId/orders/:orderId
 * - PATCH orders/staff/:orderId/status
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
  orderType: StaffOrderType;
  status: StaffOrderStatus;
  createdAt: string;
  queueId: string | null;
  tableNumber: number | null;
  customerNotes: string | null;
  priority?: "NORMAL" | "HIGH" | "VIP";
  items: StaffOrderDetailItem[];
  totalQuantity: number;
}

export interface RawStaffOrderDetailAddon {
  addon_id?: string;
  addonId?: string;
  id?: string;
  name: string;
  price?: number;
}

export interface RawStaffOrderDetailItem {
  id?: string;
  menu_item_id?: string;
  menuItemId?: string;
  name: string;
  variant_id?: string | null;
  variantId?: string | null;
  variant_name?: string | null;
  variantName?: string | null;
  variant?: StaffOrderItemVariant | null;
  addons?: RawStaffOrderDetailAddon[];
  quantity: number;
  special_instructions?: string | null;
  specialInstructions?: string | null;
}

export interface RawStaffOrderDetailResponse {
  order_id?: string;
  orderId?: string;
  id?: string;
  order_number?: string;
  orderNumber?: string;
  status: StaffOrderStatus;
  customer_notes?: string | null;
  customerNotes?: string | null;
  special_instructions?: string | null;
  specialInstructions?: string | null;
  order_type?: StaffOrderType;
  orderType?: StaffOrderType;
  queue_id?: string | null;
  queueId?: string | null;
  table_number?: number | null;
  tableNumber?: number | null;
  priority?: "NORMAL" | "HIGH" | "VIP";
  items: RawStaffOrderDetailItem[];
  created_at?: string;
  createdAt?: string;
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

/**
 * Staff Orders Service
 * Handles API requests for restaurant staff orders listing, details, and status updates.
 */

import { apiClient } from "@/lib/api/client";
import {
  STAFF_ORDER_FILTER_STATUS,
  STAFF_ORDERS_DEFAULTS,
  STAFF_ORDERS_ENDPOINTS,
  STAFF_ORDERS_MESSAGES,
} from "../constants/staff-orders.constants";
import type {
  GetStaffOrdersParams,
  RawStaffOrderDetailResponse,
  StaffOrderDetail,
  StaffOrderDetailApiResponse,
  StaffOrdersListApiResponse,
  UpdateStaffOrderStatusApiResponse,
  UpdateStaffOrderStatusPayload,
} from "../types/staff-orders.types";

/**
 * Normalizes raw API response (which can have either snake_case or camelCase keys)
 * into a strongly-typed domain model for the UI.
 */
function normalizeStaffOrderDetail(
  raw: RawStaffOrderDetailResponse,
  orderId: string,
): StaffOrderDetail {
  const id = raw.orderId ?? raw.order_id ?? raw.id ?? orderId;
  const orderNumber = raw.orderNumber ?? raw.order_number ?? `#${id.slice(0, 8)}`;
  const status = raw.status;
  const orderType = raw.orderType ?? raw.order_type ?? "QUEUE_PRO";
  const createdAt = raw.createdAt ?? raw.created_at ?? new Date().toISOString();
  const queueId = raw.queueId ?? raw.queue_id ?? null;
  const tableNumber = raw.tableNumber ?? raw.table_number ?? null;
  const customerNotes =
    raw.customerNotes ??
    raw.customer_notes ??
    raw.specialInstructions ??
    raw.special_instructions ??
    null;
  const priority = raw.priority ?? "NORMAL";

  const items = (raw.items ?? []).map((item, index) => {
    const variant =
      item.variant ??
      (item.variantId || item.variant_id || item.variantName || item.variant_name
        ? {
            id: item.variantId ?? item.variant_id ?? null,
            name: item.variantName ?? item.variant_name ?? null,
          }
        : null);

    const addons = (item.addons ?? []).map((addon) => ({
      id: addon.id ?? addon.addonId ?? addon.addon_id ?? "",
      name: addon.name,
      price: addon.price,
    }));

    return {
      id: item.id ?? `${id}-item-${index}`,
      menuItemId: item.menuItemId ?? item.menu_item_id ?? "",
      name: item.name,
      quantity: item.quantity,
      variant,
      addons,
      specialInstructions: item.specialInstructions ?? item.special_instructions ?? null,
    };
  });

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id,
    orderNumber,
    orderType,
    status,
    createdAt,
    queueId,
    tableNumber,
    customerNotes,
    priority,
    items,
    totalQuantity,
  };
}

export const staffOrdersService = {
  /**
   * Fetches paginated staff orders list for the authorized restaurant.
   * Endpoint: GET orders/staff/restaurants/:restaurantId/orders
   */
  async getStaffOrdersList(
    restaurantId: string,
    params?: GetStaffOrdersParams,
  ): Promise<StaffOrdersListApiResponse["data"]> {
    if (!restaurantId?.trim()) {
      throw new Error(STAFF_ORDERS_MESSAGES.RESTAURANT_ID_REQUIRED);
    }

    const searchParams: Record<string, string | number> = {
      page: params?.page ?? STAFF_ORDERS_DEFAULTS.PAGE,
      limit: params?.limit ?? STAFF_ORDERS_DEFAULTS.LIMIT,
      sortOrder: params?.sortOrder ?? STAFF_ORDERS_DEFAULTS.SORT_ORDER,
    };

    if (params?.search?.trim()) {
      searchParams.search = params.search.trim();
    }

    if (params?.status && params.status !== STAFF_ORDER_FILTER_STATUS.ALL) {
      searchParams.status = params.status;
    }

    if (params?.orderType) {
      searchParams.orderType = params.orderType;
    }

    const response = await apiClient
      .get(STAFF_ORDERS_ENDPOINTS.LIST(restaurantId.trim()), {
        searchParams,
      })
      .json<StaffOrdersListApiResponse>();

    return (
      response.data ?? {
        orders: [],
        pagination: {
          page: STAFF_ORDERS_DEFAULTS.PAGE,
          limit: STAFF_ORDERS_DEFAULTS.LIMIT,
          total: 0,
          totalPages: 1,
        },
      }
    );
  },

  /**
   * Fetches complete order details for staff inspection.
   * Endpoint: GET orders/staff/restaurants/:restaurantId/orders/:orderId
   */
  async getStaffOrderDetail(restaurantId: string, orderId: string): Promise<StaffOrderDetail> {
    if (!restaurantId?.trim()) {
      throw new Error(STAFF_ORDERS_MESSAGES.RESTAURANT_ID_REQUIRED);
    }
    if (!orderId?.trim()) {
      throw new Error(STAFF_ORDERS_MESSAGES.ORDER_ID_REQUIRED);
    }

    const response = await apiClient
      .get(STAFF_ORDERS_ENDPOINTS.DETAILS(restaurantId.trim(), orderId.trim()))
      .json<StaffOrderDetailApiResponse>();

    return normalizeStaffOrderDetail(response.data, orderId);
  },

  /**
   * Updates an order's status throughout food preparation.
   * Endpoint: PATCH orders/staff/:orderId/status
   */
  async updateStaffOrderStatus(
    payload: UpdateStaffOrderStatusPayload,
  ): Promise<UpdateStaffOrderStatusApiResponse["data"]> {
    if (!payload.orderId?.trim()) {
      throw new Error(STAFF_ORDERS_MESSAGES.ORDER_ID_REQUIRED);
    }

    const response = await apiClient
      .patch(STAFF_ORDERS_ENDPOINTS.UPDATE_STATUS(payload.orderId.trim()), {
        json: {
          status: payload.status,
          notes: payload.notes,
        },
      })
      .json<UpdateStaffOrderStatusApiResponse>();

    return response.data;
  },
};

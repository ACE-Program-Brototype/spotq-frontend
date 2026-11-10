/**
 * Staff Orders Service
 * Handles API requests for restaurant staff orders listing.
 */

import { apiClient } from "@/lib/api/client";
import {
  STAFF_ORDER_FILTER_STATUS,
  STAFF_ORDERS_DEFAULTS,
  STAFF_ORDERS_ENDPOINTS,
  STAFF_ORDERS_MESSAGES,
} from "../constants/staff-orders.constants";
import type { GetStaffOrdersParams, StaffOrdersListApiResponse } from "../types/staff-orders.types";

export const staffOrdersService = {
  /**
   * Fetches paginated staff orders list for the authorized restaurant.
   * Endpoint: GET /api/v1/orders/staff/restaurants/:restaurantId/orders
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
};

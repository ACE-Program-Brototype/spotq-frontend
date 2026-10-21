/**
 * Orders API Service
 * Interacts with Backend Order Service endpoints for fetching customer order history.
 */

import { apiClient } from "@/lib/api/client";
import {
  ORDER_DEFAULTS,
  ORDER_ENDPOINTS,
  ORDER_FILTER_STATUS,
} from "../constants/orders.constants";
import type {
  GetOrderHistoryParams,
  OrderHistoryApiResponse,
  OrderHistoryItem,
  OrderPaginationData,
} from "../types/orders.types";

export interface NormalizedOrderHistoryResult {
  orders: OrderHistoryItem[];
  pagination: OrderPaginationData;
}

export const ordersService = {
  /**
   * Fetches paginated past orders for the authenticated customer.
   */
  async getOrderHistory(params?: GetOrderHistoryParams): Promise<NormalizedOrderHistoryResult> {
    const page = params?.page ?? ORDER_DEFAULTS.PAGE;
    const limit = params?.limit ?? ORDER_DEFAULTS.LIMIT;

    const searchParams: Record<string, string | number> = {
      page,
      limit,
    };

    if (params?.status && params.status !== ORDER_FILTER_STATUS.ALL) {
      searchParams.status = params.status;
    }

    const response = await apiClient
      .get(ORDER_ENDPOINTS.HISTORY, {
        searchParams,
      })
      .json<OrderHistoryApiResponse>();

    return response.data;
  },
};

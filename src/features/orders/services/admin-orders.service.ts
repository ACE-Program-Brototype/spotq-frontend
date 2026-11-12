/**
 * Platform Admin Orders Service
 * Handles API communication for system-wide admin orders and metrics.
 */

import { apiClient } from "@/lib/api/client";
import { ADMIN_ORDERS_DEFAULTS, ADMIN_ORDERS_ENDPOINTS } from "../constants/admin-orders.constants";
import type { AdminOrdersApiResponse, GetAdminOrdersParams } from "../types/admin-orders.types";

export const adminOrdersService = {
  /**
   * Fetches paginated orders list with platform metrics and status distributions.
   * Endpoint: GET /api/v1/orders/admin
   */
  async getAdminOrders(params?: GetAdminOrdersParams): Promise<AdminOrdersApiResponse["data"]> {
    const searchParams: Record<string, string | number> = {
      page: params?.page ?? ADMIN_ORDERS_DEFAULTS.PAGE,
      limit: params?.limit ?? ADMIN_ORDERS_DEFAULTS.LIMIT,
      sortBy: params?.sortBy ?? ADMIN_ORDERS_DEFAULTS.SORT_BY,
      sortOrder: params?.sortOrder ?? ADMIN_ORDERS_DEFAULTS.SORT_ORDER,
    };

    if (params?.search?.trim()) {
      searchParams.search = params.search.trim();
    }

    if (params?.status?.trim() && params.status !== "ALL") {
      searchParams.status = params.status.trim();
    }

    if (params?.paymentStatus && params.paymentStatus !== "ALL") {
      searchParams.paymentStatus = params.paymentStatus;
    }

    if (params?.restaurantId?.trim()) {
      searchParams.restaurantId = params.restaurantId.trim();
    }

    if (params?.customerId?.trim()) {
      searchParams.customerId = params.customerId.trim();
    }

    if (params?.startDate?.trim()) {
      searchParams.startDate = params.startDate.trim();
    }

    if (params?.endDate?.trim()) {
      searchParams.endDate = params.endDate.trim();
    }

    if (params?.minAmount !== undefined && !Number.isNaN(params.minAmount)) {
      searchParams.minAmount = params.minAmount;
    }

    if (params?.maxAmount !== undefined && !Number.isNaN(params.maxAmount)) {
      searchParams.maxAmount = params.maxAmount;
    }

    const response = await apiClient
      .get(ADMIN_ORDERS_ENDPOINTS.LIST, {
        searchParams,
      })
      .json<AdminOrdersApiResponse>();

    return (
      response.data ?? {
        orders: [],
        pagination: {
          currentPage: ADMIN_ORDERS_DEFAULTS.PAGE,
          limit: ADMIN_ORDERS_DEFAULTS.LIMIT,
          totalPages: 1,
          totalOrders: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        metrics: ADMIN_ORDERS_DEFAULTS.INITIAL_METRICS,
      }
    );
  },
};

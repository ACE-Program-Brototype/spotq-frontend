import { apiClient } from "@/lib/api/client";
import {
  RESTAURANT_ORDERS_DEFAULTS,
  RESTAURANT_ORDERS_ENDPOINTS,
  RESTAURANT_ORDERS_SERVICE_ERRORS,
} from "../constants/restaurant-orders.constants";
import type {
  GetRestaurantOrdersOverviewApiResponse,
  GetRestaurantOrdersParams,
  RestaurantOrderDetail,
  RestaurantOrderDetailApiResponse,
  RestaurantOrderMetrics,
  RestaurantOrdersListApiResponse,
} from "../types/restaurant-orders.types";

export const restaurantOrdersService = {
  /**
   * Fetches high-level metrics for restaurant orders.
   * Endpoint: GET /api/v1/orders/restaurants/:restaurantId/orders/overview
   */
  async getOrdersOverview(
    restaurantId: string,
    filters?: { from?: string; to?: string },
  ): Promise<RestaurantOrderMetrics> {
    if (!restaurantId) {
      throw new Error(RESTAURANT_ORDERS_SERVICE_ERRORS.OVERVIEW_RESTAURANT_ID_REQUIRED);
    }

    const searchParams: Record<string, string> = {};
    if (filters?.from) searchParams.from = filters.from;
    if (filters?.to) searchParams.to = filters.to;

    const response = await apiClient
      .get(RESTAURANT_ORDERS_ENDPOINTS.OVERVIEW(restaurantId), {
        searchParams,
      })
      .json<GetRestaurantOrdersOverviewApiResponse>();

    const summary = response.data?.summary ?? {
      total_orders: 0,
      gross_revenue: 0,
      completed_orders: 0,
      cancelled_orders: 0,
    };

    const total = summary.total_orders || 0;
    const completed = summary.completed_orders || 0;
    const cancelled = summary.cancelled_orders || 0;

    const completedOrdersRate =
      total > 0
        ? `${Math.round((completed / total) * 100)}% completion rate`
        : RESTAURANT_ORDERS_DEFAULTS.DEFAULT_COMPLETION_RATE;
    const cancelledOrdersRate =
      total > 0
        ? `${((cancelled / total) * 100).toFixed(1)}% cancellation rate`
        : RESTAURANT_ORDERS_DEFAULTS.DEFAULT_CANCELLATION_RATE;

    return {
      totalOrders: total,
      grossRevenue: summary.gross_revenue || 0,
      completedOrders: completed,
      completedOrdersRate,
      cancelledOrders: cancelled,
      cancelledOrdersRate,
    };
  },

  /**
   * Fetches paginated restaurant orders list matching filters.
   * Endpoint: GET /api/v1/orders/restaurants/:restaurantId/orders
   */
  async getOrdersList(
    restaurantId: string,
    params?: GetRestaurantOrdersParams,
  ): Promise<RestaurantOrdersListApiResponse["data"]> {
    if (!restaurantId) {
      throw new Error(RESTAURANT_ORDERS_SERVICE_ERRORS.LIST_RESTAURANT_ID_REQUIRED);
    }

    const searchParams: Record<string, string | number> = {
      page: params?.page ?? RESTAURANT_ORDERS_DEFAULTS.PAGE,
      limit: params?.limit ?? RESTAURANT_ORDERS_DEFAULTS.LIMIT,
    };

    if (params?.search && params.search.trim()) {
      searchParams.search = params.search.trim();
    }

    if (params?.status && params.status !== "ALL") {
      searchParams.status = params.status;
    }

    if (params?.from) {
      searchParams.from = params.from;
    }

    if (params?.to) {
      searchParams.to = params.to;
    }

    const response = await apiClient
      .get(RESTAURANT_ORDERS_ENDPOINTS.LIST(restaurantId), {
        searchParams,
      })
      .json<RestaurantOrdersListApiResponse>();

    return (
      response.data ?? {
        orders: [],
        totalOrders: RESTAURANT_ORDERS_DEFAULTS.TOTAL_ORDERS,
        totalPages: RESTAURANT_ORDERS_DEFAULTS.TOTAL_PAGES,
        currentPage: RESTAURANT_ORDERS_DEFAULTS.PAGE,
        hasNext: false,
      }
    );
  },

  /**
   * Fetches comprehensive details of a specific order.
   * Endpoint: GET /api/v1/orders/restaurants/:restaurantId/orders/:orderId
   */
  async getOrderDetail(restaurantId: string, orderId: string): Promise<RestaurantOrderDetail> {
    if (!restaurantId || !orderId) {
      throw new Error(RESTAURANT_ORDERS_SERVICE_ERRORS.DETAIL_IDS_REQUIRED);
    }

    const response = await apiClient
      .get(RESTAURANT_ORDERS_ENDPOINTS.DETAIL(restaurantId, orderId))
      .json<RestaurantOrderDetailApiResponse>();

    return response.data;
  },
};


import { apiClient } from "@/lib/api/client";
import { RESTAURANT_ORDERS_ENDPOINTS } from "../constants/restaurant-orders.constants";
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
      throw new Error("Restaurant ID is required to fetch orders overview");
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
      total > 0 ? `${Math.round((completed / total) * 100)}% completion rate` : "0% completion rate";
    const cancelledOrdersRate =
      total > 0 ? `${((cancelled / total) * 100).toFixed(1)}% cancellation rate` : "0% cancellation rate";

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
      throw new Error("Restaurant ID is required to fetch orders list");
    }

    const searchParams: Record<string, string | number> = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
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
        totalOrders: 0,
        totalPages: 1,
        currentPage: 1,
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
      throw new Error("Restaurant ID and Order ID are required to fetch order details");
    }

    const response = await apiClient
      .get(RESTAURANT_ORDERS_ENDPOINTS.DETAIL(restaurantId, orderId))
      .json<RestaurantOrderDetailApiResponse>();

    return response.data;
  },
};


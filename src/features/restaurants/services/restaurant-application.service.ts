import { apiClient } from "@/lib/api/client";
import {
  APPLICATION_DEFAULTS,
  RESTAURANT_APPLICATION_ENDPOINTS,
} from "../constants/restaurant-application.constants";
import type {
  ApproveApplicationResponse,
  GetRestaurantApplicationsParams,
  PaginatedApplicationsApiResponse,
  RejectApplicationInput,
  RejectApplicationResponse,
  RestaurantApplicationItem,
  SingleApplicationApiResponse,
} from "../types/restaurant-application.types";

export interface NormalizedApplicationsListResult {
  restaurants: RestaurantApplicationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

export const restaurantApplicationService = {
  /**
   * Fetches paginated restaurant applications for administrative review.
   */
  async getRestaurantApplications(
    params: GetRestaurantApplicationsParams = {},
  ): Promise<NormalizedApplicationsListResult> {
    const searchParams: Record<string, string | number> = {
      page: params.page ?? APPLICATION_DEFAULTS.PAGE,
      limit: params.limit ?? APPLICATION_DEFAULTS.LIMIT,
    };

    if (params.status && params.status !== "ALL") {
      searchParams.status = params.status;
    }

    if (params.search?.trim()) {
      searchParams.search = params.search.trim();
    }

    if (params.fromDate) {
      searchParams.fromDate = params.fromDate;
    }

    if (params.toDate) {
      searchParams.toDate = params.toDate;
    }

    if (params.sortBy) {
      searchParams.sortBy = params.sortBy;
    }

    if (params.sortOrder) {
      searchParams.sortOrder = params.sortOrder;
    }

    const response = await apiClient
      .get(RESTAURANT_APPLICATION_ENDPOINTS.LIST, { searchParams })
      .json<PaginatedApplicationsApiResponse>();

    if (!response?.success || !response.data) {
      throw new Error(response?.message || "Failed to fetch restaurant applications.");
    }

    const rawPagination = response.data.pagination;
    const totalPages =
      rawPagination?.total_pages ??
      rawPagination?.totalPages ??
      Math.ceil((rawPagination?.total ?? 0) / (rawPagination?.limit || 10));

    const hasNextPage =
      rawPagination?.has_next_page ??
      rawPagination?.hasNextPage ??
      (rawPagination?.page ?? 1) < totalPages;

    const hasPrevPage =
      rawPagination?.has_prev_page ?? rawPagination?.hasPrevPage ?? (rawPagination?.page ?? 1) > 1;

    return {
      restaurants: response.data.restaurants ?? [],
      pagination: {
        page: rawPagination?.page ?? (params.page || 1),
        limit: rawPagination?.limit ?? (params.limit || 10),
        total: rawPagination?.total ?? 0,
        total_pages: totalPages,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage,
      },
    };
  },

  /**
   * Fetches a single restaurant application by ID.
   */
  async getRestaurantApplicationById(id: string): Promise<RestaurantApplicationItem> {
    if (!id?.trim()) {
      throw new Error("Application ID is required.");
    }

    const response = await apiClient
      .get(RESTAURANT_APPLICATION_ENDPOINTS.DETAILS(id.trim()))
      .json<SingleApplicationApiResponse>();

    if (!response?.success || !response.data) {
      throw new Error(response?.message || "Failed to fetch restaurant application details.");
    }

    return response.data;
  },

  /**
   * Approves a restaurant application.
   */
  async approveRestaurantApplication(id: string): Promise<ApproveApplicationResponse> {
    if (!id?.trim()) {
      throw new Error("Application ID is required.");
    }

    const response = await apiClient
      .patch(RESTAURANT_APPLICATION_ENDPOINTS.APPROVE(id.trim()))
      .json<ApproveApplicationResponse>();

    if (!response?.success) {
      throw new Error(response?.message || "Failed to approve restaurant application.");
    }

    return response;
  },

  /**
   * Rejects a restaurant application with a mandatory reason.
   */
  async rejectRestaurantApplication({
    restaurantId,
    reason,
  }: RejectApplicationInput): Promise<RejectApplicationResponse> {
    if (!restaurantId?.trim()) {
      throw new Error("Application ID is required.");
    }

    const trimmedReason = reason?.trim();
    if (!trimmedReason) {
      throw new Error("A rejection reason is required.");
    }

    if (trimmedReason.length < 5) {
      throw new Error("Rejection reason must be at least 5 characters long.");
    }

    const response = await apiClient
      .patch(RESTAURANT_APPLICATION_ENDPOINTS.REJECT(restaurantId.trim()), {
        json: { reason: trimmedReason },
      })
      .json<RejectApplicationResponse>();

    if (!response?.success) {
      throw new Error(response?.message || "Failed to reject restaurant application.");
    }

    return response;
  },
};

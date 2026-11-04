/**
 * Transaction API Service
 * Interacts with Payment Service endpoints via API Gateway.
 */

import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api.types";
import {
  PAYMENT_METHOD_FILTER,
  TRANSACTION_DEFAULTS,
  TRANSACTION_ENDPOINTS,
  TRANSACTION_STATUS_FILTER,
} from "../constants/transaction.constants";
import type {
  GetTransactionsParams,
  ListTransactionsData,
  PaymentTransactionItem,
  TransactionDetail,
} from "../types/transaction.types";
import {
  type ApiTransactionDetailItem,
  type ApiTransactionDetailResponse,
  mapApiTransactionDetailToDetail,
} from "../utils/transaction.mapper";

interface RawBackendListResponse {
  transactions: PaymentTransactionItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords?: number;
    totalItems?: number;
    limit: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

export const transactionService = {
  /**
   * Fetches paginated list of transactions with optional search and filters.
   */
  async getTransactions(params?: GetTransactionsParams): Promise<ListTransactionsData> {
    const page = params?.page ?? TRANSACTION_DEFAULTS.PAGE;
    const limit = params?.limit ?? TRANSACTION_DEFAULTS.LIMIT;

    const searchParams: Record<string, string | number> = {
      page,
      limit,
    };

    if (params?.search && params.search.trim().length > 0) {
      searchParams.search = params.search.trim();
    }

    if (params?.status && params.status !== TRANSACTION_STATUS_FILTER.ALL) {
      searchParams.status = params.status;
    }

    if (params?.method && params.method !== PAYMENT_METHOD_FILTER.ALL) {
      searchParams.method = params.method;
    }

    if (params?.startDate && params.startDate.trim().length > 0) {
      searchParams.startDate = params.startDate.trim();
    }

    if (params?.endDate && params.endDate.trim().length > 0) {
      searchParams.endDate = params.endDate.trim();
    }

    if (params?.sortBy) {
      searchParams.sortBy = params.sortBy;
    }

    if (params?.sortOrder) {
      searchParams.sortOrder = params.sortOrder;
    }

    const response = await apiClient
      .get(TRANSACTION_ENDPOINTS.BASE, {
        searchParams,
      })
      .json<ApiResponse<RawBackendListResponse>>();

    if (!response.data) {
      throw new Error(response.message || "Failed to load transactions");
    }

    const rawData = response.data;
    const totalItems = rawData.pagination?.totalItems ?? rawData.pagination?.totalRecords ?? 0;
    const currentPage = rawData.pagination?.currentPage || 1;
    const totalPages = rawData.pagination?.totalPages || 1;

    return {
      transactions: rawData.transactions || [],
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        limit: rawData.pagination?.limit || limit,
        hasNextPage: rawData.pagination?.hasNextPage ?? currentPage < totalPages,
        hasPrevPage: rawData.pagination?.hasPrevPage ?? currentPage > 1,
      },
    };
  },

  /**
   * Fetches deep transaction details by ID for the slide-over drawer.
   */
  async getTransactionDetail(id: string): Promise<TransactionDetail> {
    if (!id || id.trim().length === 0) {
      throw new Error("Transaction ID is required");
    }

    const response = await apiClient
      .get(TRANSACTION_ENDPOINTS.DETAIL(id.trim()))
      .json<ApiResponse<ApiTransactionDetailItem | ApiTransactionDetailResponse>>();

    if (!response.data) {
      throw new Error(response.message || "Failed to load transaction details");
    }

    return mapApiTransactionDetailToDetail(response.data);
  },
};

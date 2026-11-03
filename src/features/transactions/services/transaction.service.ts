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
  TransactionDetail,
} from "../types/transaction.types";

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

    if (typeof params?.minAmount === "number" && !Number.isNaN(params.minAmount)) {
      searchParams.minAmount = params.minAmount;
    }

    if (typeof params?.maxAmount === "number" && !Number.isNaN(params.maxAmount)) {
      searchParams.maxAmount = params.maxAmount;
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
      .json<ApiResponse<ListTransactionsData>>();

    if (!response.data) {
      throw new Error(response.message || "Failed to load transactions");
    }

    return response.data;
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
      .json<ApiResponse<TransactionDetail>>();

    if (!response.data) {
      throw new Error(response.message || "Failed to load transaction details");
    }

    return response.data;
  },
};

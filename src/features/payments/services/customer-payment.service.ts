/**
 * Customer Payment Service
 * API client methods for fetching payment history, initiating retries,
 * verifying checkout signatures, and downloading invoices.
 */

import {
  CUSTOMER_PAYMENT_DEFAULTS,
  CUSTOMER_PAYMENT_ENDPOINTS,
  CUSTOMER_PAYMENT_MESSAGES,
  CUSTOMER_PAYMENT_STATUS,
} from "@/features/payments/constants/customer-payment.constants";
import type {
  CustomerPaymentTransaction,
  GetCustomerPaymentHistoryParams,
  GetCustomerPaymentHistoryResponse,
  InvoiceDownloadApiResponse,
  RetryPaymentApiResponse,
  RetryPaymentResponseData,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "@/features/payments/types/customer-payment.types";
import { apiClient } from "@/lib/api/client";

interface RawPaymentPagination {
  total?: number;
  totalItems?: number;
  totalRecords?: number;
  page?: number;
  currentPage?: number;
  limit?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasNextPage?: boolean;
  hasPrev?: boolean;
  hasPrevPage?: boolean;
}

interface RawPaymentHistoryResponse {
  success?: boolean;
  message?: string;
  data?: {
    transactions?: CustomerPaymentTransaction[];
    pagination?: RawPaymentPagination;
  };
  transactions?: CustomerPaymentTransaction[];
  pagination?: RawPaymentPagination;
}

export const customerPaymentService = {
  /**
   * Fetches paginated customer dining payment transactions.
   */
  async getPaymentHistory(
    params?: GetCustomerPaymentHistoryParams,
  ): Promise<GetCustomerPaymentHistoryResponse> {
    const page = params?.page ?? CUSTOMER_PAYMENT_DEFAULTS.PAGE;
    const limit = params?.limit ?? CUSTOMER_PAYMENT_DEFAULTS.LIMIT;
    const rawStatus = params?.status ?? CUSTOMER_PAYMENT_DEFAULTS.STATUS;
    const apiStatus =
      rawStatus === CUSTOMER_PAYMENT_STATUS.SUCCESS ? CUSTOMER_PAYMENT_STATUS.CAPTURED : rawStatus;

    const searchParams: Record<string, string | number> = {
      page,
      limit,
    };

    if (apiStatus && apiStatus !== "ALL") {
      searchParams.status = apiStatus;
    }

    if (params?.startDate?.trim()) {
      searchParams.startDate = params.startDate.trim();
    }
    if (params?.endDate?.trim()) {
      searchParams.endDate = params.endDate.trim();
    }
    if (params?.sortBy) {
      searchParams.sortBy = params.sortBy;
    }
    if (params?.sortOrder) {
      searchParams.sortOrder = params.sortOrder.toLowerCase();
    }

    const response = await apiClient
      .get(CUSTOMER_PAYMENT_ENDPOINTS.HISTORY, {
        searchParams,
      })
      .json<RawPaymentHistoryResponse>();

    const rawTransactions = response.data?.transactions ?? response.transactions ?? [];
    const rawPagination = response.data?.pagination ?? response.pagination ?? {};

    const totalItems =
      rawPagination.total ??
      rawPagination.totalItems ??
      rawPagination.totalRecords ??
      rawTransactions.length;
    const pageSize = rawPagination.limit ?? rawPagination.pageSize ?? limit;
    const totalPages =
      rawPagination.totalPages ?? Math.max(1, Math.ceil(totalItems / (pageSize || 1)));
    const currentPage = rawPagination.page ?? rawPagination.currentPage ?? page;
    const hasNextPage =
      rawPagination.hasNext ?? rawPagination.hasNextPage ?? currentPage < totalPages;
    const hasPrevPage = rawPagination.hasPrev ?? rawPagination.hasPrevPage ?? currentPage > 1;

    return {
      transactions: rawTransactions,
      pagination: {
        currentPage,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage,
        hasPrevPage,
        total: totalItems,
        page: currentPage,
        limit: pageSize,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage,
      },
    };
  },

  /**
   * Initiates payment retry for a failed transaction.
   * Returns Razorpay order details.
   */
  async retryPayment(transactionId: string): Promise<RetryPaymentResponseData> {
    const response = await apiClient
      .post(CUSTOMER_PAYMENT_ENDPOINTS.RETRY(transactionId))
      .json<RetryPaymentApiResponse>();

    if (response?.data) {
      return response.data;
    }

    throw new Error(response?.message || CUSTOMER_PAYMENT_MESSAGES.ERROR_RETRY_FAILED);
  },

  /**
   * Submits Razorpay signature response to finalize and verify order payment.
   */
  async verifyPayment(payload: VerifyPaymentPayload): Promise<VerifyPaymentResponse> {
    const response = await apiClient
      .post(CUSTOMER_PAYMENT_ENDPOINTS.VERIFY, {
        json: payload,
      })
      .json<VerifyPaymentResponse>();

    return response;
  },

  /**
   * Fetches the presigned S3 URL for downloading official GST tax invoice.
   */
  async getInvoiceDownloadUrl(transactionIdOrUrl: string): Promise<string> {
    const trimmed = transactionIdOrUrl?.trim();
    if (!trimmed) {
      throw new Error(CUSTOMER_PAYMENT_MESSAGES.ERROR_INVOICE_TARGET_REQUIRED);
    }

    // Strip optional leading slash and api/v1 prefix if a relative API path was supplied
    const endpoint = trimmed.includes("/")
      ? trimmed.replace(/^\/?(api\/v1\/)?/, "")
      : CUSTOMER_PAYMENT_ENDPOINTS.INVOICE(trimmed);

    const response = await apiClient.get(endpoint).json<InvoiceDownloadApiResponse>();

    let presignedUrl: string | undefined;
    if (typeof response?.data === "string") {
      presignedUrl = response.data;
    } else if (response?.data && typeof response.data === "object") {
      presignedUrl =
        response.data.downloadUrl ||
        response.data.url ||
        response.data.presignedUrl ||
        response.data.download_url ||
        response.data.s3Url;
    }

    if (!presignedUrl) {
      presignedUrl = response?.downloadUrl || response?.url || response?.presignedUrl;
    }

    if (!presignedUrl) {
      throw new Error(response?.message || CUSTOMER_PAYMENT_MESSAGES.ERROR_INVOICE_URL_FAILED);
    }

    return presignedUrl;
  },
};

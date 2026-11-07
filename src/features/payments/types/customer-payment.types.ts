/**
 * Customer Payment History Types
 * Domain model and API contract definitions for customer payment transactions,
 * retry flows, and filtering.
 */

export type CustomerPaymentStatus = "SUCCESS" | "CAPTURED" | "FAILED" | "REFUNDED";

export type PaymentFilterStatus = "ALL" | "SUCCESS" | "CAPTURED" | "FAILED" | "REFUNDED";

export type CustomerPaymentSortBy = "createdAt" | "amountPaise";

export type CustomerPaymentSortOrder = "asc" | "desc";

export interface CustomerRefundDetails {
  refundId?: string;
  razorpayRefundId?: string | null;
  arn?: string | null;
  amountPaise?: number;
  amountInRupees?: number;
  status?: string;
  reason?: string | null;
  processedAt?: string | null;
  refundedAt?: string | null;
}

export interface CustomerPaymentTransaction {
  transactionId: string;
  orderId: string;
  orderNumber?: string;
  restaurantId?: string;
  amountPaise: number;
  amountInRupees: number;
  currency: string;
  paymentMethod: string;
  status: CustomerPaymentStatus | string;
  failureReason?: string | null;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
  createdAt: string;
  hasInvoice: boolean;
  invoiceUrl?: string | null;
  retryEligible: boolean;
  retryExpiresAt?: string | null;
  refundDetails?: CustomerRefundDetails | null;
  _justSucceeded?: boolean;
}

export interface CustomerPaymentPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  total?: number;
  page?: number;
  limit?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface GetCustomerPaymentHistoryParams {
  page?: number;
  limit?: number;
  status?: PaymentFilterStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: CustomerPaymentSortBy;
  sortOrder?: CustomerPaymentSortOrder;
}

export interface GetCustomerPaymentHistoryResponse {
  transactions: CustomerPaymentTransaction[];
  pagination: CustomerPaymentPagination;
}

export interface RetryPaymentResponseData {
  transactionId: string;
  orderId: string;
  razorpayOrderId: string;
  amountPaise: number;
  amountInRupees: number;
  currency: string;
  keyId: string;
}

export interface RetryPaymentApiResponse {
  success: boolean;
  message: string;
  data: RetryPaymentResponseData;
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface InvoiceDownloadData {
  downloadUrl?: string;
  url?: string;
  presignedUrl?: string;
  download_url?: string;
  s3Url?: string;
}

export interface InvoiceDownloadApiResponse {
  success?: boolean;
  message?: string;
  data?: InvoiceDownloadData | string;
  downloadUrl?: string;
  url?: string;
  presignedUrl?: string;
}

export interface RazorpayStandardOptions {
  key: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler?: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
}

export interface RazorpayStandardInstance {
  open: () => void;
  close?: () => void;
  on?: (event: string, callback: (response: unknown) => void) => void;
}

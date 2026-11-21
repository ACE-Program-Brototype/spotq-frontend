/**
 * Transaction Types
 * Data contracts matching Backend Payment Service API specifications.
 */

export type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";

export type PaymentMethod = "UPI" | "CARD" | "NETBANKING";

export type SettlementStatus = "PENDING_EOD" | "SETTLED" | "DEDUCTED_EOD" | "N_A";

export interface PaymentTransactionItem {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  razorpayPaymentId: string;
  paymentMethod: PaymentMethod | string;
  amountPaise: number;
  amountFormatted: string;
  status: TransactionStatus;
  settlementStatus: SettlementStatus | string;
  createdAt: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TransactionCustomerContext {
  id: string;
  name: string;
  contact: string;
  tableNumber: string;
  tokenNumber: string;
}

export interface TransactionOrderContext {
  id: string;
  orderNumber: string;
  status: string;
}

export interface TransactionFinancialBreakdown {
  subtotalPaise: number;
  subtotalFormatted: string;
  gstPaise: number;
  gstPercentage: number;
  gstFormatted: string;
  discountPaise: number;
  discountFormatted: string;
  totalPaise: number;
  totalFormatted: string;
}

export interface TransactionGatewayDetails {
  name: string;
  paymentId: string;
  orderId: string;
  method: string;
  vpaOrCard: string;
  bankRrn: string;
  settlementStatus: string;
  expectedSettlementDate: string;
}

export interface TransactionRefundDetails {
  id: string;
  amountPaise: number;
  amountFormatted: string;
  status: string;
  reason: string;
  createdAt: string;
}

export interface TransactionDetail {
  id: string;
  status: TransactionStatus;
  createdAt: string;
  customer: TransactionCustomerContext;
  order: TransactionOrderContext;
  financialBreakdown: TransactionFinancialBreakdown;
  gateway: TransactionGatewayDetails;
  refund: TransactionRefundDetails | null;
}

export interface ListTransactionsData {
  transactions: PaymentTransactionItem[];
  pagination: PaginationData;
}

export interface GetTransactionsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  method?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "createdAt" | "amountPaise" | string;
  sortOrder?: "asc" | "desc";
}

export interface TransactionFiltersState {
  search: string;
  status: string;
  method: string;
  datePreset: string;
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

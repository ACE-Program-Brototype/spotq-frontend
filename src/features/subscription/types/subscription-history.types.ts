export type SubscriptionBillingStatus = "SUCCESS" | "FAILED" | "CREATED";
export type SubscriptionBillingFilterStatus = "ALL" | SubscriptionBillingStatus;
export type SubscriptionBillingCycle = "MONTHLY" | "YEARLY";

export interface SubscriptionBillingTransactionItem {
  id: string;
  planCode: string;
  planName: string;
  billingCycle: SubscriptionBillingCycle;
  amountPaise: number;
  amountRupees: number;
  currency: string;
  status: SubscriptionBillingStatus;
  razorpayPaymentId: string | null;
  invoiceNumber: string | null;
  invoiceUrl: string | null;
  createdAt: string;
}

export interface SubscriptionBillingPagination {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SubscriptionBillingHistoryData {
  transactions: SubscriptionBillingTransactionItem[];
  pagination: SubscriptionBillingPagination;
}

export interface GetSubscriptionHistoryParams {
  page?: number;
  limit?: number;
  status?: SubscriptionBillingFilterStatus;
}

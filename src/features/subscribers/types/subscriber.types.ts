export type SubscriberBillingCycle = "MONTHLY" | "YEARLY";

export type SubscriberStatus = "ACTIVE" | "PENDING" | "EXPIRED" | "CANCELLED" | "PAST_DUE";

export type SubscriberFilterStatus = "ALL" | SubscriberStatus;

export interface SubscriberPlan {
  id: string;
  name: string;
  code: string;
  billingCycle: SubscriberBillingCycle;
  price: number;
  currency: string;
  description: string | null;
  features: string[];
}

export interface SubscriberSummary {
  id: string;
  restaurantId: string;
  restaurantName: string;
  subscriberName: string;
  subscriberEmail: string;
  planId?: string;
  planName: string;
  planCode: string;
  billingCycle: SubscriberBillingCycle;
  price: number;
  currency: string;
  status: SubscriberStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  canceledAt?: string | null;
  cancelledAt?: string | null;
  plan?: SubscriberPlan | null;
}

export interface SubscriberTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string;
}

export interface SubscriberInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

export interface SubscriberDetail {
  id: string;
  restaurantId: string;
  restaurantName: string;
  subscriberName: string;
  subscriberEmail: string;
  status: SubscriberStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  canceledAt: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  plan: SubscriberPlan | null;
  transactions: SubscriberTransaction[];
  invoices: SubscriberInvoice[];
}

export interface SubscriberPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SubscribersListData {
  subscribers: SubscriberSummary[];
  pagination: SubscriberPagination;
}

export interface GetSubscribersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SubscribersApiResponse {
  success: boolean;
  message: string;
  data: SubscribersListData;
}

export interface SubscriberDetailsApiResponse {
  success: boolean;
  message: string;
  data: SubscriberDetail;
}

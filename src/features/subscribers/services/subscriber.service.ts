import { apiClient } from "@/lib/api/client";
import {
  SUBSCRIBER_DEFAULTS,
  SUBSCRIBER_ENDPOINTS,
  SUBSCRIBER_FILTER_STATUS,
} from "../constants/subscriber.constants";
import type {
  GetSubscribersParams,
  SubscriberBillingCycle,
  SubscriberDetail,
  SubscriberDetailsApiResponse,
  SubscriberInvoice,
  SubscriberPlan,
  SubscriberSummary,
  SubscribersApiResponse,
  SubscribersListData,
  SubscriberTransaction,
} from "../types/subscriber.types";

interface RawPlanPayload {
  id?: string;
  name?: string;
  code?: string;
  billingCycle?: string;
  pricePaise?: number;
  price?: number;
  currency?: string;
  description?: string | null;
  features?: string[];
  isActive?: boolean;
}

interface RawSubscriberPayload {
  id: string;
  restaurantId: string;
  restaurantName?: string | null;
  restaurant?: { name?: string };
  subscriberName?: string | null;
  subscriberEmail?: string | null;
  subscriber?: { name?: string; email?: string };
  restaurantStatus?: string | null;
  isRestaurantBlocked?: boolean;
  planId?: string;
  planName?: string;
  planCode?: string;
  billingCycle?: string;
  price?: number;
  pricePaise?: number;
  currency?: string;
  status: SubscriberSummary["status"];
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  canceledAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  plan?: RawPlanPayload | null;
}

interface RawTransactionPayload {
  id: string;
  amount?: number;
  amountPaise?: number;
  currency?: string;
  status?: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  createdAt: string;
}

interface RawInvoicePayload {
  id: string;
  invoiceNumber: string;
  amount?: number;
  amountPaise?: number;
  currency?: string;
  status?: string;
  paidAt?: string | null;
  createdAt: string;
}

interface RawSubscriberDetailPayload extends RawSubscriberPayload {
  transactions?: RawTransactionPayload[];
  invoices?: RawInvoicePayload[];
}

function normalizeBillingCycle(cycle?: string | null): SubscriberBillingCycle {
  return cycle?.toUpperCase() === "YEARLY" ? "YEARLY" : "MONTHLY";
}

function normalizePlan(rawPlan?: RawPlanPayload | null): SubscriberPlan | null {
  if (!rawPlan) return null;
  return {
    id: rawPlan.id || "",
    name: rawPlan.name || rawPlan.code || "-",
    code: rawPlan.code || "-",
    billingCycle: normalizeBillingCycle(rawPlan.billingCycle),
    price: rawPlan.pricePaise ?? rawPlan.price ?? 0,
    currency: rawPlan.currency || "INR",
    description: rawPlan.description || null,
    features: Array.isArray(rawPlan.features) ? rawPlan.features : [],
  };
}

function normalizeSubscriberSummary(raw: RawSubscriberPayload): SubscriberSummary {
  const plan = normalizePlan(raw.plan);
  const planName = raw.planName || plan?.name || raw.planCode || plan?.code || "-";
  const planCode = raw.planCode || plan?.code || "-";
  const billingCycle = normalizeBillingCycle(raw.billingCycle || plan?.billingCycle);
  const price = raw.pricePaise ?? raw.price ?? plan?.price ?? 0;
  const currency = raw.currency || plan?.currency || "INR";

  const restaurantName = raw.restaurantName || raw.restaurant?.name || "-";

  const subscriberEmail = raw.subscriberEmail || raw.subscriber?.email || "-";

  const subscriberName =
    raw.subscriberName ||
    raw.subscriber?.name ||
    (subscriberEmail !== "-" ? subscriberEmail.split("@")[0] : "-");

  return {
    id: raw.id,
    restaurantId: raw.restaurantId,
    restaurantName,
    subscriberName,
    subscriberEmail,
    planId: raw.planId || plan?.id || "",
    planName,
    planCode,
    billingCycle,
    price,
    currency,
    status: raw.status,
    currentPeriodStart: raw.currentPeriodStart || raw.createdAt,
    currentPeriodEnd: raw.currentPeriodEnd || raw.createdAt,
    createdAt: raw.createdAt,
    canceledAt: raw.canceledAt || null,
    plan,
  };
}

export const subscriberService = {
  /**
   * Fetch paginated subscribers list with search, status filtering, and sorting
   * Single API call to payment-service, enriched internally with restaurant data
   */
  async getSubscribers(params?: GetSubscribersParams): Promise<SubscribersListData> {
    const searchParams: Record<string, string | number> = {
      page: params?.page ?? SUBSCRIBER_DEFAULTS.PAGE,
      limit: params?.limit ?? SUBSCRIBER_DEFAULTS.LIMIT,
      sortBy: params?.sortBy ?? SUBSCRIBER_DEFAULTS.SORT_BY,
      sortOrder: params?.sortOrder ?? SUBSCRIBER_DEFAULTS.SORT_ORDER,
    };

    if (params?.status && params.status !== SUBSCRIBER_FILTER_STATUS.ALL) {
      searchParams.status = params.status;
    }

    if (params?.search?.trim()) {
      searchParams.search = params.search.trim();
    }

    const response = await apiClient
      .get(SUBSCRIBER_ENDPOINTS.LIST, { searchParams })
      .json<SubscribersApiResponse>();

    const rawSubscribers = (response?.data?.subscribers || []) as unknown as RawSubscriberPayload[];

    return {
      subscribers: rawSubscribers.map((raw) => normalizeSubscriberSummary(raw)),
      pagination: response?.data?.pagination || {
        currentPage: Number(searchParams.page),
        pageSize: Number(searchParams.limit),
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  },

  /**
   * Fetch details for a specific subscriber by ID
   * Single API call to payment-service, enriched internally with restaurant details
   */
  async getSubscriberDetails(subscriberId: string): Promise<SubscriberDetail> {
    const response = await apiClient
      .get(SUBSCRIBER_ENDPOINTS.DETAILS(subscriberId))
      .json<SubscriberDetailsApiResponse>();

    const raw = response.data as unknown as RawSubscriberDetailPayload;
    const plan = normalizePlan(raw.plan);

    const restaurantName = raw.restaurantName || raw.restaurant?.name || "-";
    const subscriberEmail = raw.subscriberEmail || raw.subscriber?.email || "-";
    const subscriberName =
      raw.subscriberName ||
      raw.subscriber?.name ||
      (subscriberEmail !== "-" ? subscriberEmail.split("@")[0] : "-");

    const transactions: SubscriberTransaction[] = (raw.transactions || []).map((tx) => ({
      id: tx.id,
      amount: tx.amountPaise ?? tx.amount ?? 0,
      currency: tx.currency || "INR",
      status: tx.status || "UNKNOWN",
      razorpayOrderId: tx.razorpayOrderId || null,
      razorpayPaymentId: tx.razorpayPaymentId || null,
      createdAt: tx.createdAt,
    }));

    const invoices: SubscriberInvoice[] = (raw.invoices || []).map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      amount: inv.amountPaise ?? inv.amount ?? 0,
      currency: inv.currency || "INR",
      status: inv.status || "UNKNOWN",
      paidAt: inv.paidAt || null,
      createdAt: inv.createdAt,
    }));

    return {
      id: raw.id,
      restaurantId: raw.restaurantId,
      restaurantName,
      subscriberName,
      subscriberEmail,
      status: raw.status,
      currentPeriodStart: raw.currentPeriodStart || raw.createdAt,
      currentPeriodEnd: raw.currentPeriodEnd || raw.createdAt,
      canceledAt: raw.canceledAt || null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt || raw.createdAt,
      plan,
      transactions,
      invoices,
    };
  },
};

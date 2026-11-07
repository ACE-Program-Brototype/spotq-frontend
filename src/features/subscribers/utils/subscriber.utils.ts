import { formatCurrency } from "@/lib/utils/currency";
import { SUBSCRIBER_MESSAGES, SUBSCRIBER_STATUS } from "../constants/subscriber.constants";

/**
 * Format price in paise to currency string (default INR)
 */
export function formatPrice(amountInPaise: number, currency = "INR"): string {
  if (typeof amountInPaise !== "number" || !Number.isFinite(amountInPaise)) {
    return SUBSCRIBER_MESSAGES.NOT_APPLICABLE;
  }

  const amountInUnits = amountInPaise / 100;
  if (currency.toUpperCase() === "INR") {
    return formatCurrency(amountInUnits);
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountInUnits);
  } catch {
    return `${currency.toUpperCase()} ${amountInUnits.toFixed(2)}`;
  }
}

/**
 * Format billing cycle (e.g. MONTHLY -> Monthly)
 */
export function formatBillingCycle(cycle?: string | null): string {
  if (!cycle) return SUBSCRIBER_MESSAGES.NOT_APPLICABLE;
  const lower = cycle.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Resolves color classes and indicators for subscriber status
 */
export function getSubscriberStatusStyles(status?: string | null): {
  badge: string;
  dot: string;
  label: string;
} {
  const normalized = (status || "").toUpperCase();

  switch (normalized) {
    case SUBSCRIBER_STATUS.ACTIVE:
      return {
        badge: "bg-emerald-100/80 text-emerald-800 border-emerald-200",
        dot: "bg-emerald-600",
        label: "ACTIVE",
      };
    case SUBSCRIBER_STATUS.PENDING:
      return {
        badge: "bg-amber-100/80 text-amber-800 border-amber-200",
        dot: "bg-amber-600",
        label: "PENDING",
      };
    case SUBSCRIBER_STATUS.EXPIRED:
      return {
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-500",
        label: "EXPIRED",
      };
    case SUBSCRIBER_STATUS.CANCELLED:
      return {
        badge: "bg-rose-100/80 text-rose-800 border-rose-200",
        dot: "bg-rose-600",
        label: "CANCELLED",
      };
    case SUBSCRIBER_STATUS.PAST_DUE:
      return {
        badge: "bg-orange-100/80 text-orange-800 border-orange-200",
        dot: "bg-orange-600",
        label: "PAST DUE",
      };
    default:
      return {
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-400",
        label: normalized || SUBSCRIBER_MESSAGES.NOT_APPLICABLE,
      };
  }
}

/**
 * Resolves color classes for transaction / invoice statuses
 */
export function getPaymentStatusBadgeClass(status?: string | null): string {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "SUCCESS":
    case "PAID":
      return "bg-emerald-100/80 text-emerald-800 border-emerald-200";
    case "PENDING":
    case "PROCESSING":
      return "bg-amber-100/80 text-amber-800 border-amber-200";
    case "FAILED":
    case "VOID":
      return "bg-rose-100/80 text-rose-800 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

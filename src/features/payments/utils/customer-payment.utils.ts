/**
 * Customer Payment Utilities
 * Validation and normalization helpers for payment retry expiration,
 * status badges, and API error parsing.
 */

import type { CustomerPaymentStatus } from "../types/customer-payment.types";

/**
 * Determines whether a transaction's retry window has expired.
 * True if retryEligible is explicitly false or retryExpiresAt is in the past.
 */
export function isPaymentRetryExpired(
  retryExpiresAt?: string | null,
  retryEligible?: boolean,
): boolean {
  if (retryEligible === false) return true;
  if (!retryExpiresAt) return false;

  try {
    const expiryTime = new Date(retryExpiresAt).getTime();
    if (Number.isNaN(expiryTime)) return false;
    return expiryTime <= Date.now();
  } catch {
    return false;
  }
}

/**
 * Normalizes payment status strings to standard badge keys.
 * CAPTURED -> SUCCESS
 */
export function normalizePaymentStatus(status?: string | null): CustomerPaymentStatus {
  const upper = (status || "").toUpperCase();
  if (upper === "CAPTURED" || upper === "SUCCESS") return "SUCCESS";
  if (upper === "FAILED") return "FAILED";
  if (upper === "REFUNDED") return "REFUNDED";
  return "SUCCESS";
}

/**
 * Extracts status code and message from ky or generic HTTP errors safely.
 */
export async function parseApiError(err: unknown): Promise<{
  status?: number;
  message?: string;
}> {
  if (!err || typeof err !== "object") {
    return {};
  }

  const result: { status?: number; message?: string } = {};

  if ("response" in err && err.response && typeof err.response === "object") {
    const res = err.response as Response;
    result.status = res.status;
    try {
      const cloned = typeof res.clone === "function" ? res.clone() : res;
      const data = await cloned.json();
      result.message = data?.message || data?.error || data?.data?.message;
    } catch {
      // response body could not be parsed as json
    }
  } else if ("status" in err && typeof (err as { status: unknown }).status === "number") {
    result.status = (err as { status: number }).status;
  }

  if (
    !result.message &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  ) {
    result.message = (err as { message: string }).message;
  }

  return result;
}

/**
 * Formats order identifier for display.
 * If a sequential order number exists (e.g. "1042"), prefixes with '#' (#1042).
 * If only a UUID exists (e.g. "ce559b09-a501-..."), returns shortened UUID with ellipsis (ce559b09...).
 */
export function formatOrderDisplayId(orderNumber?: string | null, orderId?: string | null): string {
  if (orderNumber) {
    return `#${orderNumber}`;
  }
  if (!orderId) {
    return "--";
  }
  return `${orderId.slice(0, 8)}...`;
}

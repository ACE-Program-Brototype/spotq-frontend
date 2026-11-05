/**
 * Transaction Constants
 * Query keys, defaults, and filter option definitions.
 */

import type { GetTransactionsParams } from "../types/transaction.types";

export const TRANSACTION_ENDPOINTS = {
  BASE: "payments/transactions",
  DETAIL: (id: string) => `payments/transactions/${id}`,
} as const;

export const TRANSACTION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  STATUS: "ALL",
  METHOD: "ALL",
  DATE_PRESET: "ALL",
  SORT_BY: "createdAt",
  SORT_ORDER: "desc" as const,
  SEARCH_DEBOUNCE_MS: 300,
} as const;

export const TRANSACTION_STATUS_FILTER = {
  ALL: "ALL",
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export const PAYMENT_METHOD_FILTER = {
  ALL: "ALL",
  UPI: "UPI",
  CARD: "CARD",
  NETBANKING: "NETBANKING",
} as const;

export const DATE_PRESET_OPTIONS = {
  ALL: "ALL",
  TODAY: "TODAY",
  YESTERDAY: "YESTERDAY",
  LAST_7_DAYS: "LAST_7_DAYS",
  THIS_MONTH: "THIS_MONTH",
  CUSTOM: "CUSTOM",
} as const;

export const CSV_FORMULA_INJECTION_PREFIXES = ["=", "+", "-", "@", "\t", "\r"] as const;

export const TRANSACTIONS_QUERY_KEYS = {
  all: ["transactions"] as const,
  lists: () => [...TRANSACTIONS_QUERY_KEYS.all, "list"] as const,
  list: (params?: GetTransactionsParams) => [...TRANSACTIONS_QUERY_KEYS.lists(), params] as const,
  details: () => [...TRANSACTIONS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string | null) => [...TRANSACTIONS_QUERY_KEYS.details(), id] as const,
};

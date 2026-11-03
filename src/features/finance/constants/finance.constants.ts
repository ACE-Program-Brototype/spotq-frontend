import type { LedgerQuery } from "../services/finance.service";

export const LEDGER_ENTRY_TYPE = {
  CUSTOMER_PAYMENT_INTAKE: "CUSTOMER_PAYMENT_INTAKE",
  SETTLEMENT_DISBURSED: "SETTLEMENT_DISBURSED",
  REFUND_EXPENSE: "REFUND_EXPENSE",
} as const;

export const FINANCE_PAGE_SIZE = 4;
export const DEFAULT_FINANCE_DATE_PRESET = "LAST_30_DAYS";
export const FINANCE_ENDPOINTS = {
  SUMMARY: "/payments/admin/finance/summary",
  LEDGER: "/payments/admin/finance/ledger",
  EXPORT_CSV: "/payments/admin/finance/ledger/export.csv",
} as const;

export const FINANCE_QUERY_KEY = {
  all: ["finance"] as const,
  summary: () => [...FINANCE_QUERY_KEY.all, "summary"] as const,
  ledger: (query: LedgerQuery) => [...FINANCE_QUERY_KEY.all, "ledger", query] as const,
};

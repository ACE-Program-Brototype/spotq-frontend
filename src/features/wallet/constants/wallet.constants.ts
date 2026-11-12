export const ACCOUNT_NUMBER_REGEX = /^\d{9,18}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const AMOUNT_FORMAT_REGEX = /^\d+(\.\d{1,2})?$/;

export const WALLET_VALIDATION_MESSAGES = {
  ACCOUNT_HOLDER_NAME: "Enter the account holder name",
  ACCOUNT_NUMBER: "Account number must be 9-18 digits",
  IFSC: "Enter a valid IFSC code",
  ACCOUNT_NUMBER_MISMATCH: "Account numbers do not match",
  AMOUNT: "Enter a valid amount",
  MINIMUM_WITHDRAWAL: "Minimum withdrawal is ₹100",
} as const;

export const WALLET_ENDPOINTS = {
  OVERVIEW: "payments/wallets",
  BANK_ACCOUNT: "payments/wallets/bank-account",
  WITHDRAW: "payments/wallets/withdraw",
  LEDGER_ENTRIES: "payments/wallets/settlements",
} as const;

export const WALLET_LEDGER_TYPES = [
  "CREDIT_ORDER_PAYMENT",
  "DEBIT_PAYOUT_WITHDRAWAL",
  "DEBIT_ORDER_REFUND",
  "CREDIT_PAYOUT_REVERSAL",
] as const;

export const WALLET_LEDGER_STATUSES = ["PROCESSING", "PROCESSED", "FAILED", "REVERSED"] as const;

export const WALLET_QUERY_KEYS = {
  all: ["wallet"] as const,
  overview: () => [...WALLET_QUERY_KEYS.all, "overview"] as const,
  ledgerEntries: (params: unknown) => [...WALLET_QUERY_KEYS.all, "ledger-entries", params] as const,
};

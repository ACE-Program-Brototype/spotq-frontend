import type { BankAccountInput, WithdrawInput } from "../types/wallet.types";

export const ACCOUNT_NUMBER_REGEX = /^\d{9,18}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const AMOUNT_FORMAT_REGEX = /^\d+(\.\d{1,2})?$/;

export const WALLET_ENDPOINTS = {
  OVERVIEW: "payments/wallets",
  BANK_ACCOUNT: "payments/wallets/bank-account",
  WITHDRAW: "payments/wallets/withdraw",
} as const;

export const WALLET_QUERY_KEY = {
  all: ["wallet"] as const,
  overview: () => [...WALLET_QUERY_KEY.all, "overview"] as const,
};

export type LinkBankAccountPayload = BankAccountInput;
export type WithdrawPayload = WithdrawInput;

import type { WALLET_LEDGER_STATUSES, WALLET_LEDGER_TYPES } from "../constants/wallet.constants";

export interface GetRestaurantWalletOverviewOutputDTO {
  walletId: string | null;
  restaurantId: string;
  balancePaise: number;
  currency: string;
  isLocked: boolean;
  linkedBankAccount: {
    isLinked: boolean;
    bankName: string | null;
    accountNumberMasked: string | null;
  } | null;
  todayStats: {
    todayCreditsPaise: number;
    todayRefundsPaise: number;
    withdrawnPaise: number;
    pendingPayoutsCount: number;
  };
}

export type WalletOverview = GetRestaurantWalletOverviewOutputDTO;

export interface GetRestaurantWalletOverviewApiResponse {
  data: GetRestaurantWalletOverviewOutputDTO;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface BankAccountInput {
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
}

export interface WithdrawInput {
  amountPaise: number;
  mode: "IMPS";
}

export interface WithdrawRequest {
  input: WithdrawInput;
  idempotencyKey: string;
}
export type WalletLedgerType = (typeof WALLET_LEDGER_TYPES)[number];
export type WalletLedgerStatus = (typeof WALLET_LEDGER_STATUSES)[number];

export interface WalletLedgerEntry {
  id: string;
  type: WalletLedgerType | string;
  status: WalletLedgerStatus | string;
  amountPaise: number;
  balanceBeforePaise: number;
  balanceAfterPaise: number;
  referenceId: string;
  utrNumber: string | null;
  createdAt: string;
}

export interface WalletLedgerPagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface WalletLedgerEntriesData {
  entries: WalletLedgerEntry[];
  pagination: WalletLedgerPagination;
}

export interface WalletLedgerEntriesParams {
  page: number;
  limit: number;
  type?: string;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetPlatformFinanceSummaryOutputDTO {
  currency: string;
  masterBalancePaise: string;
  todayTurnoverPaise: string;
  tonightEodPayoutQueuePaise: string;
  lifetimeDisbursedPaise: string;
  totalRefundsProcessedPaise: string;
  saasSubscriptionMrrPaise: string;
  activeVenuesCount: number;
}

export type FinanceSummary = GetPlatformFinanceSummaryOutputDTO;

import type { LEDGER_ENTRY_TYPE } from "../constants/finance.constants";

export type LedgerEntryType = (typeof LEDGER_ENTRY_TYPE)[keyof typeof LEDGER_ENTRY_TYPE];

export interface GetPlatformMasterLedgerInputDTO {
  page?: number;
  limit?: number;
  search?: string;
  type?: LedgerEntryType;
  restaurantId?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetPlatformMasterLedgerOutputDTO {
  entries: Array<{
    id: string;
    type: string;
    amountPaise: string;
    runningBalancePaise: string;
    restaurantId: string | null;
    referenceId: string | null;
    createdAt: string;
  }>;
  pagination: { page: number; totalPages: number; limit: number } | null;
}

export type MasterLedgerEntry = GetPlatformMasterLedgerOutputDTO["entries"][number];
export type LedgerPage = GetPlatformMasterLedgerOutputDTO;
export type DatePreset = "TODAY" | "YESTERDAY" | "LAST_7_DAYS" | "LAST_30_DAYS" | "CUSTOM";

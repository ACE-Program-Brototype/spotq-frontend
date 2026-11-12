import { apiClient } from "@/lib/api/client";
import { IDEMPOTENCY_KEY_HEADER } from "@/lib/api/idempotency";
import type { ApiResponse } from "@/types/api.types";
import { WALLET_ENDPOINTS } from "../constants/wallet.constants";
import type {
  BankAccountInput,
  WalletLedgerEntriesData,
  WalletLedgerEntriesParams,
  WalletOverview,
  WithdrawRequest,
} from "../types/wallet.types";

type WalletResponse<T> = ApiResponse<T>;

function getData<T>(response: WalletResponse<T>, fallbackMessage: string): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.message || fallbackMessage);
  }
  return response.data;
}

export const walletService = {
  async getOverview(): Promise<WalletOverview> {
    const response = await apiClient
      .get(WALLET_ENDPOINTS.OVERVIEW)
      .json<WalletResponse<WalletOverview>>();
    return getData(response, "Unable to load wallet overview");
  },

  async getLedgerEntries(params: WalletLedgerEntriesParams): Promise<WalletLedgerEntriesData> {
    const searchParams: Record<string, string | number> = {
      page: params.page,
      limit: params.limit,
    };
    for (const key of ["type", "status", "search", "startDate", "endDate"] as const) {
      const value = params[key];
      if (value?.trim()) searchParams[key] = value.trim();
    }

    const response = await apiClient
      .get(WALLET_ENDPOINTS.LEDGER_ENTRIES, { searchParams })
      .json<WalletResponse<WalletLedgerEntriesData>>();
    return getData(response, "Unable to load wallet ledger entries");
  },

  async linkBankAccount(input: BankAccountInput): Promise<void> {
    const response = await apiClient
      .post(WALLET_ENDPOINTS.BANK_ACCOUNT, { json: input })
      .json<WalletResponse<unknown>>();
    getData(response, "Unable to link bank account");
  },

  async withdraw({ input, idempotencyKey }: WithdrawRequest): Promise<void> {
    const response = await apiClient
      .post(WALLET_ENDPOINTS.WITHDRAW, {
        json: input,
        headers: { [IDEMPOTENCY_KEY_HEADER]: idempotencyKey },
      })
      .json<WalletResponse<unknown>>();
    getData(response, "Unable to submit withdrawal");
  },
};

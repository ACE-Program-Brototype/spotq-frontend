import { apiClient } from "@/lib/api/client";
import { createIdempotencyKey, IDEMPOTENCY_KEY_HEADER } from "@/lib/api/idempotency";
import type { ApiResponse } from "@/types/api.types";
import { WALLET_ENDPOINTS } from "../constants/wallet.constants";
import type { BankAccountInput, WalletOverview, WithdrawInput } from "../types/wallet.types";

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

  async linkBankAccount(input: BankAccountInput): Promise<void> {
    const response = await apiClient
      .post(WALLET_ENDPOINTS.BANK_ACCOUNT, { json: input })
      .json<WalletResponse<unknown>>();
    getData(response, "Unable to link bank account");
  },

  async withdraw(input: WithdrawInput): Promise<void> {
    const idempotencyKey = createIdempotencyKey();
    const response = await apiClient
      .post(WALLET_ENDPOINTS.WITHDRAW, {
        json: input,
        headers: { [IDEMPOTENCY_KEY_HEADER]: idempotencyKey },
      })
      .json<WalletResponse<unknown>>();
    getData(response, "Unable to submit withdrawal");
  },
};

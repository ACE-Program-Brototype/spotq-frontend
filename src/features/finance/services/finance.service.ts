import type { SuccessResponse } from "@/components/common";
import { apiClient } from "@/lib/api/client";
import { FINANCE_ENDPOINTS } from "../constants/finance.constants";
import type {
  FinanceSummary,
  GetPlatformMasterLedgerInputDTO,
  LedgerPage,
} from "../types/finance.types";

export type LedgerQuery = GetPlatformMasterLedgerInputDTO & { page: number; limit: number };

export const financeService = {
  async getFinanceSummary(): Promise<FinanceSummary> {
    const response = await apiClient
      .get(FINANCE_ENDPOINTS.SUMMARY)
      .json<SuccessResponse<FinanceSummary>>();

    if (!response.success) throw new Error(response.message || "Unable to load finance summary");
    return response.data;
  },

  async getFinanceLedger(query: LedgerQuery): Promise<LedgerPage> {
    const response = await apiClient
      .get(FINANCE_ENDPOINTS.LEDGER, {
        searchParams: {
          page: query.page,
          limit: query.limit,
          search: query.search,
          type: query.type,
          restaurantId: query.restaurantId,
          startDate: query.startDate,
          endDate: query.endDate,
        },
      })
      .json<SuccessResponse<LedgerPage>>();
    if (!response.success) throw new Error(response.message || "Unable to load master ledger");
    return response.data;
  },

  async downloadFinanceCsv(query: Omit<LedgerQuery, "page" | "limit">): Promise<void> {
    const response = await apiClient.get(FINANCE_ENDPOINTS.EXPORT_CSV, {
      searchParams: {
        search: query.search,
        type: query.type,
        restaurantId: query.restaurantId,
        startDate: query.startDate,
        endDate: query.endDate,
      },
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `platform-finance-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};

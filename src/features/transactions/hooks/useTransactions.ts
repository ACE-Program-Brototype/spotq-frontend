/**
 * useTransactions Hook
 * TanStack Query hook for fetching paginated transactions list.
 */

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TRANSACTIONS_QUERY_KEYS } from "@/features/transactions/constants/transaction.constants";
import { transactionService } from "@/features/transactions/services/transaction.service";
import type { GetTransactionsParams } from "@/features/transactions/types/transaction.types";

export function useTransactions(params?: GetTransactionsParams) {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEYS.list(params),
    queryFn: () => transactionService.getTransactions(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

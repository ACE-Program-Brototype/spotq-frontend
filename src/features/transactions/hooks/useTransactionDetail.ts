/**
 * useTransactionDetail Hook
 * TanStack Query hook for fetching deep transaction details for the slide-over drawer.
 */

import { useQuery } from "@tanstack/react-query";
import { TRANSACTIONS_QUERY_KEYS } from "../constants/transaction.constants";
import { transactionService } from "../services/transaction.service";

export function useTransactionDetail(transactionId: string | null) {
  const isEnabled = Boolean(transactionId && transactionId.trim().length > 0);

  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEYS.detail(transactionId),
    queryFn: () => {
      if (!transactionId) {
        throw new Error("Transaction ID is required");
      }
      return transactionService.getTransactionDetail(transactionId);
    },
    enabled: isEnabled,
    staleTime: 60 * 1000,
  });
}

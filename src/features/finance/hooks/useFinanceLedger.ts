import { useQuery } from "@tanstack/react-query";
import { FINANCE_DEFAULTS, FINANCE_QUERY_KEY } from "@/features/finance/constants/finance.constants";
import type { LedgerQuery } from "@/features/finance/services/finance.service";
import { financeService } from "@/features/finance/services/finance.service";

export function useFinanceLedger(query: LedgerQuery) {
  return useQuery({
    queryKey: FINANCE_QUERY_KEY.ledger(query),
    queryFn: () => financeService.getFinanceLedger(query),
    placeholderData: (previousData) => previousData,
    staleTime: FINANCE_DEFAULTS.STALE_TIME_MS,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

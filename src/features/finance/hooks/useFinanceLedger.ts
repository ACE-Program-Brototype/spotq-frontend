import { useQuery } from "@tanstack/react-query";

import { FINANCE_QUERY_KEY } from "../constants/finance.constants";
import type { LedgerQuery } from "../services/finance.service";
import { financeService } from "../services/finance.service";

export function useFinanceLedger(query: LedgerQuery) {
  return useQuery({
    queryKey: FINANCE_QUERY_KEY.ledger(query),
    queryFn: () => financeService.getFinanceLedger(query),
    placeholderData: (previousData) => previousData,
  });
}

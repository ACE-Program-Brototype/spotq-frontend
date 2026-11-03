import { useQuery } from "@tanstack/react-query";

import { FINANCE_QUERY_KEY } from "../constants/finance.constants";
import { financeService } from "../services/finance.service";

export function useFinanceSummary() {
  return useQuery({
    queryKey: FINANCE_QUERY_KEY.summary(),
    queryFn: financeService.getFinanceSummary,
  });
}

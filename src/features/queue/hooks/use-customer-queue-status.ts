import { useQuery } from "@tanstack/react-query";
import { QUEUE_QUERY_KEYS } from "../constants/queue.constants";
import { queueService } from "../services/queue.service";
import type { CustomerQueueStatusResponse } from "../types/queue.types";

export interface UseCustomerQueueStatusOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export function useCustomerQueueStatus(
  restaurantId: string | undefined,
  queueEntryId: string | undefined,
  options?: UseCustomerQueueStatusOptions,
) {
  const isEnabled = (options?.enabled ?? true) && Boolean(restaurantId) && Boolean(queueEntryId);

  return useQuery<CustomerQueueStatusResponse>({
    queryKey: QUEUE_QUERY_KEYS.CUSTOMER_STATUS(restaurantId || "", queueEntryId || ""),
    queryFn: () => queueService.getCustomerQueueStatus(restaurantId || "", queueEntryId || ""),
    enabled: isEnabled,
    staleTime: 10_000,
    refetchInterval: options?.refetchInterval,
  });
}

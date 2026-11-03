import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { QUEUE_ETA_CONFIG, QUEUE_QUERY_KEYS } from "../constants/queue.constants";
import { queueService } from "../services/queue.service";
import type { QueueEtaResponse } from "../types/queue.types";

export interface UseQueueEtaOptions {
  enabled?: boolean;
}

/**
 * Fetches estimated waiting time for prospective customer party size with 300ms debounce.
 */
export function useQueueEta(
  restaurantId: string | undefined,
  partySize: number,
  options?: UseQueueEtaOptions,
) {
  const debouncedPartySize = useDebounce(partySize, QUEUE_ETA_CONFIG.DEBOUNCE_MS);

  const isEnabled =
    (options?.enabled ?? true) &&
    Boolean(restaurantId) &&
    typeof debouncedPartySize === "number" &&
    !Number.isNaN(debouncedPartySize) &&
    debouncedPartySize > 0;

  return useQuery<QueueEtaResponse>({
    queryKey: QUEUE_QUERY_KEYS.CUSTOMER_ETA(restaurantId || "", debouncedPartySize),
    queryFn: () => queueService.getQueueEta(restaurantId || "", debouncedPartySize),
    enabled: isEnabled,
    staleTime: QUEUE_ETA_CONFIG.STALE_TIME_MS,
    retry: QUEUE_ETA_CONFIG.RETRY_COUNT,
  });
}

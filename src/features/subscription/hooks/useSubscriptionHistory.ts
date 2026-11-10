import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SUBSCRIPTION_HISTORY_CONFIG } from "@/features/subscription/constants/subscription-history.constants";
import { subscriptionService } from "@/features/subscription/services/subscription.service";
import type { GetSubscriptionHistoryParams } from "@/features/subscription/types/subscription-history.types";

export function useSubscriptionHistory(
  restaurantId: string | undefined,
  params: GetSubscriptionHistoryParams = {},
) {
  const query = useQuery({
    queryKey: [
      "subscription-history",
      restaurantId,
      params.page ?? SUBSCRIPTION_HISTORY_CONFIG.DEFAULT_PAGE,
      params.limit ?? SUBSCRIPTION_HISTORY_CONFIG.DEFAULT_LIMIT,
      params.status ?? SUBSCRIPTION_HISTORY_CONFIG.DEFAULT_STATUS,
    ],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error("Restaurant identification is required to retrieve billing history.");
      }
      return subscriptionService.getSubscriptionHistory(restaurantId, params);
    },
    enabled: Boolean(restaurantId),
    placeholderData: keepPreviousData,
    staleTime: SUBSCRIPTION_HISTORY_CONFIG.STALE_TIME_MS,
  });

  return {
    ...query,
    transactions: query.data?.transactions ?? [],
    pagination: query.data?.pagination,
  };
}

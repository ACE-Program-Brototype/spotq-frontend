import { useQuery } from "@tanstack/react-query";
import { SUBSCRIBER_QUERY_KEYS } from "../constants/subscriber.constants";
import { subscriberService } from "../services/subscriber.service";

export function useSubscriberDetails(subscriberId?: string) {
  return useQuery({
    queryKey: SUBSCRIBER_QUERY_KEYS.DETAILS(subscriberId),
    queryFn: () => {
      if (!subscriberId) {
        throw new Error("Subscriber ID is required");
      }
      return subscriberService.getSubscriberDetails(subscriberId);
    },
    enabled: Boolean(subscriberId),
  });
}

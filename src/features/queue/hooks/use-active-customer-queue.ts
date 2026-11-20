import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { USER_ROLES } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { QUEUE_QUERY_KEYS } from "@/features/queue/constants/queue.constants";
import { queueService } from "@/features/queue/services/queue.service";
import { clearActiveCustomerTicket, setActiveCustomerTicket } from "@/features/queue/utils/active-queue.utils";

export interface UseActiveCustomerQueueOptions {
  enabled?: boolean;
}

/**
 * Checks whether the signed-in customer currently holds an active queue entry
 * on login or session reload and synchronizes local ticket storage for the tracker pill.
 */
export function useActiveCustomerQueue(options?: UseActiveCustomerQueueOptions) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const isCustomerSession = isAuthenticated && (!user?.role || user.role === USER_ROLES.CUSTOMER);
  const userScopeKey = user?.id ?? user?._id ?? user?.email ?? null;

  const query = useQuery({
    queryKey: QUEUE_QUERY_KEYS.CUSTOMER_ACTIVE(userScopeKey),
    queryFn: () => queueService.getActiveCustomerQueue(),
    enabled: isCustomerSession && (options?.enabled ?? true),
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!isCustomerSession || !query.isSuccess) {
      return;
    }

    const activeTicket = query.data?.data;
    if (activeTicket) {
      setActiveCustomerTicket(activeTicket);
    } else if (activeTicket === null) {
      clearActiveCustomerTicket();
    }
  }, [isCustomerSession, query.isSuccess, query.data]);

  return query;
}

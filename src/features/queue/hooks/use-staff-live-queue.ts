import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  PARTY_SIZE_BUCKET,
  QUEUE_QUERY_KEYS,
  QUEUE_STATUS,
  REGISTRATION_TYPE,
  REGISTRATION_TYPE_FILTER,
  STAFF_LIVE_QUEUE_CONFIG,
} from "@/features/queue/constants/queue.constants";
import { queueService } from "@/features/queue/services/queue.service";
import type {
  PartySizeBucket,
  RegistrationTypeFilter,
  StaffLiveQueueEntry,
  StaffQueueStatistics,
} from "@/features/queue/types/queue.types";

interface UseStaffLiveQueueOptions {
  restaurantId: string;
}

export function useStaffLiveQueue({ restaurantId }: UseStaffLiveQueueOptions) {
  const [partySizeFilter, setPartySizeFilter] = useState<PartySizeBucket>(PARTY_SIZE_BUCKET.ALL);
  const [registrationTypeFilter, setRegistrationTypeFilter] = useState<RegistrationTypeFilter>(
    REGISTRATION_TYPE_FILTER.ALL,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const query = useQuery({
    queryKey: QUEUE_QUERY_KEYS.STAFF_LIVE_QUEUE(restaurantId),
    queryFn: () => queueService.getStaffLiveQueue(restaurantId),
    enabled: Boolean(restaurantId),
    staleTime: STAFF_LIVE_QUEUE_CONFIG.STALE_TIME_MS,
    refetchOnWindowFocus: true,
  });

  const allEntries: StaffLiveQueueEntry[] = useMemo(() => {
    return query.data?.data?.entries ?? [];
  }, [query.data?.data?.entries]);

  // Overall restaurant-wide statistics (unaffected by UI filters)
  const statistics: StaffQueueStatistics = useMemo(() => {
    let waitingParties = 0;
    let waitingPeople = 0;
    let ringingParties = 0;
    let ringingPeople = 0;

    for (const entry of allEntries) {
      if (entry.status === QUEUE_STATUS.WAITING) {
        waitingParties += 1;
        waitingPeople += entry.partySize;

        if (
          entry.registrationType === REGISTRATION_TYPE.ONLINE &&
          (entry.ringCount > 0 || entry.responseDeadline)
        ) {
          ringingParties += 1;
          ringingPeople += entry.partySize;
        }
      }
    }

    return {
      waitingParties,
      waitingPeople,
      ringingParties,
      ringingPeople,
    };
  }, [allEntries]);

  // Filtered entries displayed in the table/cards
  const filteredEntries = useMemo(() => {
    let result = allEntries;

    // Filter by registration type
    if (registrationTypeFilter !== REGISTRATION_TYPE_FILTER.ALL) {
      result = result.filter((entry) => entry.registrationType === registrationTypeFilter);
    }

    // Filter by party size bucket
    if (partySizeFilter === PARTY_SIZE_BUCKET.SMALL) {
      result = result.filter((entry) => entry.partySize >= 1 && entry.partySize <= 2);
    } else if (partySizeFilter === PARTY_SIZE_BUCKET.MEDIUM) {
      result = result.filter((entry) => entry.partySize >= 3 && entry.partySize <= 4);
    } else if (partySizeFilter === PARTY_SIZE_BUCKET.LARGE) {
      result = result.filter((entry) => entry.partySize >= 5);
    }

    // Search query filter (matches guest name, phone, or queueNumber)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (entry) =>
          entry.guestName.toLowerCase().includes(q) ||
          entry.guestPhone?.includes(q) ||
          entry.queueNumber.toLowerCase().includes(q),
      );
    }

    return result;
  }, [allEntries, registrationTypeFilter, partySizeFilter, searchQuery]);

  return {
    ...query,
    allEntries,
    filteredEntries,
    statistics,
    partySizeFilter,
    setPartySizeFilter,
    registrationTypeFilter,
    setRegistrationTypeFilter,
    searchQuery,
    setSearchQuery,
  };
}

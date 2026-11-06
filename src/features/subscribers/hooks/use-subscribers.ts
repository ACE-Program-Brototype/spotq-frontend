import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  SUBSCRIBER_DEFAULTS,
  SUBSCRIBER_FILTER_STATUS,
  SUBSCRIBER_QUERY_KEYS,
  SUBSCRIBER_SORT_BY,
  SUBSCRIBER_SORT_ORDER,
} from "../constants/subscriber.constants";
import { subscriberService } from "../services/subscriber.service";
import type { SubscriberFilterStatus } from "../types/subscriber.types";

export interface UseSubscribersOptions {
  initialPage?: number;
  initialLimit?: number;
  initialStatus?: SubscriberFilterStatus;
  initialSearch?: string;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

export function useSubscribers(options?: UseSubscribersOptions) {
  const [page, setPage] = useState<number>(options?.initialPage ?? SUBSCRIBER_DEFAULTS.PAGE);
  const limit = options?.initialLimit ?? SUBSCRIBER_DEFAULTS.LIMIT;
  const [status, setStatus] = useState<SubscriberFilterStatus>(
    options?.initialStatus ?? SUBSCRIBER_DEFAULTS.FILTER_STATUS,
  );
  const [search, setSearch] = useState<string>(options?.initialSearch ?? "");
  const [sortBy, setSortBy] = useState<string>(
    options?.initialSortBy ?? SUBSCRIBER_DEFAULTS.SORT_BY,
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    options?.initialSortOrder ?? SUBSCRIBER_DEFAULTS.SORT_ORDER,
  );

  const debouncedSearch = useDebounce(search, SUBSCRIBER_DEFAULTS.SEARCH_DEBOUNCE_MS);

  const prevDebouncedSearchRef = useRef(debouncedSearch);
  useEffect(() => {
    if (prevDebouncedSearchRef.current !== debouncedSearch) {
      prevDebouncedSearchRef.current = debouncedSearch;
      setPage(1);
    }
  }, [debouncedSearch]);

  const queryKey = SUBSCRIBER_QUERY_KEYS.LIST({
    page,
    limit,
    search: debouncedSearch,
    status,
    sortBy,
    sortOrder,
  });

  const query = useQuery({
    queryKey,
    queryFn: () =>
      subscriberService.getSubscribers({
        page,
        limit,
        search: debouncedSearch,
        status,
        sortBy,
        sortOrder,
      }),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  const handleStatusChange = (newStatus: SubscriberFilterStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleSortToggle = () => {
    setSortOrder((prev) =>
      prev === SUBSCRIBER_SORT_ORDER.DESC ? SUBSCRIBER_SORT_ORDER.ASC : SUBSCRIBER_SORT_ORDER.DESC,
    );
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus(SUBSCRIBER_FILTER_STATUS.ALL);
    setSortBy(SUBSCRIBER_SORT_BY.CREATED_AT);
    setSortOrder(SUBSCRIBER_DEFAULTS.SORT_ORDER);
    setPage(1);
  };

  const isFiltered =
    Boolean(search.trim()) ||
    status !== SUBSCRIBER_FILTER_STATUS.ALL ||
    sortOrder !== SUBSCRIBER_DEFAULTS.SORT_ORDER;

  return {
    subscribers: query.data?.subscribers ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    page,
    setPage,
    limit,
    status,
    setStatus: handleStatusChange,
    search,
    setSearch: handleSearchChange,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder: handleSortToggle,
    resetFilters: handleResetFilters,
    isFiltered,
  };
}

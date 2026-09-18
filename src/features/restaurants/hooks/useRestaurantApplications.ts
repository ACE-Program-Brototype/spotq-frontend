import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  APPLICATION_DEFAULTS,
  APPLICATION_FILTER_STATUS,
  RESTAURANT_APPLICATION_QUERY_KEYS,
} from "../constants/restaurant-application.constants";
import { restaurantApplicationService } from "../services/restaurant-application.service";
import type {
  ApplicationFilterStatusType,
  ApplicationSortByType,
  ApplicationSortOrderType,
} from "../types/restaurant-application.types";

export interface UseRestaurantApplicationsOptions {
  initialPage?: number;
  initialLimit?: number;
  initialStatus?: ApplicationFilterStatusType;
  initialSearch?: string;
  initialFromDate?: string;
  initialToDate?: string;
  initialSortBy?: ApplicationSortByType;
  initialSortOrder?: ApplicationSortOrderType;
}

export function useRestaurantApplications(options?: UseRestaurantApplicationsOptions) {
  const [page, setPage] = useState<number>(options?.initialPage ?? APPLICATION_DEFAULTS.PAGE);
  const [limit, setLimit] = useState<number>(options?.initialLimit ?? APPLICATION_DEFAULTS.LIMIT);
  const [status, setStatus] = useState<ApplicationFilterStatusType>(
    options?.initialStatus ?? APPLICATION_DEFAULTS.FILTER_STATUS,
  );
  const [search, setSearch] = useState<string>(options?.initialSearch ?? "");
  const [fromDate, setFromDate] = useState<string>(options?.initialFromDate ?? "");
  const [toDate, setToDate] = useState<string>(options?.initialToDate ?? "");
  const [sortBy, setSortBy] = useState<ApplicationSortByType>(
    options?.initialSortBy ?? APPLICATION_DEFAULTS.SORT_BY,
  );
  const [sortOrder, setSortOrder] = useState<ApplicationSortOrderType>(
    options?.initialSortOrder ?? APPLICATION_DEFAULTS.SORT_ORDER,
  );

  const debouncedSearch = useDebounce(search, APPLICATION_DEFAULTS.SEARCH_DEBOUNCE_MS);

  const queryKey = [
    ...RESTAURANT_APPLICATION_QUERY_KEYS.LIST,
    {
      page,
      limit,
      search: debouncedSearch,
      status,
      fromDate,
      toDate,
      sortBy,
      sortOrder,
    },
  ];

  const query = useQuery({
    queryKey,
    queryFn: () =>
      restaurantApplicationService.getRestaurantApplications({
        page,
        limit,
        search: debouncedSearch,
        status,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        sortBy,
        sortOrder,
      }),
  });

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleStatusChange = (newStatus: ApplicationFilterStatusType) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleFromDateChange = (newFromDate: string) => {
    setFromDate(newFromDate);
    setPage(1);
  };

  const handleToDateChange = (newToDate: string) => {
    setToDate(newToDate);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortByChange = (newSortBy: ApplicationSortByType) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  const handleSort = (field: ApplicationSortByType) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus(APPLICATION_FILTER_STATUS.ALL);
    setFromDate("");
    setToDate("");
    setSortBy(APPLICATION_DEFAULTS.SORT_BY);
    setSortOrder(APPLICATION_DEFAULTS.SORT_ORDER);
    setPage(1);
  };

  const isFiltered =
    status !== APPLICATION_FILTER_STATUS.ALL ||
    search.trim().length > 0 ||
    fromDate.length > 0 ||
    toDate.length > 0 ||
    sortBy !== APPLICATION_DEFAULTS.SORT_BY ||
    sortOrder !== APPLICATION_DEFAULTS.SORT_ORDER;

  return {
    ...query,
    applications: query.data?.restaurants ?? [],
    pagination: query.data?.pagination,
    page,
    setPage,
    limit,
    setLimit: handleLimitChange,
    status,
    setStatus: handleStatusChange,
    search,
    setSearch: handleSearchChange,
    debouncedSearch,
    fromDate,
    setFromDate: handleFromDateChange,
    toDate,
    setToDate: handleToDateChange,
    sortBy,
    setSortBy: handleSortByChange,
    sortOrder,
    setSortOrder,
    toggleSortOrder: handleToggleSortOrder,
    handleSort,
    resetFilters: handleResetFilters,
    isFiltered,
  };
}

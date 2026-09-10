import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  CUSTOMER_DEFAULTS,
  CUSTOMER_FILTER_STATUS,
  type CustomerFilterStatusType,
  type CustomerSortByType,
  type CustomerSortOrderType,
} from "../constants/customer.constants";
import { customerService } from "../services/customer.service";
import type { UpdateCustomerStatusInput } from "../types/customer.types";

export interface UseCustomersOptions {
  initialPage?: number;
  initialLimit?: number;
  initialStatus?: CustomerFilterStatusType;
  initialSearch?: string;
  initialSortBy?: CustomerSortByType;
  initialSortOrder?: CustomerSortOrderType;
}

export function useCustomers(options?: UseCustomersOptions) {
  const [page, setPage] = useState<number>(options?.initialPage ?? CUSTOMER_DEFAULTS.PAGE);
  const [limit, setLimit] = useState<number>(options?.initialLimit ?? CUSTOMER_DEFAULTS.LIMIT);
  const [status, setStatus] = useState<CustomerFilterStatusType>(
    options?.initialStatus ?? CUSTOMER_DEFAULTS.FILTER_STATUS,
  );
  const [search, setSearch] = useState<string>(options?.initialSearch ?? "");
  const [sortBy, setSortBy] = useState<CustomerSortByType>(
    options?.initialSortBy ?? CUSTOMER_DEFAULTS.SORT_BY,
  );
  const [sortOrder, setSortOrder] = useState<CustomerSortOrderType>(
    options?.initialSortOrder ?? CUSTOMER_DEFAULTS.SORT_ORDER,
  );

  const debouncedSearch = useDebounce(search, CUSTOMER_DEFAULTS.SEARCH_DEBOUNCE_MS);

  const queryKey = [
    "admin",
    "customers",
    {
      page,
      limit,
      search: debouncedSearch,
      status,
      sortBy,
      sortOrder,
    },
  ];

  const query = useQuery({
    queryKey,
    queryFn: () =>
      customerService.getCustomers({
        page,
        limit,
        search: debouncedSearch,
        status,
        sortBy,
        sortOrder,
      }),
  });

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleStatusChange = (newStatus: CustomerFilterStatusType) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "DESC" ? "ASC" : "DESC"));
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus(CUSTOMER_FILTER_STATUS.ALL);
    setSortOrder(CUSTOMER_DEFAULTS.SORT_ORDER);
    setPage(1);
  };

  return {
    ...query,
    customers: query.data?.users ?? [],
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
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    toggleSortOrder: handleSortToggle,
    resetFilters: handleResetFilters,
    isFiltered:
      status !== CUSTOMER_FILTER_STATUS.ALL ||
      search.trim().length > 0 ||
      sortOrder !== CUSTOMER_DEFAULTS.SORT_ORDER,
  };
}

export function useUpdateCustomerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCustomerStatusInput) => customerService.updateCustomerStatus(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
    },
  });
}

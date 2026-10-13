import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  CUSTOMER_RESTAURANT_DEFAULTS,
  CUSTOMER_RESTAURANT_QUERY_KEYS,
  CUSTOMER_SORT_OPTIONS,
} from "../constants/customer-restaurant.constants";
import { customerRestaurantService } from "../services/customer-restaurant.service";
import type { CustomerSortOptionValue } from "../types/customer-restaurant.types";

export interface UseCustomerRestaurantsOptions {
  initialPage?: number;
  initialLimit?: number;
  initialCategory?: string;
  initialSearch?: string;
  initialSort?: CustomerSortOptionValue;
}

export function useCustomerRestaurants(options?: UseCustomerRestaurantsOptions) {
  const [page, setPage] = useState<number>(
    options?.initialPage ?? CUSTOMER_RESTAURANT_DEFAULTS.PAGE,
  );
  const [limit] = useState<number>(
    options?.initialLimit ?? CUSTOMER_RESTAURANT_DEFAULTS.LIMIT,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    options?.initialCategory ?? CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_CATEGORY,
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    options?.initialSearch ?? "",
  );
  const [selectedSort, setSelectedSort] = useState<CustomerSortOptionValue>(
    options?.initialSort ?? CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_SORT,
  );

  const debouncedSearch = useDebounce(
    searchQuery.trim(),
    CUSTOMER_RESTAURANT_DEFAULTS.SEARCH_DEBOUNCE_MS,
  );

  const currentSortConfig = useMemo(() => {
    return (
      CUSTOMER_SORT_OPTIONS.find((opt) => opt.value === selectedSort) ??
      CUSTOMER_SORT_OPTIONS[0]
    );
  }, [selectedSort]);

  const queryKey = CUSTOMER_RESTAURANT_QUERY_KEYS.LIST({
    page,
    limit,
    search: debouncedSearch,
    cuisine: selectedCategory !== "All" ? selectedCategory : undefined,
    sortBy: currentSortConfig.sortBy,
    sortOrder: currentSortConfig.sortOrder,
  });

  const query = useQuery({
    queryKey,
    queryFn: () =>
      customerRestaurantService.getRestaurants({
        page,
        limit,
        search: debouncedSearch || undefined,
        cuisine: selectedCategory !== "All" ? selectedCategory : undefined,
        sortBy: currentSortConfig.sortBy,
        sortOrder: currentSortConfig.sortOrder,
      }),
    staleTime: CUSTOMER_RESTAURANT_DEFAULTS.CACHE_STALE_TIME_MS,
  });

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
    setPage(1);
  };

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setPage(1);
  };

  const handleSortChange = (newSort: CustomerSortOptionValue) => {
    setSelectedSort(newSort);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_CATEGORY);
    setSelectedSort(CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_SORT);
    setPage(1);
  };

  const isFiltered = Boolean(
    debouncedSearch ||
      selectedCategory !== CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_CATEGORY,
  );

  return {
    restaurants: query.data?.restaurants ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    page,
    limit,
    searchQuery,
    selectedCategory,
    selectedSort,
    currentSortConfig,
    isFiltered,
    handleSearchChange,
    handleCategoryChange,
    handleSortChange,
    handlePageChange,
    resetFilters,
  };
}

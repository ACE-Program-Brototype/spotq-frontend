import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  initialCity?: string;
  initialSort?: CustomerSortOptionValue;
}

export function useCustomerRestaurants(options?: UseCustomerRestaurantsOptions) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from the URL so shared/bookmarked links restore the same list and pagination.
  const urlPage = Number(searchParams.get("page")) || undefined;
  const urlCategory = searchParams.get("category") || undefined;
  const urlSearch = searchParams.get("search") || undefined;
  const urlCity = searchParams.get("city") || undefined;
  const urlSort = (searchParams.get("sort") as CustomerSortOptionValue) || undefined;

  const [page, setPage] = useState<number>(
    urlPage ?? options?.initialPage ?? CUSTOMER_RESTAURANT_DEFAULTS.PAGE,
  );
  const [limit] = useState<number>(options?.initialLimit ?? CUSTOMER_RESTAURANT_DEFAULTS.LIMIT);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    urlCategory ?? options?.initialCategory ?? CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_CATEGORY,
  );
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch ?? options?.initialSearch ?? "");
  const [cityQuery, setCityQuery] = useState<string>(urlCity ?? options?.initialCity ?? "");
  const [selectedSort, setSelectedSort] = useState<CustomerSortOptionValue>(
    urlSort ?? options?.initialSort ?? CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_SORT,
  );
  const lastWrittenSearchParams = useRef<string | null>(searchParams.toString());

  // Only apply URL-to-state updates when the URL itself changes. Running this on local state
  // changes can briefly restore the old URL page and make the pagination control jump.
  useEffect(() => {
    const serializedParams = searchParams.toString();
    if (lastWrittenSearchParams.current === serializedParams) {
      lastWrittenSearchParams.current = null;
      return;
    }

    const paramSearch = searchParams.get("search") ?? "";
    const paramCity = searchParams.get("city") ?? "";
    const paramCategory =
      searchParams.get("category") ?? CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_CATEGORY;
    const paramSort =
      (searchParams.get("sort") as CustomerSortOptionValue) ??
      CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_SORT;
    const paramPage = Number(searchParams.get("page")) || 1;

    setSearchQuery(paramSearch);
    setCityQuery(paramCity);
    setSelectedCategory(paramCategory);
    setSelectedSort(paramSort);
    setPage(paramPage);
  }, [searchParams]);

  const debouncedSearch = useDebounce(
    searchQuery.trim(),
    CUSTOMER_RESTAURANT_DEFAULTS.SEARCH_DEBOUNCE_MS,
  );
  const debouncedCity = useDebounce(
    cityQuery.trim(),
    CUSTOMER_RESTAURANT_DEFAULTS.SEARCH_DEBOUNCE_MS,
  );

  // Keep the URL in step with the filters so refresh, sharing, and browser navigation preserve them.
  const updateUrlParams = useCallback(
    (
      nextSearch: string,
      nextCity: string,
      nextCategory: string,
      nextSort: CustomerSortOptionValue,
      nextPage: number,
    ) => {
      const nextParams = new URLSearchParams();

      if (nextSearch.trim()) {
        nextParams.set("search", nextSearch.trim());
      }

      if (nextCity.trim()) {
        nextParams.set("city", nextCity.trim());
      }

      if (nextCategory && nextCategory !== CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_CATEGORY) {
        nextParams.set("category", nextCategory);
      }

      if (nextSort && nextSort !== CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_SORT) {
        nextParams.set("sort", nextSort);
      }

      if (nextPage > 1) {
        nextParams.set("page", String(nextPage));
      }

      lastWrittenSearchParams.current = nextParams.toString();
      setSearchParams(nextParams, { replace: true });
    },
    [setSearchParams],
  );

  const previousDebouncedFilters = useRef({
    search: debouncedSearch,
    city: debouncedCity,
  });

  // Wait until typing pauses before resetting pagination and syncing search/city to the URL.
  // This avoids page changes on every keystroke while still starting filtered results at page 1.
  useEffect(() => {
    const searchChanged = previousDebouncedFilters.current.search !== debouncedSearch;
    const cityChanged = previousDebouncedFilters.current.city !== debouncedCity;
    if (!searchChanged && !cityChanged) return;

    previousDebouncedFilters.current = { search: debouncedSearch, city: debouncedCity };
    setPage(1);
    updateUrlParams(debouncedSearch, debouncedCity, selectedCategory, selectedSort, 1);
  }, [debouncedSearch, debouncedCity, selectedCategory, selectedSort, updateUrlParams]);

  const currentSortConfig = useMemo(() => {
    return (
      CUSTOMER_SORT_OPTIONS.find((opt) => opt.value === selectedSort) ?? CUSTOMER_SORT_OPTIONS[0]
    );
  }, [selectedSort]);

  // Include every server-visible filter in the query key so TanStack Query caches each result set.
  const queryKey = CUSTOMER_RESTAURANT_QUERY_KEYS.LIST({
    page,
    limit,
    search: debouncedSearch,
    city: debouncedCity,
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
        city: debouncedCity || undefined,
        cuisine: selectedCategory !== "All" ? selectedCategory : undefined,
        sortBy: currentSortConfig.sortBy,
        sortOrder: currentSortConfig.sortOrder,
      }),
    staleTime: CUSTOMER_RESTAURANT_DEFAULTS.CACHE_STALE_TIME_MS,
    // Keep the current list visible while a new page or filter result is loading.
    placeholderData: keepPreviousData,
  });

  // Search and city update immediately in the input; their debounced values drive fetching above.
  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
  };

  const handleCityChange = (newCity: string) => {
    setCityQuery(newCity);
  };

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setPage(1);
    updateUrlParams(searchQuery, cityQuery, newCategory, selectedSort, 1);
  };

  const handleSortChange = (newSort: CustomerSortOptionValue) => {
    setSelectedSort(newSort);
    setPage(1);
    updateUrlParams(searchQuery, cityQuery, selectedCategory, newSort, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrlParams(searchQuery, cityQuery, selectedCategory, selectedSort, newPage);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCityQuery("");
    setSelectedCategory(CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_CATEGORY);
    setSelectedSort(CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_SORT);
    setPage(1);
    lastWrittenSearchParams.current = "";
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const isFiltered = Boolean(
    debouncedSearch ||
      debouncedCity ||
      selectedCategory !== CUSTOMER_RESTAURANT_DEFAULTS.DEFAULT_CATEGORY,
  );

  const restaurants = Array.isArray(query.data?.restaurants) ? query.data.restaurants : [];
  const totalItems = query.data?.pagination?.total ?? restaurants.length;
  const totalPages = query.data?.pagination?.totalPages ?? (Math.ceil(totalItems / limit) || 1);
  return {
    restaurants,
    pagination: query.data?.pagination,
    totalItems,
    totalPages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    page,
    limit,
    searchQuery,
    cityQuery,
    selectedCategory,
    selectedSort,
    currentSortConfig,
    isFiltered,
    handleSearchChange,
    handleCityChange,
    handleCategoryChange,
    handleSortChange,
    handlePageChange,
    resetFilters,
  };
}

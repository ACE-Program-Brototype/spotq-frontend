/**
 * Hook for fetching and managing restaurant menu items for staff.
 * Integrates with GET /restaurants/:restaurantId/staff/menu/items
 * Supports 86'd status tracking, category filtering, search, sorting, and pagination.
 */

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { STAFF_MENU_ITEMS_QUERY_KEY } from "../constants/menu.constants";
import { staffMenuService } from "../services/staff-menu.service";
import type {
  StaffMenuAvailabilityFilter,
  StaffMenuItem,
  StaffMenuItemsQueryParams,
  StaffMenuSortOption,
} from "../types/staff-menu-item.types";

export interface UseStaffMenuItemsOptions {
  restaurantId?: string;
  initialLimit?: number;
  searchDebounceMs?: number;
}

export function useStaffMenuItems(options?: UseStaffMenuItemsOptions) {
  const user = useAuthStore((state) => state.user);
  const restaurantId = options?.restaurantId || user?.restaurantId || "";

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(options?.initialLimit || 12);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, options?.searchDebounceMs ?? 350);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState<StaffMenuAvailabilityFilter>("ALL");
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);

  const [sort, setSort] = useState<{
    sortBy: StaffMenuSortOption;
    sortOrder: "asc" | "desc";
  }>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const queryParams: StaffMenuItemsQueryParams = useMemo(() => {
    let isAvailable: boolean | undefined;
    if (availabilityFilter === "AVAILABLE") isAvailable = true;
    if (availabilityFilter === "UNAVAILABLE") isAvailable = false;

    return {
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      categoryId: categoryFilter !== "ALL" ? categoryFilter : undefined,
      isAvailable,
      includeInactive: includeInactive || undefined,
      includeVariants: true,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    };
  }, [page, limit, debouncedSearch, categoryFilter, availabilityFilter, includeInactive, sort]);

  const queryKey = useMemo(
    () => [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId, queryParams],
    [restaurantId, queryParams],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: () => staffMenuService.getStaffMenuItems(restaurantId, queryParams),
    enabled: Boolean(restaurantId),
    staleTime: 15 * 1000,
  });

  const items: StaffMenuItem[] = useMemo(() => data?.items ?? [], [data?.items]);
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 0;

  // Computed summary metrics
  const availableCount = useMemo(() => items.filter((item) => item.isAvailable).length, [items]);
  const outOfStockCount = useMemo(() => items.filter((item) => !item.isAvailable).length, [items]);

  // Group items by category preserving displayOrder
  const groupedByCategory = useMemo(() => {
    const map = new Map<
      string,
      { categoryId: string; categoryName: string; displayOrder: number; items: StaffMenuItem[] }
    >();

    for (const item of items) {
      const key = item.categoryId || "uncategorized";
      if (!map.has(key)) {
        map.set(key, {
          categoryId: item.categoryId,
          categoryName: item.categoryName || "Uncategorized",
          displayOrder: item.displayOrder,
          items: [],
        });
      }
      const target = map.get(key);
      if (target) {
        target.items.push(item);
      }
    }

    return Array.from(map.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [items]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((catId: string) => {
    setCategoryFilter(catId);
    setPage(1);
  }, []);

  const handleAvailabilityChange = useCallback((status: StaffMenuAvailabilityFilter) => {
    setAvailabilityFilter(status);
    setPage(1);
  }, []);

  const toggleSort = useCallback((field: StaffMenuSortOption) => {
    setSort((prev) => {
      if (prev.sortBy === field) {
        return {
          sortBy: field,
          sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
        };
      }
      return {
        sortBy: field,
        sortOrder: "asc",
      };
    });
    setPage(1);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleIncludeInactiveChange = useCallback((include: boolean) => {
    setIncludeInactive(include);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("ALL");
    setAvailabilityFilter("ALL");
    setIncludeInactive(false);
    setSort({ sortBy: "createdAt", sortOrder: "desc" });
    setPage(1);
  }, []);

  return {
    items,
    groupedByCategory,
    restaurantId,
    totalCount,
    totalPages,
    availableCount,
    outOfStockCount,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    // Filter & Sort state
    page,
    limit,
    searchQuery,
    categoryFilter,
    availabilityFilter,
    includeInactive,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
    // Updaters
    setPage,
    setLimit: handleLimitChange,
    setSearchQuery: handleSearchChange,
    setCategoryFilter: handleCategoryChange,
    setAvailabilityFilter: handleAvailabilityChange,
    setIncludeInactive: handleIncludeInactiveChange,
    toggleSort,
    resetFilters,
  };
}

/**
 * Hook for fetching and managing restaurant menu items.
 * Handles pagination, search, category filtering, veg filtering, status filtering, and sorting.
 */

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { MENU_ITEMS_QUERY_KEY } from "../constants/menu.constants";
import { menuItemService } from "../services/menu-item.service";
import type {
  MenuItemPagination,
  MenuItemSortBy,
  MenuItemSortOrder,
  MenuItemStats,
  MenuItemStatusFilter,
  MenuItemSummary,
} from "../types/menu-item.types";

export interface UseMenuItemsOptions {
  initialLimit?: number;
}

export function useMenuItems(options?: UseMenuItemsOptions) {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(options?.initialLimit || 10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<MenuItemStatusFilter>("ALL");
  const [vegFilter, setVegFilter] = useState<"ALL" | "VEG" | "NON_VEG">("ALL");
  const [sortBy, setSortBy] = useState<MenuItemSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<MenuItemSortOrder>("desc");

  const queryParams = useMemo(() => {
    const isVegetarian = vegFilter === "VEG" ? true : vegFilter === "NON_VEG" ? false : undefined;

    return {
      page,
      limit,
      search: searchQuery.trim() || undefined,
      categoryId: categoryFilter !== "ALL" ? categoryFilter : undefined,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
      isVegetarian,
      sortBy,
      sortOrder,
    };
  }, [page, limit, searchQuery, categoryFilter, statusFilter, vegFilter, sortBy, sortOrder]);

  const queryKey = useMemo(
    () => [MENU_ITEMS_QUERY_KEY, restaurantId, queryParams],
    [restaurantId, queryParams],
  );

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => menuItemService.getMenuItems(restaurantId, queryParams),
    enabled: Boolean(restaurantId),
    staleTime: 30 * 1000,
  });

  const items: MenuItemSummary[] = useMemo(() => data?.items ?? [], [data?.items]);

  const stats: MenuItemStats = useMemo(
    () =>
      data?.stats ?? {
        totalCategories: 0,
        totalMenuItems: 0,
        availableItems: 0,
        outOfStockItems: 0,
      },
    [data?.stats],
  );

  const pagination: MenuItemPagination = useMemo(
    () =>
      data?.pagination ?? {
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    [data?.pagination, limit],
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((catId: string) => {
    setCategoryFilter(catId);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((status: MenuItemStatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  }, []);

  const handleVegFilterChange = useCallback((filter: "ALL" | "VEG" | "NON_VEG") => {
    setVegFilter(filter);
    setPage(1);
  }, []);

  const toggleSort = useCallback((field: MenuItemSortBy) => {
    setSortBy((prevField) => {
      if (prevField === field) {
        setSortOrder((prevOrder) => (prevOrder === "asc" || prevOrder === "ASC" ? "desc" : "asc"));
        return field;
      }
      setSortOrder("asc");
      return field;
    });
    setPage(1);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("ALL");
    setStatusFilter("ALL");
    setVegFilter("ALL");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  }, []);

  return {
    items,
    stats,
    pagination,
    restaurantId,
    isLoading,
    isError,
    error,
    refetch,
    // Filters & Sorting state
    page,
    limit,
    searchQuery,
    categoryFilter,
    statusFilter,
    vegFilter,
    sortBy,
    sortOrder,
    // Updaters
    setPage,
    setLimit: handleLimitChange,
    setPageSize: handleLimitChange,
    setSearchQuery: handleSearchChange,
    setCategoryFilter: handleCategoryChange,
    setStatusFilter: handleStatusChange,
    setVegFilter: handleVegFilterChange,
    toggleSort,
    resetFilters,
  };
}

/**
 * Hook for fetching and managing restaurant menu items for staff.
 * Integrates with GET /restaurants/:restaurantId/staff/menu/items
 * Supports 86'd status tracking, category filtering, search, sorting, and pagination.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  MENU_ITEMS_QUERY_KEY,
  MENU_MESSAGES,
  STAFF_MENU_ITEMS_QUERY_KEY,
} from "../constants/menu.constants";
import { menuItemService } from "../services/menu-item.service";
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
  refetchInterval?: number | false;
}

export function useStaffMenuItems(options?: UseStaffMenuItemsOptions) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const restaurantId = options?.restaurantId || user?.restaurantId || "";
  const pollInterval = options?.refetchInterval ?? 30 * 1000;

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

  const mainQuery = useQuery({
    queryKey,
    queryFn: () => staffMenuService.getStaffMenuItems(restaurantId, queryParams),
    enabled: Boolean(restaurantId),
    staleTime: 15 * 1000,
    refetchInterval: pollInterval,
  });

  // Global availability metric queries independent of pagination and active filters
  const availableStatsQuery = useQuery({
    queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId, "stats", "available", includeInactive],
    queryFn: () =>
      staffMenuService.getStaffMenuItems(restaurantId, {
        limit: 1,
        isAvailable: true,
        includeInactive: includeInactive || undefined,
      }),
    enabled: Boolean(restaurantId),
    staleTime: 30 * 1000,
    refetchInterval: pollInterval,
  });

  const outOfStockStatsQuery = useQuery({
    queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId, "stats", "unavailable", includeInactive],
    queryFn: () =>
      staffMenuService.getStaffMenuItems(restaurantId, {
        limit: 1,
        isAvailable: false,
        includeInactive: includeInactive || undefined,
      }),
    enabled: Boolean(restaurantId),
    staleTime: 30 * 1000,
    refetchInterval: pollInterval,
  });

  const items: StaffMenuItem[] = useMemo(
    () => mainQuery.data?.items ?? [],
    [mainQuery.data?.items],
  );
  const totalCount = mainQuery.data?.totalCount ?? 0;
  const totalPages = mainQuery.data?.totalPages ?? 0;

  // Global stock counts fallback to visible items slice if stats query not yet resolved
  const availableCount =
    availableStatsQuery.data?.totalCount ?? items.filter((item) => item.isAvailable).length;
  const outOfStockCount =
    outOfStockStatsQuery.data?.totalCount ?? items.filter((item) => !item.isAvailable).length;

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

  const refetch = useCallback(async () => {
    const [mainResult] = await Promise.all([
      mainQuery.refetch(),
      availableStatsQuery.refetch(),
      outOfStockStatsQuery.refetch(),
    ]);
    return mainResult;
  }, [mainQuery, availableStatsQuery, outOfStockStatsQuery]);

  const [pendingItemIds, setPendingItemIds] = useState<Set<string>>(() => new Set());

  // Toggle Menu Item Availability
  const toggleItemAvailabilityMutation = useMutation({
    mutationFn: async ({ itemId, isAvailable }: { itemId: string; isAvailable: boolean }) => {
      return menuItemService.updateMenuItemAvailability(restaurantId, itemId, isAvailable);
    },
    onMutate: async ({ itemId, isAvailable }) => {
      await queryClient.cancelQueries({
        queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId],
      });
      const previousQueries = queryClient.getQueriesData({
        queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId],
      });

      // Optimistically update the staff menu cache across matching queries for this restaurant
      queryClient.setQueriesData(
        { queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId] },
        (old: unknown) => {
          if (!old) return old;
          const oldObj = old as { items?: StaffMenuItem[]; totalCount?: number };
          if (oldObj.items && Array.isArray(oldObj.items)) {
            return {
              ...oldObj,
              items: oldObj.items.map((item) =>
                item.id === itemId ? { ...item, isAvailable } : item,
              ),
            };
          }
          return old;
        },
      );

      return { previousQueries, itemId };
    },
    onError: (err, _variables, context) => {
      if (context?.previousQueries) {
        for (const [key, data] of context.previousQueries) {
          queryClient.setQueryData(key, data);
        }
      }
      toast.error(
        err instanceof Error ? err.message : MENU_MESSAGES.ITEM_AVAILABILITY_UPDATE_FAILED,
      );
    },
    onSuccess: (data) => {
      toast.success(
        data.isAvailable
          ? MENU_MESSAGES.ITEM_MARKED_IN_STOCK
          : MENU_MESSAGES.ITEM_MARKED_OUT_OF_STOCK,
      );
    },
    onSettled: (_data, _error, variables) => {
      if (variables?.itemId) {
        setPendingItemIds((prev) => {
          const next = new Set(prev);
          next.delete(variables.itemId);
          return next;
        });
      }
      queryClient.invalidateQueries({
        queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: [MENU_ITEMS_QUERY_KEY, restaurantId],
      });
    },
  });

  const toggleAvailability = useCallback(
    (item: StaffMenuItem) => {
      if (!restaurantId || !item.id || item.isActive === false) return;
      if (pendingItemIds.has(item.id)) return;

      setPendingItemIds((prev) => new Set(prev).add(item.id));
      toggleItemAvailabilityMutation.mutate({ itemId: item.id, isAvailable: !item.isAvailable });
    },
    [restaurantId, pendingItemIds, toggleItemAvailabilityMutation],
  );

  return {
    items,
    restaurantId,
    totalCount,
    totalPages,
    availableCount,
    outOfStockCount,
    isLoading: mainQuery.isLoading,
    isFetching: mainQuery.isFetching,
    isError: mainQuery.isError,
    error: mainQuery.error,
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
    // Toggle Availability
    toggleAvailability,
    pendingItemIds,
    isTogglingAvailability: pendingItemIds.size > 0,
    togglingItemId:
      pendingItemIds.size > 0
        ? Array.from(pendingItemIds)[0]
        : toggleItemAvailabilityMutation.variables?.itemId || null,
  };
}

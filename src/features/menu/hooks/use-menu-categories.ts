/**
 * Hook for fetching and managing restaurant menu categories.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { MENU_CATEGORIES_QUERY_KEY } from "../constants/menu.constants";
import { menuCategoryService } from "../services/menu-category.service";
import type { MenuCategory } from "../types/menu-category.types";

export function useMenuCategories() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || user?.id || "";

  const queryKey = useMemo(() => [MENU_CATEGORIES_QUERY_KEY, restaurantId], [restaurantId]);

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => menuCategoryService.getCategories(restaurantId),
    enabled: !!restaurantId,
    staleTime: 60 * 1000,
  });

  const updateCategoryLocally = useCallback(
    (updated: MenuCategory) => {
      queryClient.setQueryData<MenuCategory[]>(queryKey, (oldList = []) => {
        const found = oldList.some((cat) => cat.id === updated.id);
        if (!found) {
          return [...oldList, updated].sort((a, b) => a.displayOrder - b.displayOrder);
        }
        return oldList
          .map((cat) => (cat.id === updated.id ? { ...cat, ...updated } : cat))
          .sort((a, b) => a.displayOrder - b.displayOrder);
      });
    },
    [queryClient, queryKey],
  );

  return {
    categories,
    restaurantId,
    isLoading,
    isError,
    error,
    refetch,
    updateCategoryLocally,
  };
}

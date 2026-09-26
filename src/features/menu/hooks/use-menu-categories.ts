/**
 * Hook for fetching and managing restaurant menu categories.
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { MENU_CATEGORIES_QUERY_KEY } from "../constants/menu.constants";
import { menuCategoryService } from "../services/menu-category.service";

export function useMenuCategories() {
  const user = useAuthStore((state) => state.user);
  // Strictly source from verified restaurantId, avoiding user ID fallback
  const restaurantId = user?.restaurantId || "";

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
    enabled: Boolean(restaurantId),
    staleTime: 60 * 1000,
    select: (data) => [...data].sort((a, b) => a.displayOrder - b.displayOrder),
  });

  return {
    categories,
    restaurantId,
    isLoading,
    isError,
    error,
    refetch,
  };
}

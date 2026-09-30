/**
 * Hook for fetching and managing restaurant menu categories.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { MENU_CATEGORIES_QUERY_KEY, MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { menuService } from "@/features/menu/services/menu.service";
import { menuCategoryService } from "@/features/menu/services/menu-category.service";
import type { CreateCategoryPayload, MenuCategory } from "@/features/menu/types/menu.types";

export { MENU_CATEGORIES_QUERY_KEY };

export function useMenuCategories(restaurantIdParam?: string) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const restaurantId = restaurantIdParam || user?.restaurantId || "";

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

  const createCategoryMutation = useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      menuService.createCategory(restaurantId, payload),
    onSuccess: (newCategory: MenuCategory) => {
      queryClient.setQueryData(queryKey, (old: MenuCategory[] | undefined) => [
        ...(old || []),
        newCategory,
      ]);
      queryClient.invalidateQueries({ queryKey });
      toast.success(MENU_MESSAGES.CATEGORY_CREATED_SUCCESS);
    },
    onError: (err: Error) => {
      toast.error(err.message || MENU_MESSAGES.CATEGORY_CREATE_FAILED);
    },
  });

  return {
    categories,
    restaurantId,
    isLoading,
    isError,
    error,
    refetch,
    createCategory: createCategoryMutation.mutateAsync,
    isCreating: createCategoryMutation.isPending,
  };
}

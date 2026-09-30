/**
 * Hook for updating an existing menu category.
 * Integrates with TanStack React Query mutation and user notifications.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MENU_CATEGORIES_QUERY_KEY, MENU_MESSAGES } from "../constants/menu.constants";
import { menuCategoryService } from "../services/menu-category.service";
import type { MenuCategory, UpdateMenuCategoryPayload } from "../types/menu-category.types";

interface UpdateMenuCategoryVariables {
  restaurantId: string;
  categoryId: string;
  payload: UpdateMenuCategoryPayload;
}

export function useUpdateMenuCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      restaurantId,
      categoryId,
      payload,
    }: UpdateMenuCategoryVariables): Promise<MenuCategory> => {
      return menuCategoryService.updateCategory(restaurantId, categoryId, payload);
    },
    onSuccess: (updatedCategory, variables) => {
      // Reflect updated values in query cache immediately
      queryClient.setQueryData<MenuCategory[]>(
        [MENU_CATEGORIES_QUERY_KEY, variables.restaurantId],
        (oldList = []) => {
          return oldList
            .map((cat) => (cat.id === updatedCategory.id ? { ...cat, ...updatedCategory } : cat))
            .sort((a, b) => a.displayOrder - b.displayOrder);
        },
      );

      // Invalidate to synchronize with server
      queryClient.invalidateQueries({
        queryKey: [MENU_CATEGORIES_QUERY_KEY, variables.restaurantId],
      });

      toast.success(MENU_MESSAGES.UPDATE_SUCCESS);
    },
  });
}

/**
 * Hook for Single Menu Item Detail Management
 * Handles fetching item details, toggling item availability, and delete operations.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  MENU_ITEM_DETAIL_QUERY_KEY,
  MENU_ITEMS_QUERY_KEY,
  MENU_MESSAGES,
} from "@/features/menu/constants/menu.constants";
import { menuItemService } from "@/features/menu/services/menu-item.service";
import type { MenuItemDetail } from "@/features/menu/types/menu-item.types";

export interface UseMenuItemDetailOptions {
  restaurantId?: string;
  itemId?: string;
}

export function useMenuItemDetail(options?: UseMenuItemDetailOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);

  const restaurantId = options?.restaurantId || authUser?.restaurantId || "";
  const itemId = options?.itemId || "";

  const queryKey = [MENU_ITEM_DETAIL_QUERY_KEY, restaurantId, itemId] as const;

  const {
    data: item,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => menuItemService.getMenuItemById(restaurantId, itemId),
    enabled: Boolean(restaurantId && itemId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Toggle Menu Item Availability
  const toggleItemAvailabilityMutation = useMutation({
    mutationFn: async ({ isAvailable }: { isAvailable: boolean }) => {
      return menuItemService.updateMenuItemAvailability(restaurantId, itemId, isAvailable);
    },
    onMutate: async ({ isAvailable }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousItem = queryClient.getQueryData<MenuItemDetail>(queryKey);

      if (previousItem) {
        queryClient.setQueryData<MenuItemDetail>(queryKey, {
          ...previousItem,
          isAvailable,
        });
      }

      return { previousItem };
    },
    onError: (err, _variables, context) => {
      if (context?.previousItem) {
        queryClient.setQueryData(queryKey, context.previousItem);
      }
      toast.error(err instanceof Error ? err.message : "Failed to update item availability");
    },
    onSuccess: (data) => {
      toast.success(data.isAvailable ? "Item marked as in stock" : "Item marked as out of stock");
      queryClient.invalidateQueries({ queryKey: [MENU_ITEMS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Delete Menu Item
  const deleteMenuItemMutation = useMutation({
    mutationFn: async () => {
      return menuItemService.deleteMenuItem(restaurantId, itemId);
    },
    onSuccess: () => {
      toast.success(MENU_MESSAGES.ITEM_DELETED_SUCCESS);
      queryClient.invalidateQueries({ queryKey: [MENU_ITEMS_QUERY_KEY] });
      queryClient.removeQueries({ queryKey });
      navigate("/restaurant/menu/items", { replace: true });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : MENU_MESSAGES.ITEM_DELETE_FAILED);
    },
  });

  const { mutate: toggleAvailability, isPending: isTogglingItem } = toggleItemAvailabilityMutation;
  const { mutate: deleteMenuItem, isPending: isDeleting } = deleteMenuItemMutation;

  const handleToggleItemAvailability = useCallback(() => {
    if (!item) return;
    toggleAvailability({ isAvailable: !item.isAvailable });
  }, [item, toggleAvailability]);

  const handleDeleteItem = useCallback(() => {
    deleteMenuItem();
  }, [deleteMenuItem]);

  return {
    item,
    restaurantId,
    itemId,
    isLoading,
    isError,
    error,
    refetch,
    isTogglingItem,
    isDeleting,
    handleToggleItemAvailability,
    handleDeleteItem,
  };
}

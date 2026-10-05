import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MENU_ITEMS_QUERY_KEY, MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { menuService } from "@/features/menu/services/menu.service";
import type { MenuItemResponse, UpdateMenuItemPayload } from "@/features/menu/types/menu.types";

export function useUpdateMenuItem(restaurantId: string, menuItemId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: UpdateMenuItemPayload) =>
      menuService.updateMenuItem(restaurantId, menuItemId, payload),
    onSuccess: (updatedItem: MenuItemResponse) => {
      queryClient.invalidateQueries({ queryKey: [MENU_ITEMS_QUERY_KEY, restaurantId] });
      queryClient.invalidateQueries({
        queryKey: [MENU_ITEMS_QUERY_KEY, restaurantId, menuItemId],
      });
      toast.success(MENU_MESSAGES.ITEM_UPDATED_SUCCESS);
      return updatedItem;
    },
    onError: (err: Error) => {
      toast.error(err.message || MENU_MESSAGES.ITEM_UPDATE_FAILED);
    },
  });

  return {
    updateMenuItem: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}

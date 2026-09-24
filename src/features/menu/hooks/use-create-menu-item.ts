import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { menuService } from "@/features/menu/services/menu.service";
import type { CreateMenuItemPayload, MenuItemResponse } from "@/features/menu/types/menu.types";

export const MENU_ITEMS_QUERY_KEY = "menuItems";

export function useCreateMenuItem(restaurantId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateMenuItemPayload) =>
      menuService.createMenuItem(restaurantId, payload),
    onSuccess: (newItem: MenuItemResponse) => {
      queryClient.invalidateQueries({ queryKey: [MENU_ITEMS_QUERY_KEY, restaurantId] });
      toast.success(MENU_MESSAGES.ITEM_CREATED_SUCCESS);
      return newItem;
    },
    onError: (err: Error) => {
      toast.error(err.message || MENU_MESSAGES.ITEM_CREATE_FAILED);
    },
  });

  return {
    createMenuItem: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}

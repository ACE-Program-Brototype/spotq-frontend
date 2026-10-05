import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { toast } from "sonner";
import {
  MENU_ITEM_DETAIL_QUERY_KEY,
  MENU_ITEMS_QUERY_KEY,
  MENU_MESSAGES,
} from "../constants/menu.constants";
import { menuItemService } from "../services/menu-item.service";

export interface UseDeleteMenuItemOptions {
  restaurantId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteMenuItem({ restaurantId, onSuccess, onError }: UseDeleteMenuItemOptions) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (menuItemId: string) => menuItemService.deleteMenuItem(restaurantId, menuItemId),
    onSuccess: (_data, menuItemId) => {
      // Invalidate the menu items query cache to refetch the data and update statistics
      queryClient.invalidateQueries({
        queryKey: [MENU_ITEMS_QUERY_KEY, restaurantId],
      });

      if (menuItemId) {
        queryClient.removeQueries({
          queryKey: [MENU_ITEM_DETAIL_QUERY_KEY, restaurantId, menuItemId],
        });
      }

      toast.success(MENU_MESSAGES.ITEM_DELETED_SUCCESS);
      onSuccess?.();
    },
    onError: (err: Error) => {
      let status: number | undefined;
      let errorMessage = err.message || MENU_MESSAGES.ITEM_DELETE_FAILED;

      if (err instanceof HTTPError) {
        status = err.response?.status;
      } else if (typeof (err as { status?: number }).status === "number") {
        status = (err as { status?: number }).status;
      }

      if (status === 403) {
        errorMessage = err.message || MENU_MESSAGES.ITEM_FORBIDDEN;
      } else if (status === 404) {
        errorMessage = err.message || MENU_MESSAGES.ITEM_NOT_FOUND;
      }

      toast.error(errorMessage);
      onError?.(err);
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { MENU_ITEMS_QUERY_KEY } from "@/features/menu/constants/menu.constants";
import { menuService } from "@/features/menu/services/menu.service";
import type { MenuItemDetails } from "@/features/menu/types/menu.types";

export function useMenuItemDetails(restaurantId: string, menuItemId: string) {
  const query = useQuery<MenuItemDetails, Error>({
    queryKey: [MENU_ITEMS_QUERY_KEY, restaurantId, menuItemId],
    queryFn: () => menuService.getMenuItem(restaurantId, menuItemId),
    enabled: Boolean(restaurantId && menuItemId),
  });

  return {
    item: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

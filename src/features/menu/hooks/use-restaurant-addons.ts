import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { menuService } from "@/features/menu/services/menu.service";
import type { CreateAddonPayload, MenuAddon } from "@/features/menu/types/menu.types";

export const RESTAURANT_ADDONS_QUERY_KEY = "restaurantAddons";

export function useRestaurantAddons(restaurantId: string) {
  const queryClient = useQueryClient();

  const {
    data: addons = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [RESTAURANT_ADDONS_QUERY_KEY, restaurantId],
    queryFn: () => menuService.getAddons(restaurantId),
    enabled: Boolean(restaurantId),
    staleTime: 60 * 1000,
  });

  const createAddonMutation = useMutation({
    mutationFn: (payload: CreateAddonPayload) => menuService.createAddon(restaurantId, payload),
    onSuccess: (newAddon: MenuAddon) => {
      queryClient.setQueryData(
        [RESTAURANT_ADDONS_QUERY_KEY, restaurantId],
        (old: MenuAddon[] | undefined) => [...(old || []), newAddon],
      );
      toast.success(MENU_MESSAGES.ADDON_CREATED_SUCCESS);
    },
    onError: (err: Error) => {
      toast.error(err.message || MENU_MESSAGES.ADDON_CREATE_FAILED);
    },
  });

  return {
    addons,
    isLoading,
    isError,
    error,
    refetch,
    createAddon: createAddonMutation.mutateAsync,
    isCreating: createAddonMutation.isPending,
  };
}

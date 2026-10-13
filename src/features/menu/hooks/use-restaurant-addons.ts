import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { menuService } from "@/features/menu/services/menu.service";
import type {
  CreateAddonPayload,
  MenuAddon,
  UpdateAddonPayload,
} from "@/features/menu/types/menu.types";

export const RESTAURANT_ADDONS_QUERY_KEY = "restaurantAddons";

export function useRestaurantAddons(restaurantId: string) {
  const queryClient = useQueryClient();
  const [pendingAddonIds, setPendingAddonIds] = useState<Set<string>>(new Set());

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
      queryClient.invalidateQueries({ queryKey: [RESTAURANT_ADDONS_QUERY_KEY, restaurantId] });
      toast.success(MENU_MESSAGES.ADDON_CREATED_SUCCESS);
    },
    onError: (err: Error) => {
      toast.error(err.message || MENU_MESSAGES.ADDON_CREATE_FAILED);
    },
  });

  const updateAddonMutation = useMutation({
    mutationFn: ({ addonId, payload }: { addonId: string; payload: UpdateAddonPayload }) =>
      menuService.updateAddon(restaurantId, addonId, payload),
    onSuccess: (updatedAddon: MenuAddon) => {
      queryClient.setQueryData(
        [RESTAURANT_ADDONS_QUERY_KEY, restaurantId],
        (old: MenuAddon[] | undefined) =>
          old?.map((addon) => (addon.id === updatedAddon.id ? updatedAddon : addon)) || [],
      );
      queryClient.invalidateQueries({ queryKey: [RESTAURANT_ADDONS_QUERY_KEY, restaurantId] });
      toast.success(MENU_MESSAGES.ADDON_UPDATED_SUCCESS);
    },
    onError: (err: Error) => {
      toast.error(err.message || MENU_MESSAGES.ADDON_UPDATE_FAILED);
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ addonId, isAvailable }: { addonId: string; isAvailable: boolean }) =>
      menuService.updateAddon(restaurantId, addonId, { isAvailable }),
    onMutate: async ({ addonId, isAvailable }) => {
      await queryClient.cancelQueries({ queryKey: [RESTAURANT_ADDONS_QUERY_KEY, restaurantId] });
      const previousAddons = queryClient.getQueryData<MenuAddon[]>([
        RESTAURANT_ADDONS_QUERY_KEY,
        restaurantId,
      ]);

      queryClient.setQueryData<MenuAddon[]>(
        [RESTAURANT_ADDONS_QUERY_KEY, restaurantId],
        (old) =>
          old?.map((addon) => (addon.id === addonId ? { ...addon, isAvailable } : addon)) || [],
      );

      return { previousAddons };
    },
    onError: (err: Error, { addonId }, context) => {
      if (context?.previousAddons) {
        queryClient.setQueryData(
          [RESTAURANT_ADDONS_QUERY_KEY, restaurantId],
          context.previousAddons,
        );
      }
      setPendingAddonIds((prev) => {
        const next = new Set(prev);
        next.delete(addonId);
        return next;
      });
      toast.error(err.message || MENU_MESSAGES.ADDON_UPDATE_FAILED);
    },
    onSuccess: (_data, { addonId, isAvailable }) => {
      setPendingAddonIds((prev) => {
        const next = new Set(prev);
        next.delete(addonId);
        return next;
      });
      toast.success(
        isAvailable ? MENU_MESSAGES.ADDON_MARKED_IN_STOCK : MENU_MESSAGES.ADDON_MARKED_OUT_OF_STOCK,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [RESTAURANT_ADDONS_QUERY_KEY, restaurantId] });
    },
  });

  const toggleAvailability = useCallback(
    (addon: MenuAddon) => {
      if (!restaurantId || !addon.id) return;
      if (pendingAddonIds.has(addon.id)) return;

      setPendingAddonIds((prev) => new Set(prev).add(addon.id));
      toggleAvailabilityMutation.mutate({
        addonId: addon.id,
        isAvailable: !addon.isAvailable,
      });
    },
    [restaurantId, pendingAddonIds, toggleAvailabilityMutation],
  );

  return {
    addons,
    isLoading,
    isError,
    error,
    refetch,
    createAddon: createAddonMutation.mutateAsync,
    isCreating: createAddonMutation.isPending,
    updateAddon: updateAddonMutation.mutateAsync,
    isUpdating: updateAddonMutation.isPending,
    toggleAvailability,
    pendingAddonIds,
    isTogglingAvailability: pendingAddonIds.size > 0,
  };
}

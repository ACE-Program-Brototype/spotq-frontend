import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  MENU_ITEMS_QUERY_KEY,
  MENU_MESSAGES,
  STAFF_MENU_ITEMS_QUERY_KEY,
} from "../constants/menu.constants";
import { menuItemService } from "../services/menu-item.service";
import { staffMenuService } from "../services/staff-menu.service";
import type { StaffMenuItem } from "../types/staff-menu-item.types";

export interface UseStaffMenuMutationsOptions {
  restaurantId: string;
}

export function useStaffMenuMutations({ restaurantId }: UseStaffMenuMutationsOptions) {
  const queryClient = useQueryClient();
  const [pendingItemIds, setPendingItemIds] = useState<Set<string>>(() => new Set());
  const [pendingVariantIds, setPendingVariantIds] = useState<Set<string>>(() => new Set());

  // Toggle Menu Item Availability
  const toggleItemAvailabilityMutation = useMutation({
    mutationFn: async ({ itemId, isAvailable }: { itemId: string; isAvailable: boolean }) => {
      return menuItemService.updateMenuItemAvailability(restaurantId, itemId, isAvailable);
    },
    onMutate: async ({ itemId, isAvailable }) => {
      await queryClient.cancelQueries({
        queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId],
      });
      const previousQueries = queryClient.getQueriesData({
        queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId],
      });

      // Optimistically update the staff menu cache across matching queries for this restaurant
      queryClient.setQueriesData(
        { queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId] },
        (old: unknown) => {
          if (!old) return old;
          const oldObj = old as { items?: StaffMenuItem[]; totalCount?: number };
          if (oldObj.items && Array.isArray(oldObj.items)) {
            return {
              ...oldObj,
              items: oldObj.items.map((item) =>
                item.id === itemId ? { ...item, isAvailable } : item,
              ),
            };
          }
          return old;
        },
      );

      return { previousQueries, itemId };
    },
    onError: (err, _variables, context) => {
      if (context?.previousQueries) {
        for (const [key, data] of context.previousQueries) {
          queryClient.setQueryData(key, data);
        }
      }
      toast.error(
        err instanceof Error ? err.message : MENU_MESSAGES.ITEM_AVAILABILITY_UPDATE_FAILED,
      );
    },
    onSuccess: (data) => {
      toast.success(
        data.isAvailable
          ? MENU_MESSAGES.ITEM_MARKED_IN_STOCK
          : MENU_MESSAGES.ITEM_MARKED_OUT_OF_STOCK,
      );
    },
    onSettled: (_data, _error, variables) => {
      if (variables?.itemId) {
        setPendingItemIds((prev) => {
          const next = new Set(prev);
          next.delete(variables.itemId);
          return next;
        });
      }
      queryClient.invalidateQueries({
        queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: [MENU_ITEMS_QUERY_KEY, restaurantId],
      });
    },
  });

  // Toggle Variant Availability
  const toggleVariantAvailabilityMutation = useMutation({
    mutationFn: async ({ itemId, variantId }: { itemId: string; variantId: string }) => {
      return staffMenuService.updateMenuItemVariantStatus(restaurantId, itemId, variantId);
    },
    onMutate: async ({ itemId, variantId }) => {
      await queryClient.cancelQueries({
        queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId],
      });
      const previousQueries = queryClient.getQueriesData({
        queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId],
      });

      queryClient.setQueriesData(
        { queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId] },
        (old: unknown) => {
          if (!old) return old;
          const oldObj = old as { items?: StaffMenuItem[]; totalCount?: number };
          if (oldObj.items && Array.isArray(oldObj.items)) {
            return {
              ...oldObj,
              items: oldObj.items.map((item) => {
                if (item.id !== itemId || !item.variants) return item;
                return {
                  ...item,
                  variants: item.variants.map((v) =>
                    v.id === variantId ? { ...v, isAvailable: !v.isAvailable } : v,
                  ),
                };
              }),
            };
          }
          return old;
        },
      );

      return { previousQueries, variantId };
    },
    onError: (err, _variables, context) => {
      if (context?.previousQueries) {
        for (const [key, data] of context.previousQueries) {
          queryClient.setQueryData(key, data);
        }
      }
      toast.error(
        err instanceof Error ? err.message : MENU_MESSAGES.VARIANT_AVAILABILITY_UPDATE_FAILED,
      );
    },
    onSuccess: (data, variables) => {
      const isAvailable = data?.isAvailable ?? true;

      // Update value in cache to avoid stale data
      queryClient.setQueriesData(
        { queryKey: [STAFF_MENU_ITEMS_QUERY_KEY, restaurantId] },
        (old: unknown) => {
          if (!old) return old;
          const oldObj = old as { items?: StaffMenuItem[]; totalCount?: number };
          if (oldObj.items && Array.isArray(oldObj.items)) {
            return {
              ...oldObj,
              items: oldObj.items.map((item) => {
                if (item.id !== variables.itemId || !item.variants) return item;
                return {
                  ...item,
                  variants: item.variants.map((v) =>
                    v.id === variables.variantId ? { ...v, isAvailable } : v,
                  ),
                };
              }),
            };
          }
          return old;
        },
      );

      setPendingVariantIds((prev) => {
        const next = new Set(prev);
        next.delete(variables.variantId);
        return next;
      });

      toast.success(
        isAvailable
          ? MENU_MESSAGES.VARIANT_MARKED_IN_STOCK
          : MENU_MESSAGES.VARIANT_MARKED_OUT_OF_STOCK,
      );
    },
    onSettled: (_data, _error, variables) => {
      if (variables?.variantId) {
        setPendingVariantIds((prev) => {
          const next = new Set(prev);
          next.delete(variables.variantId);
          return next;
        });
      }
    },
  });

  const toggleAvailability = useCallback(
    (item: StaffMenuItem) => {
      if (!restaurantId || !item.id || item.isActive === false) return;
      if (pendingItemIds.has(item.id)) return;

      setPendingItemIds((prev) => new Set(prev).add(item.id));
      toggleItemAvailabilityMutation.mutate({ itemId: item.id, isAvailable: !item.isAvailable });
    },
    [restaurantId, pendingItemIds, toggleItemAvailabilityMutation],
  );

  const toggleVariantAvailability = useCallback(
    (itemId: string, variantId: string) => {
      if (!restaurantId || !itemId || !variantId) return;
      if (pendingVariantIds.has(variantId)) return;

      setPendingVariantIds((prev) => new Set(prev).add(variantId));
      toggleVariantAvailabilityMutation.mutate({ itemId, variantId });
    },
    [restaurantId, pendingVariantIds, toggleVariantAvailabilityMutation],
  );

  return {
    toggleAvailability,
    pendingItemIds,
    isTogglingAvailability: pendingItemIds.size > 0,
    togglingItemId:
      pendingItemIds.size > 0
        ? Array.from(pendingItemIds)[0]
        : toggleItemAvailabilityMutation.variables?.itemId || null,
    toggleVariantAvailability,
    pendingVariantIds,
  };
}

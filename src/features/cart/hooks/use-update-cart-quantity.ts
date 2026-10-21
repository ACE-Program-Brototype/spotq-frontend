import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CART_LIMITS, CART_UI_MESSAGES } from "../constants/cart.constants";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cart.store";
import type { Cart, CartItem, UpdateCartItemQuantityData } from "../types/cart.types";

export interface UseUpdateCartQuantityOptions {
  cartId?: string | null;
  debounceMs?: number;
  onSuccess?: (data: UpdateCartItemQuantityData, cartItemId: string, quantity: number) => void;
  onError?: (error: Error, cartItemId: string, previousCart?: Cart | null) => void;
}

export function useUpdateCartQuantity(options?: UseUpdateCartQuantityOptions) {
  const queryClient = useQueryClient();
  const storeCartId = useCartStore((state) => state.cartId);
  const activeCartId = options?.cartId !== undefined ? options.cartId : storeCartId;
  const debounceDelay = options?.debounceMs ?? CART_LIMITS.DEBOUNCE_DELAY_MS;

  const [pendingItemIds, setPendingItemIds] = useState<Set<string>>(new Set());

  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const baselineSnapshotsRef = useRef<Map<string, Cart | null>>(new Map());

  useEffect(() => {
    const currentTimers = timersRef.current;
    return () => {
      for (const timer of currentTimers.values()) {
        clearTimeout(timer);
      }
      currentTimers.clear();
      baselineSnapshotsRef.current.clear();
    };
  }, []);

  const isItemPending = useCallback(
    (cartItemId: string) => pendingItemIds.has(cartItemId),
    [pendingItemIds],
  );

  const performServerUpdate = useCallback(
    async (cartItemId: string, finalQuantity: number, baselineCart: Cart | null) => {
      if (!activeCartId) return;

      try {
        let result: UpdateCartItemQuantityData;
        if (finalQuantity <= 0) {
          result = await cartService.removeItem(activeCartId, cartItemId);
          toast.success(CART_UI_MESSAGES.REMOVE_ITEM_SUCCESS);
        } else {
          result = await cartService.updateQuantity(activeCartId, cartItemId, finalQuantity);
        }

        baselineSnapshotsRef.current.delete(cartItemId);
        setPendingItemIds((prev) => {
          const next = new Set(prev);
          next.delete(cartItemId);
          return next;
        });

        await queryClient.invalidateQueries({ queryKey: ["cart", activeCartId] });
        options?.onSuccess?.(result, cartItemId, finalQuantity);
      } catch (err: unknown) {
        if (baselineCart) {
          queryClient.setQueryData(["cart", activeCartId], baselineCart);
        }
        baselineSnapshotsRef.current.delete(cartItemId);
        setPendingItemIds((prev) => {
          const next = new Set(prev);
          next.delete(cartItemId);
          return next;
        });

        const error =
          err instanceof Error ? err : new Error(CART_UI_MESSAGES.ERROR_LOADING_DESCRIPTION);
        toast.error(error.message || CART_UI_MESSAGES.ERROR_LOADING_DESCRIPTION);
        options?.onError?.(error, cartItemId, baselineCart);
      }
    },
    [activeCartId, queryClient, options],
  );

  const updateQuantity = useCallback(
    (cartItemId: string, targetQuantity: number) => {
      if (!activeCartId) return;

      const clampedQuantity = Math.max(0, Math.min(CART_LIMITS.MAX_QUANTITY, targetQuantity));

      const currentCart = queryClient.getQueryData<Cart | null>(["cart", activeCartId]);
      if (!currentCart) return;

      const targetItem = currentCart.items.find((item) => item.cartItemId === cartItemId);
      if (!targetItem) return;

      if (!baselineSnapshotsRef.current.has(cartItemId)) {
        baselineSnapshotsRef.current.set(cartItemId, currentCart);
      }
      const baseline = baselineSnapshotsRef.current.get(cartItemId) ?? currentCart;

      queryClient.setQueryData<Cart | null>(["cart", activeCartId], (prevCart) => {
        if (!prevCart) return prevCart;

        let updatedItems: CartItem[];
        if (clampedQuantity === 0) {
          updatedItems = prevCart.items.filter((item) => item.cartItemId !== cartItemId);
        } else {
          const unitRate =
            targetItem.quantity > 0
              ? targetItem.totalPrice / targetItem.quantity
              : targetItem.unitPrice;
          const newTotalPrice = Number((unitRate * clampedQuantity).toFixed(2));

          updatedItems = prevCart.items.map((item) =>
            item.cartItemId === cartItemId
              ? {
                  ...item,
                  quantity: clampedQuantity,
                  totalPrice: newTotalPrice,
                }
              : item,
          );
        }

        const newCount = updatedItems.reduce((acc, i) => acc + i.quantity, 0);
        const newSubtotal = Number(
          updatedItems.reduce((acc, i) => acc + i.totalPrice, 0).toFixed(2),
        );

        return {
          ...prevCart,
          items: updatedItems,
          itemCount: newCount,
          subtotal: newSubtotal,
        };
      });

      const existingTimer = timersRef.current.get(cartItemId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      setPendingItemIds((prev) => new Set(prev).add(cartItemId));

      const newTimer = setTimeout(() => {
        timersRef.current.delete(cartItemId);
        performServerUpdate(cartItemId, clampedQuantity, baseline);
      }, debounceDelay);

      timersRef.current.set(cartItemId, newTimer);
    },
    [activeCartId, queryClient, debounceDelay, performServerUpdate],
  );

  const increment = useCallback(
    (cartItemId: string) => {
      const currentCart = queryClient.getQueryData<Cart | null>(["cart", activeCartId]);
      const currentItem = currentCart?.items.find((i) => i.cartItemId === cartItemId);
      if (!currentItem) return;
      if (currentItem.quantity >= CART_LIMITS.MAX_QUANTITY) return;

      updateQuantity(cartItemId, currentItem.quantity + 1);
    },
    [activeCartId, queryClient, updateQuantity],
  );

  const decrement = useCallback(
    (cartItemId: string) => {
      const currentCart = queryClient.getQueryData<Cart | null>(["cart", activeCartId]);
      const currentItem = currentCart?.items.find((i) => i.cartItemId === cartItemId);
      if (!currentItem) return;

      updateQuantity(cartItemId, currentItem.quantity - 1);
    },
    [activeCartId, queryClient, updateQuantity],
  );

  const removeItem = useCallback(
    (cartItemId: string) => {
      const existingTimer = timersRef.current.get(cartItemId);
      if (existingTimer) {
        clearTimeout(existingTimer);
        timersRef.current.delete(cartItemId);
      }

      const currentCart = queryClient.getQueryData<Cart | null>(["cart", activeCartId]);
      const baseline = baselineSnapshotsRef.current.get(cartItemId) ?? currentCart ?? null;

      queryClient.setQueryData<Cart | null>(["cart", activeCartId], (prevCart) => {
        if (!prevCart) return prevCart;
        const updatedItems = prevCart.items.filter((item) => item.cartItemId !== cartItemId);
        const newCount = updatedItems.reduce((acc, i) => acc + i.quantity, 0);
        const newSubtotal = updatedItems.reduce((acc, i) => acc + i.totalPrice, 0);
        return {
          ...prevCart,
          items: updatedItems,
          itemCount: newCount,
          subtotal: newSubtotal,
        };
      });

      setPendingItemIds((prev) => new Set(prev).add(cartItemId));
      performServerUpdate(cartItemId, 0, baseline);
    },
    [activeCartId, queryClient, performServerUpdate],
  );

  return {
    updateQuantity,
    increment,
    decrement,
    removeItem,
    isItemPending,
    isAnyPending: pendingItemIds.size > 0,
  };
}

export default useUpdateCartQuantity;

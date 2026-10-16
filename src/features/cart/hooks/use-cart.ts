import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cart.store";
import type { Cart } from "../types/cart.types";

interface UseCartOptions {
  cartId?: string | null;
  enabled?: boolean;
}

export function useCart(options?: UseCartOptions) {
  const storeCartId = useCartStore((state) => state.cartId);
  const resetCart = useCartStore((state) => state.resetCart);

  const effectiveCartId = options?.cartId !== undefined ? options.cartId : storeCartId;

  const query = useQuery<Cart | null, Error>({
    queryKey: ["cart", effectiveCartId],
    queryFn: async () => {
      if (!effectiveCartId) return null;
      try {
        return await cartService.getCart(effectiveCartId);
      } catch (err: unknown) {
        let statusCode: number | undefined;
        let errorMessage: string | undefined;

        if (err && typeof err === "object" && "response" in err) {
          const resp = (err as { response: Response }).response;
          statusCode = resp?.status;
          try {
            const body = (await resp.clone().json()) as { message?: string };
            errorMessage = body?.message;
          } catch {}
        }

        if (statusCode === 410 || statusCode === 404 || statusCode === 409) {
          toast.error(CART_UI_MESSAGES.EXPIRED_TITLE, {
            description: errorMessage || CART_UI_MESSAGES.EXPIRED_MESSAGE,
          });
          resetCart();
          return null;
        }

        throw err instanceof Error ? err : new Error(CART_UI_MESSAGES.ERROR_LOADING_DESCRIPTION);
      }
    },
    enabled:
      options?.enabled !== undefined
        ? options.enabled && Boolean(effectiveCartId)
        : Boolean(effectiveCartId),
    staleTime: 10_000,
    retry: 1,
  });

  const cart = query.data ?? null;
  const items = cart?.items ?? [];
  const itemCount = cart?.itemCount ?? 0;
  const subtotal = cart?.subtotal ?? 0;

  return {
    ...query,
    cart,
    items,
    itemCount,
    subtotal,
    isEmpty: items.length === 0,
  };
}

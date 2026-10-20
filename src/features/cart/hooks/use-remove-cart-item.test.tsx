import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cart.store";
import type { Cart } from "../types/cart.types";
import { useRemoveCartItem } from "./use-remove-cart-item";

jest.mock("../services/cart.service", () => ({
  cartService: {
    removeItem: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockCart: Cart = {
  cartId: "cart-123",
  restaurantId: "rest-1",
  userId: "user-1",
  status: "ACTIVE",
  itemCount: 3,
  subtotal: 450,
  createdAt: "2026-10-16T10:00:00.000Z",
  updatedAt: "2026-10-16T10:00:00.000Z",
  expiresAt: "2026-10-17T10:00:00.000Z",
  items: [
    {
      cartItemId: "item-1",
      menuItemId: "dish-1",
      menuItemName: "Chicken Biryani",
      variantId: null,
      variantName: null,
      quantity: 2,
      unitPrice: 150,
      totalPrice: 300,
      specialInstructions: null,
      addons: [],
    },
    {
      cartItemId: "item-2",
      menuItemId: "dish-2",
      menuItemName: "Lime Juice",
      variantId: null,
      variantName: null,
      quantity: 1,
      unitPrice: 150,
      totalPrice: 150,
      specialInstructions: null,
      addons: [],
    },
  ],
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  queryClient.setQueryData(["cart", "cart-123"], mockCart);

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, queryClient };
};

describe("useRemoveCartItem hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCartStore.getState().resetCart();
    useCartStore.getState().setCartId("cart-123");
  });

  it("calls cartService.removeItem and shows success toast on successful deletion", async () => {
    const { wrapper } = createWrapper();
    const onSuccess = jest.fn();

    (cartService.removeItem as jest.Mock).mockResolvedValue({
      cartId: "cart-123",
      restaurantId: "rest-1",
      itemCount: 1,
      subtotal: 150,
      updatedAt: "2026-10-16T10:05:00.000Z",
      items: [
        {
          cartItemId: "item-2",
          menuItemId: "dish-2",
          quantity: 1,
          unitPrice: 150,
          totalPrice: 150,
        },
      ],
    });

    const { result } = renderHook(() => useRemoveCartItem({ cartId: "cart-123", onSuccess }), {
      wrapper,
    });

    act(() => {
      result.current.removeItem("item-1");
    });

    await waitFor(() => {
      expect(cartService.removeItem).toHaveBeenCalledWith("cart-123", "item-1");
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(CART_UI_MESSAGES.REMOVE_ITEM_SUCCESS);
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it("optimistically updates cache by removing item before server response", async () => {
    const { wrapper, queryClient } = createWrapper();

    let resolvePromise: (value: unknown) => void = () => {};
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (cartService.removeItem as jest.Mock).mockReturnValue(promise);

    const { result } = renderHook(() => useRemoveCartItem({ cartId: "cart-123" }), { wrapper });

    act(() => {
      result.current.removeItem("item-1");
    });

    await waitFor(() => {
      const optimisticCart = queryClient.getQueryData<Cart>(["cart", "cart-123"]);
      expect(optimisticCart?.items.map((i) => i.cartItemId)).toEqual(["item-2"]);
      expect(optimisticCart?.itemCount).toBe(1);
      expect(optimisticCart?.subtotal).toBe(150);
    });

    await act(async () => {
      resolvePromise({
        cartId: "cart-123",
        restaurantId: "rest-1",
        itemCount: 1,
        subtotal: 150,
        updatedAt: "2026-10-16T10:05:00.000Z",
        items: [],
      });
    });
  });

  it("rolls back optimistic update and displays error toast on network failure", async () => {
    const { wrapper, queryClient } = createWrapper();
    const onError = jest.fn();

    (cartService.removeItem as jest.Mock).mockRejectedValue(new Error("Network timeout"));

    const { result } = renderHook(() => useRemoveCartItem({ cartId: "cart-123", onError }), {
      wrapper,
    });

    act(() => {
      result.current.removeItem("item-1");
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network timeout");
    });

    expect(onError).toHaveBeenCalled();
    const restoredCart = queryClient.getQueryData<Cart>(["cart", "cart-123"]);
    expect(restoredCart?.items.map((i) => i.cartItemId)).toEqual(["item-1", "item-2"]);
    expect(restoredCart?.itemCount).toBe(3);
    expect(restoredCart?.subtotal).toBe(450);
  });
});

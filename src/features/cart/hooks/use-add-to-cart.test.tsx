import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cart.store";
import { useAddToCart } from "./use-add-to-cart";

jest.mock("../services/cart.service", () => ({
  cartService: {
    addItem: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("useAddToCart hook", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    useCartStore.getState().resetCart();
    jest.clearAllMocks();
  });

  it("throws error when active cart ID is missing", async () => {
    const { result } = renderHook(() => useAddToCart(), { wrapper });

    await expect(
      result.current.mutateAsync({
        restaurantId: "rest-1",
        menuItemId: "item-1",
        quantity: 1,
      }),
    ).rejects.toThrow("No active cart found");
  });

  it("successfully adds item, updates store, and invalidates query", async () => {
    useCartStore.getState().setCartId("cart-123");

    const mockResponse = {
      cartId: "cart-123",
      restaurantId: "rest-1",
      itemCount: 2,
      subtotal: 400,
      updatedAt: "2026-10-16T12:00:00.000Z",
      items: [
        {
          id: "item-row-1",
          menuItemId: "item-1",
          quantity: 2,
          unitPrice: 200,
          totalPrice: 400,
        },
      ],
    };

    (cartService.addItem as jest.Mock).mockResolvedValue(mockResponse);

    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useAddToCart(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        restaurantId: "rest-1",
        menuItemId: "item-1",
        quantity: 2,
        specialInstructions: "No onions",
      });
    });

    expect(cartService.addItem).toHaveBeenCalledWith("cart-123", {
      restaurantId: "rest-1",
      menuItemId: "item-1",
      variantId: null,
      addonIds: [],
      quantity: 2,
      specialInstructions: "No onions",
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["cart", "cart-123"] });
    expect(useCartStore.getState().isBadgePulsing).toBe(true);
    expect(toast.success).toHaveBeenCalledWith(CART_UI_MESSAGES.ITEM_ADDED_SUCCESS);
  });

  it("triggers onConflict callback when 409 DIFFERENT_RESTAURANT_CART occurs", async () => {
    useCartStore.getState().setCartId("cart-123");

    const conflictError = Object.assign(
      new Error("DIFFERENT_RESTAURANT_CART: Active cart belongs to another restaurant"),
      {
        response: { status: 409 },
      },
    );

    (cartService.addItem as jest.Mock).mockRejectedValue(conflictError);

    const onConflict = jest.fn();
    const { result } = renderHook(() => useAddToCart({ onConflict }), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          restaurantId: "rest-diff",
          menuItemId: "item-99",
          quantity: 1,
        });
      } catch {}
    });

    expect(onConflict).toHaveBeenCalledTimes(1);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("displays out of stock message when 409 ITEM_UNAVAILABLE occurs", async () => {
    useCartStore.getState().setCartId("cart-123");

    const unavailableError = Object.assign(new Error("ITEM_UNAVAILABLE: Item is not available"), {
      response: { status: 409 },
    });

    (cartService.addItem as jest.Mock).mockRejectedValue(unavailableError);

    const { result } = renderHook(() => useAddToCart(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          restaurantId: "rest-1",
          menuItemId: "item-soldout",
          quantity: 1,
        });
      } catch {}
    });

    expect(toast.error).toHaveBeenCalledWith(CART_UI_MESSAGES.ITEM_UNAVAILABLE_MESSAGE);
  });
});

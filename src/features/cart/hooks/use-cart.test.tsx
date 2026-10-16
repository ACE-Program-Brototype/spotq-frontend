import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cart.store";
import { useCart } from "./use-cart";

jest.mock("../services/cart.service", () => ({
  cartService: {
    getCart: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCart hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCartStore.getState().resetCart();
  });

  it("returns empty default state when no cartId is available", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    expect(result.current.cart).toBeNull();
    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.isEmpty).toBe(true);
    expect(cartService.getCart).not.toHaveBeenCalled();
  });

  it("fetches cart details when cartId is set in store", async () => {
    useCartStore.getState().setCartId("cart-999");

    const mockCart = {
      cartId: "cart-999",
      restaurantId: "rest-1",
      userId: "user-1",
      status: "ACTIVE",
      itemCount: 3,
      subtotal: 750,
      createdAt: "2026-10-16T10:00:00.000Z",
      updatedAt: "2026-10-16T10:00:00.000Z",
      expiresAt: "2026-10-17T10:00:00.000Z",
      items: [
        {
          cartItemId: "item-1",
          menuItemId: "dish-1",
          menuItemName: "Paneer Tikka",
          variantId: null,
          variantName: null,
          quantity: 3,
          unitPrice: 250,
          totalPrice: 750,
          specialInstructions: null,
          addons: [],
        },
      ],
    };

    (cartService.getCart as jest.Mock).mockResolvedValue(mockCart);

    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(cartService.getCart).toHaveBeenCalledWith("cart-999");
    expect(result.current.cart).toEqual(mockCart);
    expect(result.current.itemCount).toBe(3);
    expect(result.current.subtotal).toBe(750);
    expect(result.current.isEmpty).toBe(false);
  });

  it("resets cart and displays toast when server returns 410 expired", async () => {
    useCartStore.getState().setCartId("cart-expired");

    const errorResponse = {
      response: {
        status: 410,
        clone: () => ({
          json: async () => ({ message: "Cart has expired" }),
        }),
      },
    };

    (cartService.getCart as jest.Mock).mockRejectedValue(errorResponse);

    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(toast.error).toHaveBeenCalled();
    expect(useCartStore.getState().cartId).toBeNull();
  });
});

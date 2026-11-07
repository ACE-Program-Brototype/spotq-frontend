import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cart.store";
import type { AddBatchCartItemsPayload } from "../types/cart.types";
import { useBatchAddToCart } from "./useBatchAddToCart";

jest.mock("../services/cart.service", () => ({
  cartService: {
    batchAddToCart: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("useBatchAddToCart", () => {
  let queryClient: QueryClient;

  const mockPayload: AddBatchCartItemsPayload = {
    restaurantId: "rest-101",
    items: [
      {
        menuItemId: "menu-item-1",
        quantity: 2,
        variantId: "var-1",
        addonIds: ["addon-1"],
      },
    ],
  };

  const mockResponse = {
    success: true,
    message: "Items added to cart",
    data: {
      cartId: "cart-101",
      restaurantId: "rest-101",
      items: [],
      itemCount: 2,
      subtotal: 500,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("calls cartService.batchAddToCart, clears local cart storage, invalidates checkout cache, and invokes onSuccess callback", async () => {
    (cartService.batchAddToCart as jest.Mock).mockResolvedValueOnce(mockResponse);
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const clearCartSpy = jest.spyOn(useCartStore.getState(), "clearCart");
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useBatchAddToCart({ onSuccess }), { wrapper });

    await act(async () => {
      result.current.batchAddToCart(mockPayload);
    });

    expect(cartService.batchAddToCart).toHaveBeenCalledWith(mockPayload);
    expect(clearCartSpy).toHaveBeenCalled();
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["checkout", "details"] });
    expect(onSuccess).toHaveBeenCalledWith(mockResponse);
  });

  it("triggers toast error and onError callback when mutation fails", async () => {
    const error = new Error("Items out of stock");
    (cartService.batchAddToCart as jest.Mock).mockRejectedValueOnce(error);
    const onError = jest.fn();

    const { result } = renderHook(() => useBatchAddToCart({ onError }), { wrapper });

    await act(async () => {
      result.current.batchAddToCart(mockPayload);
    });

    expect(toast.error).toHaveBeenCalledWith("Items out of stock");
    expect(onError).toHaveBeenCalledWith(error);
  });
});

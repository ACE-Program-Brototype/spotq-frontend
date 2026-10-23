import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { cartService } from "../services/cart.service";
import type { AddToCartPayload } from "../types/cart.types";
import { useAddToCart } from "./useAddToCart";

jest.mock("../services/cart.service", () => ({
  cartService: {
    addToCart: jest.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useAddToCart", () => {
  const mockPayload: AddToCartPayload = {
    restaurantId: "rest-1",
    menuItemId: "item-1",
    quantity: 1,
    addonIds: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls cartService.addToCart on mutate", async () => {
    const mockResponse = { success: true, data: { id: "cart-item-1" } };
    (cartService.addToCart as jest.Mock).mockResolvedValue(mockResponse);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useAddToCart({ onSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(cartService.addToCart).toHaveBeenCalledWith(mockPayload);
    expect(onSuccess).toHaveBeenCalledWith(mockResponse, mockPayload);
  });

  it("handles errors when addToCart fails", async () => {
    const mockError = new Error("Failed to add");
    (cartService.addToCart as jest.Mock).mockRejectedValue(mockError);

    const onError = jest.fn();
    const { result } = renderHook(() => useAddToCart({ onError }), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onError).toHaveBeenCalledWith(mockError, mockPayload);
  });
});

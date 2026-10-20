import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cart.store";
import type { Cart } from "../types/cart.types";
import { useUpdateCartQuantity } from "./use-update-cart-quantity";

jest.mock("../services/cart.service", () => ({
  cartService: {
    updateQuantity: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockInitialCart: Cart = {
  cartId: "cart-123",
  restaurantId: "rest-456",
  userId: "user-789",
  status: "ACTIVE",
  itemCount: 2,
  subtotal: 500,
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
      unitPrice: 250,
      totalPrice: 500,
      specialInstructions: null,
      addons: [],
    },
  ],
};

describe("useUpdateCartQuantity hook", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    useCartStore.getState().setCartId("cart-123");
    queryClient.setQueryData(["cart", "cart-123"], mockInitialCart);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("optimistically updates item quantity and subtotal immediately", () => {
    const { result } = renderHook(() => useUpdateCartQuantity(), { wrapper });

    act(() => {
      result.current.increment("item-1");
    });

    const cachedCart = queryClient.getQueryData<Cart>(["cart", "cart-123"]);
    expect(cachedCart?.items[0].quantity).toBe(3);
    expect(cachedCart?.items[0].totalPrice).toBe(750);
    expect(cachedCart?.itemCount).toBe(3);
    expect(cachedCart?.subtotal).toBe(750);
    expect(result.current.isItemPending("item-1")).toBe(true);
  });

  it("debounces rapid clicks and fires single API call with final quantity", async () => {
    (cartService.updateQuantity as jest.Mock).mockResolvedValue({
      cartId: "cart-123",
      restaurantId: "rest-456",
      itemCount: 5,
      subtotal: 1250,
      updatedAt: "2026-10-16T10:05:00.000Z",
      items: [],
    });

    const { result } = renderHook(() => useUpdateCartQuantity(), { wrapper });

    // Rapidly increment 3 times within 100ms intervals
    act(() => {
      result.current.increment("item-1");
    });
    act(() => {
      jest.advanceTimersByTime(100);
      result.current.increment("item-1");
    });
    act(() => {
      jest.advanceTimersByTime(100);
      result.current.increment("item-1");
    });

    // Cache should be 5
    const cachedCart = queryClient.getQueryData<Cart>(["cart", "cart-123"]);
    expect(cachedCart?.items[0].quantity).toBe(5);

    // API should not have been called yet
    expect(cartService.updateQuantity).not.toHaveBeenCalled();

    // Advance remaining debounce delay (300ms)
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(cartService.updateQuantity).toHaveBeenCalledTimes(1);
    expect(cartService.updateQuantity).toHaveBeenCalledWith("cart-123", "item-1", 5);
  });

  it("calls removeItem when stepping to 0 or calling removeItem explicitly", async () => {
    (cartService.removeItem as jest.Mock).mockResolvedValue({
      cartId: "cart-123",
      restaurantId: "rest-456",
      itemCount: 0,
      subtotal: 0,
      updatedAt: "2026-10-16T10:05:00.000Z",
      items: [],
    });

    const { result } = renderHook(() => useUpdateCartQuantity(), { wrapper });

    await act(async () => {
      result.current.removeItem("item-1");
    });

    // Item removed optimistically
    const cachedCart = queryClient.getQueryData<Cart>(["cart", "cart-123"]);
    expect(cachedCart?.items).toHaveLength(0);
    expect(cachedCart?.subtotal).toBe(0);

    expect(cartService.removeItem).toHaveBeenCalledWith("cart-123", "item-1");
    expect(toast.success).toHaveBeenCalledWith("Item removed from cart");
  });

  it("rolls back optimistic cache and triggers error toast on server failure", async () => {
    (cartService.updateQuantity as jest.Mock).mockRejectedValue(
      new Error("Database connection error"),
    );

    const { result } = renderHook(() => useUpdateCartQuantity(), { wrapper });

    act(() => {
      result.current.increment("item-1");
    });

    // Cache updated optimistically to 3
    expect(queryClient.getQueryData<Cart>(["cart", "cart-123"])?.items[0].quantity).toBe(3);

    // Run debounce timer to trigger API call
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Cache rolled back to 2
    expect(queryClient.getQueryData<Cart>(["cart", "cart-123"])?.items[0].quantity).toBe(2);
    expect(toast.error).toHaveBeenCalledWith("Database connection error");
  });
});

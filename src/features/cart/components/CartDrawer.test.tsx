import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { useCart } from "../hooks/use-cart";
import { useCartStore } from "../store/cart.store";
import { CartDrawer } from "./CartDrawer";

jest.mock("../hooks/use-cart");

const mockUseCart = useCart as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("CartDrawer component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCartStore.getState().resetCart();
  });

  it("does not render when isDrawerOpen is false", () => {
    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isLoading: false,
      isError: false,
      isEmpty: true,
      refetch: jest.fn(),
    });

    render(<CartDrawer />, { wrapper: createWrapper() });

    expect(screen.queryByTestId("cart-drawer-container")).not.toBeInTheDocument();
  });

  it("renders drawer panel and empty state when open and cart is empty", () => {
    useCartStore.getState().openDrawer();

    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isLoading: false,
      isError: false,
      isEmpty: true,
      refetch: jest.fn(),
    });

    render(<CartDrawer />, { wrapper: createWrapper() });

    expect(screen.getByTestId("cart-drawer-container")).toBeInTheDocument();
    expect(screen.getByTestId("cart-empty-state")).toBeInTheDocument();
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("closes drawer when clicking close button", () => {
    useCartStore.getState().openDrawer();

    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isLoading: false,
      isError: false,
      isEmpty: true,
      refetch: jest.fn(),
    });

    render(<CartDrawer />, { wrapper: createWrapper() });

    const closeBtn = screen.getByRole("button", { name: /close cart drawer/i });
    fireEvent.click(closeBtn);

    expect(useCartStore.getState().isDrawerOpen).toBe(false);
  });

  it("closes drawer when clicking backdrop", () => {
    useCartStore.getState().openDrawer();

    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isLoading: false,
      isError: false,
      isEmpty: true,
      refetch: jest.fn(),
    });

    render(<CartDrawer />, { wrapper: createWrapper() });

    const backdrop = screen.getByTestId("cart-drawer-backdrop");
    fireEvent.click(backdrop);

    expect(useCartStore.getState().isDrawerOpen).toBe(false);
  });

  it("closes drawer when pressing Escape key", () => {
    useCartStore.getState().openDrawer();

    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isLoading: false,
      isError: false,
      isEmpty: true,
      refetch: jest.fn(),
    });

    render(<CartDrawer />, { wrapper: createWrapper() });

    fireEvent.keyDown(window, { key: "Escape" });

    expect(useCartStore.getState().isDrawerOpen).toBe(false);
  });

  it("renders cart item list and summary card when populated", () => {
    useCartStore.getState().openDrawer();

    const mockItems = [
      {
        cartItemId: "item-1",
        menuItemId: "dish-1",
        menuItemName: "Butter Naan",
        variantId: null,
        variantName: null,
        quantity: 2,
        unitPrice: 40,
        totalPrice: 80,
        specialInstructions: null,
        addons: [],
      },
    ];

    mockUseCart.mockReturnValue({
      items: mockItems,
      itemCount: 2,
      subtotal: 80,
      isLoading: false,
      isError: false,
      isEmpty: false,
      refetch: jest.fn(),
    });

    render(<CartDrawer />, { wrapper: createWrapper() });

    expect(screen.getByTestId("cart-item-list")).toBeInTheDocument();
    expect(screen.getByText("Butter Naan")).toBeInTheDocument();
    expect(screen.getByTestId("cart-summary-card")).toBeInTheDocument();
  });

  it("renders skeleton during loading", () => {
    useCartStore.getState().openDrawer();

    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isLoading: true,
      isError: false,
      isEmpty: true,
      refetch: jest.fn(),
    });

    render(<CartDrawer />, { wrapper: createWrapper() });

    expect(screen.getByTestId("cart-skeleton")).toBeInTheDocument();
  });

  it("renders error banner with retry button on error", () => {
    useCartStore.getState().openDrawer();
    const mockRefetch = jest.fn();

    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isLoading: false,
      isError: true,
      isEmpty: true,
      refetch: mockRefetch,
    });

    render(<CartDrawer />, { wrapper: createWrapper() });

    expect(screen.getByTestId("cart-error-banner")).toBeInTheDocument();
    const retryBtn = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(retryBtn);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { useCart } from "../hooks/use-cart";
import { CartPage } from "./CartPage";

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

describe("CartPage component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders cart page with empty state when cart is empty", () => {
    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isLoading: false,
      isError: false,
      isEmpty: true,
      refetch: jest.fn(),
    });

    render(<CartPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("customer-cart-page")).toBeInTheDocument();
    expect(screen.getByTestId("cart-empty-state")).toBeInTheDocument();
  });

  it("renders item list and summary card when items are present", () => {
    mockUseCart.mockReturnValue({
      items: [
        {
          cartItemId: "item-1",
          menuItemId: "dish-1",
          menuItemName: "Dal Makhani",
          variantId: null,
          variantName: null,
          quantity: 1,
          unitPrice: 180,
          totalPrice: 180,
          specialInstructions: null,
          addons: [],
        },
      ],
      itemCount: 1,
      subtotal: 180,
      isLoading: false,
      isError: false,
      isEmpty: false,
      refetch: jest.fn(),
    });

    render(<CartPage />, { wrapper: createWrapper() });

    expect(screen.getByText("Dal Makhani")).toBeInTheDocument();
    expect(screen.getByTestId("cart-summary-card")).toBeInTheDocument();
    expect(screen.getByText("Browse Menu")).toBeInTheDocument();
  });

  it("renders skeleton placeholder during loading", () => {
    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isLoading: true,
      isError: false,
      isEmpty: true,
      refetch: jest.fn(),
    });

    render(<CartPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("cart-skeleton")).toBeInTheDocument();
  });

  it("renders error state with retry button on failure", () => {
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

    render(<CartPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("cart-error-banner")).toBeInTheDocument();
    const retryBtn = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(retryBtn);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});

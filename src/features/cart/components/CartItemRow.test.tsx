import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import type { CartItem } from "../types/cart.types";
import { CartItemRow } from "./CartItemRow";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockItem: CartItem = {
  cartItemId: "item-123",
  menuItemId: "dish-456",
  menuItemName: "Chicken Biryani",
  variantId: "var-1",
  variantName: "Family Pack",
  quantity: 2,
  unitPrice: 320,
  totalPrice: 680,
  specialInstructions: "Extra raita and salan",
  addons: [
    {
      addonId: "addon-1",
      addonName: "Boiled Egg",
      price: 20,
    },
    {
      addonId: "addon-2",
      addonName: "Extra Gravy",
      price: 20,
    },
  ],
};

describe("CartItemRow component", () => {
  it("renders dish name, variant badge, and quantity stepper count", () => {
    render(<CartItemRow item={mockItem} />, { wrapper: createWrapper() });

    expect(screen.getByText("Chicken Biryani")).toBeInTheDocument();
    expect(screen.getByText("Family Pack")).toBeInTheDocument();
    expect(screen.getByTestId("quantity-stepper-count")).toHaveTextContent("2");
  });

  it("renders related addons with prices formatted in INR", () => {
    render(<CartItemRow item={mockItem} />, { wrapper: createWrapper() });

    expect(screen.getByText("Boiled Egg")).toBeInTheDocument();
    expect(screen.getByText("Extra Gravy")).toBeInTheDocument();
    expect(screen.getAllByText(/\(\+₹20\.00\)/)).toHaveLength(2);
  });

  it("renders special instructions note", () => {
    render(<CartItemRow item={mockItem} />, { wrapper: createWrapper() });

    expect(screen.getByText(/"Extra raita and salan"/)).toBeInTheDocument();
  });

  it("renders formatted unit price and total price in INR", () => {
    render(<CartItemRow item={mockItem} />, { wrapper: createWrapper() });

    expect(screen.getByText("₹320.00")).toBeInTheDocument();
    expect(screen.getByTestId("item-total-price")).toHaveTextContent("₹680.00");
  });

  it("delegates increment, decrement, and remove actions to custom callbacks if provided", () => {
    const handleIncrement = jest.fn();
    const handleDecrement = jest.fn();
    const handleRemove = jest.fn();

    render(
      <CartItemRow
        item={mockItem}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
      />,
      { wrapper: createWrapper() },
    );

    fireEvent.click(screen.getByTestId("quantity-stepper-increment"));
    expect(handleIncrement).toHaveBeenCalledWith("item-123");

    fireEvent.click(screen.getByTestId("quantity-stepper-decrement"));
    expect(handleDecrement).toHaveBeenCalledWith("item-123");
  });

  it("renders cleanly without variant, addons, or special instructions when omitted", () => {
    const minimalItem: CartItem = {
      cartItemId: "item-minimal",
      menuItemId: "dish-789",
      menuItemName: "Masala Dosa",
      variantId: null,
      variantName: null,
      quantity: 1,
      unitPrice: 90,
      totalPrice: 90,
      specialInstructions: null,
      addons: [],
    };

    render(<CartItemRow item={minimalItem} />, { wrapper: createWrapper() });

    expect(screen.getByText("Masala Dosa")).toBeInTheDocument();
    expect(screen.queryByText("Add-ons:")).not.toBeInTheDocument();
    expect(screen.queryByText("Note:")).not.toBeInTheDocument();
  });
});

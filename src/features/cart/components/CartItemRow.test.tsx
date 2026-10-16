import { render, screen } from "@testing-library/react";
import type { CartItem } from "../types/cart.types";
import { CartItemRow } from "./CartItemRow";

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
  it("renders dish name, variant badge, and quantity pill", () => {
    render(<CartItemRow item={mockItem} />);

    expect(screen.getByText("Chicken Biryani")).toBeInTheDocument();
    expect(screen.getByText("Family Pack")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders related addons with prices formatted in INR", () => {
    render(<CartItemRow item={mockItem} />);

    expect(screen.getByText("Boiled Egg")).toBeInTheDocument();
    expect(screen.getByText("Extra Gravy")).toBeInTheDocument();
    expect(screen.getAllByText(/\(\+₹20\.00\)/)).toHaveLength(2);
  });

  it("renders special instructions note", () => {
    render(<CartItemRow item={mockItem} />);

    expect(screen.getByText(/"Extra raita and salan"/)).toBeInTheDocument();
  });

  it("renders formatted unit price and total price in INR", () => {
    render(<CartItemRow item={mockItem} />);

    expect(screen.getByText("₹320.00")).toBeInTheDocument();
    expect(screen.getByText("₹680.00")).toBeInTheDocument();
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

    render(<CartItemRow item={minimalItem} />);

    expect(screen.getByText("Masala Dosa")).toBeInTheDocument();
    expect(screen.queryByText("Add-ons:")).not.toBeInTheDocument();
    expect(screen.queryByText("Note:")).not.toBeInTheDocument();
  });
});

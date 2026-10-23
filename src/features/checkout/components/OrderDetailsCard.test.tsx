import { render, screen } from "@testing-library/react";
import { MOCK_CART_DATA } from "../constants/checkout.constants";
import { OrderDetailsCard } from "./OrderDetailsCard";

describe("OrderDetailsCard", () => {
  it("renders cart item names, prices, quantities, and addons", () => {
    render(<OrderDetailsCard cart={MOCK_CART_DATA} />);

    expect(screen.getByText("Order Details")).toBeInTheDocument();
    expect(screen.getByText("Wok-Tossed Hakka Noodles")).toBeInTheDocument();
    expect(screen.getByText(/₹1,400/i)).toBeInTheDocument();
    expect(screen.getByText("Qty: 7")).toBeInTheDocument();
    expect(screen.getByText(/\+ MAYONISE \(₹10\)/i)).toBeInTheDocument();
  });

  it("renders empty message when no items in cart", () => {
    render(<OrderDetailsCard cart={{ ...MOCK_CART_DATA, items: [], itemCount: 0 }} />);

    expect(screen.getByText(/Your order list is empty/i)).toBeInTheDocument();
  });
});

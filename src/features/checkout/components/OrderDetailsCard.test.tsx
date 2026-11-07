import { render, screen } from "@testing-library/react";
import type { CheckoutDetailsData } from "../types/checkout.types";
import { OrderDetailsCard } from "./OrderDetailsCard";

describe("OrderDetailsCard", () => {
  const mockCart: CheckoutDetailsData = {
    cartId: "test-cart-1",
    restaurantId: "test-rest-1",
    restaurantName: "Spice Garden Cafe",
    payment: {
      mode: "ONLINE",
      paymentRequired: true,
    },
    itemCount: 7,
    subtotal: 1410,
    taxAmount: 70.5,
    grandTotal: 1480.5,
    items: [
      {
        cartItemId: "item-1",
        menuItemId: "menu-1",
        name: "Wok-Tossed Hakka Noodles",
        variantId: null,
        variantName: "Regular Bowl",
        quantity: 7,
        unitPrice: 200,
        totalPrice: 1400,
        specialInstructions: null,
        addons: [
          {
            addonId: "addon-1",
            name: "MAYONISE",
            price: 10,
          },
        ],
      },
    ],
  };

  it("renders cart item names, prices, quantities, and addons", () => {
    render(<OrderDetailsCard cart={mockCart} />);

    expect(screen.getByText("Order Details")).toBeInTheDocument();
    expect(screen.getByText("Wok-Tossed Hakka Noodles")).toBeInTheDocument();
    expect(screen.getByText(/₹1,400/i)).toBeInTheDocument();
    expect(screen.getByText("Qty: 7")).toBeInTheDocument();
    expect(screen.getByText(/\+ MAYONISE \(₹10\)/i)).toBeInTheDocument();
  });

  it("renders empty message when no items in cart", () => {
    render(<OrderDetailsCard cart={{ ...mockCart, items: [], itemCount: 0 }} />);

    expect(screen.getByText(/Your order list is empty/i)).toBeInTheDocument();
  });

  it("renders loading skeleton when isLoading is true", () => {
    render(<OrderDetailsCard cart={null} isLoading={true} />);

    expect(screen.getByTestId("order-details-skeleton")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CheckoutSuccessPage } from "./CheckoutSuccessPage";

describe("CheckoutSuccessPage", () => {
  it("renders order success details when order is present in state", () => {
    const mockOrder = {
      orderId: "ord-123",
      orderNumber: "ORD-5678",
      restaurantId: "rest-1",
      restaurantName: "Spice Garden Cafe",
      totalAmount: 1913,
      paymentMode: "ONLINE" as const,
      orderType: "SELF_SERVICE_TABLE" as const,
      tableNumber: 4,
      createdAt: new Date().toISOString(),
    };

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/checkout/success",
            state: { order: mockOrder },
          },
        ]}
      >
        <CheckoutSuccessPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Order #ORD-5678/i)).toBeInTheDocument();
    expect(screen.getByText("Spice Garden Cafe")).toBeInTheDocument();
    expect(screen.getByText(/Table 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Razorpay \(Online Prepay\)/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Track Live Orders/i })).toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import type { PriceBreakdown } from "../types/checkout.types";
import { OrderSummaryCard } from "./OrderSummaryCard";

describe("OrderSummaryCard", () => {
  const mockCheckout = jest.fn();

  const priceBreakdown: PriceBreakdown = {
    itemsSubtotal: 1820,
    gstAmount: 91,
    gstRate: 0.05,
    platformFee: 0,
    grandTotal: 1911,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correct price breakdown with ₹0 SpotQ Platform Fee and Grand Total", () => {
    render(
      <OrderSummaryCard
        priceBreakdown={priceBreakdown}
        paymentMode="ONLINE"
        isSubmitting={false}
        onCheckout={mockCheckout}
        itemCount={9}
      />,
    );

    expect(screen.getByText("Order Summary")).toBeInTheDocument();
    expect(screen.getByText("Item Total")).toBeInTheDocument();
    expect(screen.getByText("₹1,820.00")).toBeInTheDocument();
    expect(screen.getByText(/SpotQ Platform Fee/i)).toBeInTheDocument();
    expect(screen.getByText("₹0.00")).toBeInTheDocument();
    expect(screen.getByText("FREE")).toBeInTheDocument();
    expect(screen.getByText("Grand Total")).toBeInTheDocument();
    expect(screen.getByText("₹1,911.00")).toBeInTheDocument();
    expect(screen.getByText(/Safe and Secure Payments/i)).toBeInTheDocument();
  });

  it("calls onCheckout when Pay Now button is clicked", () => {
    render(
      <OrderSummaryCard
        priceBreakdown={priceBreakdown}
        paymentMode="ONLINE"
        isSubmitting={false}
        onCheckout={mockCheckout}
        itemCount={9}
      />,
    );

    const payButton = screen.getByRole("button", { name: /Pay Now ₹1,911.00/i });
    fireEvent.click(payButton);

    expect(mockCheckout).toHaveBeenCalledTimes(1);
  });

  it("disables button during ongoing submission to prevent duplicate payments", () => {
    render(
      <OrderSummaryCard
        priceBreakdown={priceBreakdown}
        paymentMode="ONLINE"
        flow="SELF_SERVICE_TABLE"
        isSubmitting={true}
        onCheckout={mockCheckout}
        itemCount={9}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: /Processing Order/i });
    expect(submitBtn).toBeDisabled();

    fireEvent.click(submitBtn);
    expect(mockCheckout).not.toHaveBeenCalled();
  });
});

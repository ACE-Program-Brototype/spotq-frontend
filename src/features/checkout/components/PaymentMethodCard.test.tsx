import { render, screen } from "@testing-library/react";
import { PaymentMethodCard } from "./PaymentMethodCard";

describe("PaymentMethodCard", () => {
  it("renders payment method with Razorpay and FASTEST badge", () => {
    render(<PaymentMethodCard paymentMode="ONLINE" />);

    expect(screen.getByText("Payment Method")).toBeInTheDocument();
    expect(screen.getAllByText("Razorpay").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("FASTEST")).toBeInTheDocument();
    expect(
      screen.getByText("Supports Google Pay, PhonePe, Paytm, All Major Cards & Netbanking"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Pay at Counter")).not.toBeInTheDocument();
  });

  it("renders 100% secure payment note", () => {
    render(<PaymentMethodCard paymentMode="ONLINE" />);

    expect(screen.getByText(/Pay securely online with Razorpay/i)).toBeInTheDocument();
  });
});

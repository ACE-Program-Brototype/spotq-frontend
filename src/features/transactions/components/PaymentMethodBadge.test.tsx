import { render, screen } from "@testing-library/react";
import { PaymentMethodBadge } from "./PaymentMethodBadge";

describe("PaymentMethodBadge", () => {
  it("renders UPI badge correctly", () => {
    render(<PaymentMethodBadge method="UPI" />);
    expect(screen.getByTestId("payment-method-badge-upi")).toBeInTheDocument();
    expect(screen.getByText("UPI")).toBeInTheDocument();
  });

  it("renders CARD badge correctly", () => {
    render(<PaymentMethodBadge method="CARD" />);
    expect(screen.getByTestId("payment-method-badge-card")).toBeInTheDocument();
    expect(screen.getByText("CARD")).toBeInTheDocument();
  });

  it("renders NETBANKING badge correctly", () => {
    render(<PaymentMethodBadge method="NETBANKING" />);
    expect(screen.getByTestId("payment-method-badge-netbanking")).toBeInTheDocument();
    expect(screen.getByText("NETBANKING")).toBeInTheDocument();
  });

  it("handles unknown payment method gracefully", () => {
    render(<PaymentMethodBadge method="WALLET" />);
    expect(screen.getByText("WALLET")).toBeInTheDocument();
  });
});

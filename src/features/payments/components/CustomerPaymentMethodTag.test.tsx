import { render, screen } from "@testing-library/react";
import { CustomerPaymentMethodTag } from "./CustomerPaymentMethodTag";

describe("CustomerPaymentMethodTag", () => {
  it("renders UPI method with Razorpay UPI label", () => {
    render(<CustomerPaymentMethodTag method="UPI" />);
    expect(screen.getByTestId("payment-method-upi")).toBeInTheDocument();
    expect(screen.getByText("Razorpay UPI")).toBeInTheDocument();
  });

  it("renders Card method tag", () => {
    render(<CustomerPaymentMethodTag method="CARD" />);
    expect(screen.getByTestId("payment-method-card")).toBeInTheDocument();
    expect(screen.getByText("Card")).toBeInTheDocument();
  });

  it("renders Net Banking method tag", () => {
    render(<CustomerPaymentMethodTag method="NETBANKING" />);
    expect(screen.getByTestId("payment-method-netbanking")).toBeInTheDocument();
    expect(screen.getByText("Net Banking")).toBeInTheDocument();
  });

  it("renders Wallet method tag", () => {
    render(<CustomerPaymentMethodTag method="WALLET" />);
    expect(screen.getByTestId("payment-method-wallet")).toBeInTheDocument();
    expect(screen.getByText("Wallet")).toBeInTheDocument();
  });
});

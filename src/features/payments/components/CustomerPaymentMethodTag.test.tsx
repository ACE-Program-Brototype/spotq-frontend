import { render, screen } from "@testing-library/react";
import { CustomerPaymentMethodTag } from "./CustomerPaymentMethodTag";

describe("CustomerPaymentMethodTag", () => {
  it("renders Online method tag", () => {
    render(<CustomerPaymentMethodTag />);
    expect(screen.getByTestId("payment-method-online")).toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("renders Online tag even when method prop is passed", () => {
    const { rerender } = render(<CustomerPaymentMethodTag method="UPI" />);
    expect(screen.getByTestId("payment-method-online")).toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();

    rerender(<CustomerPaymentMethodTag method="CARD" />);
    expect(screen.getByText("Online")).toBeInTheDocument();
  });
});

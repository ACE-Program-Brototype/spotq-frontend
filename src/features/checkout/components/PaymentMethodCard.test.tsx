import { fireEvent, render, screen } from "@testing-library/react";
import { PaymentMethodCard } from "./PaymentMethodCard";

describe("PaymentMethodCard", () => {
  const mockSetPaymentMode = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders payment options with Razorpay and FASTEST badge", () => {
    render(<PaymentMethodCard paymentMode="ONLINE" setPaymentMode={mockSetPaymentMode} />);

    expect(screen.getByText("Payment Method")).toBeInTheDocument();
    expect(screen.getByText("Razorpay")).toBeInTheDocument();
    expect(screen.getByText("FASTEST")).toBeInTheDocument();
    expect(screen.getByText("Pay at Counter")).toBeInTheDocument();
  });

  it("calls setPaymentMode when Pay at Counter is selected", () => {
    render(<PaymentMethodCard paymentMode="ONLINE" setPaymentMode={mockSetPaymentMode} />);

    const counterButton = screen.getByText("Pay at Counter").closest("button");
    expect(counterButton).toBeInTheDocument();
    if (counterButton) {
      fireEvent.click(counterButton);
    }

    expect(mockSetPaymentMode).toHaveBeenCalledWith("PAY_AT_COUNTER");
  });

  it("renders express checkout informational note", () => {
    render(<PaymentMethodCard paymentMode="ONLINE" setPaymentMode={mockSetPaymentMode} />);

    expect(screen.getByText(/Other payment methods are currently disabled/i)).toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { CartSummaryCard } from "./CartSummaryCard";

describe("CartSummaryCard component", () => {
  it("renders subtotal, taxes, and grand total correctly in INR", () => {
    render(<CartSummaryCard subtotal={538} itemCount={2} />);

    expect(screen.getByText("Item Total (2 items)")).toBeInTheDocument();
    expect(screen.getAllByText("₹538.00")).toHaveLength(2);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("To Pay")).toBeInTheDocument();
  });

  it("triggers onCheckout callback when clicked", () => {
    const handleCheckout = jest.fn();
    render(<CartSummaryCard subtotal={250} itemCount={1} onCheckout={handleCheckout} />);

    const button = screen.getByRole("button", {
      name: /proceed to checkout/i,
    });
    fireEvent.click(button);

    expect(handleCheckout).toHaveBeenCalledTimes(1);
  });

  it("disables button when itemCount is 0 or disabled is true", () => {
    const { rerender } = render(<CartSummaryCard subtotal={0} itemCount={0} />);

    let button = screen.getByRole("button", { name: /proceed to checkout/i });
    expect(button).toBeDisabled();

    rerender(<CartSummaryCard subtotal={500} itemCount={2} disabled={true} />);
    button = screen.getByRole("button", { name: /proceed to checkout/i });
    expect(button).toBeDisabled();
  });
});

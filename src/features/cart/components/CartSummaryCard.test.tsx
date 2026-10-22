import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { CartSummaryCard } from "./CartSummaryCard";

describe("CartSummaryCard", () => {
  it("renders subtotal, item count, and checkout button correctly", () => {
    render(<CartSummaryCard subtotal={250.5} itemCount={3} />);

    expect(screen.getByTestId("cart-summary-card")).toBeInTheDocument();
    expect(screen.getByText(CART_UI_MESSAGES.BILL_SUMMARY_HEADING)).toBeInTheDocument();
    expect(
      screen.getByText(`${CART_UI_MESSAGES.ITEM_TOTAL} (3 ${CART_UI_MESSAGES.ITEM_COUNT_PLURAL})`),
    ).toBeInTheDocument();
    expect(screen.getAllByText("₹250.50")).toHaveLength(2);
    expect(screen.getByText(CART_UI_MESSAGES.GRAND_TOTAL)).toBeInTheDocument();
    expect(screen.queryByText(CART_UI_MESSAGES.TAXES_AND_CHARGES)).not.toBeInTheDocument();
  });

  it("handles singular item count label correctly", () => {
    render(<CartSummaryCard subtotal={99} itemCount={1} />);

    expect(
      screen.getByText(`${CART_UI_MESSAGES.ITEM_TOTAL} (1 ${CART_UI_MESSAGES.ITEM_COUNT_SINGLE})`),
    ).toBeInTheDocument();
  });

  it("triggers onCheckout callback when proceed button is clicked", async () => {
    const onCheckout = jest.fn();
    const user = userEvent.setup();

    render(<CartSummaryCard subtotal={150} itemCount={2} onCheckout={onCheckout} />);

    const checkoutBtn = screen.getByRole("button", {
      name: new RegExp(CART_UI_MESSAGES.PROCEED_TO_CHECKOUT, "i"),
    });
    await user.click(checkoutBtn);

    expect(onCheckout).toHaveBeenCalledTimes(1);
  });

  it("disables checkout button when disabled prop is true or itemCount is 0", () => {
    const { rerender } = render(<CartSummaryCard subtotal={0} itemCount={0} />);
    const checkoutBtn = screen.getByRole("button", {
      name: new RegExp(CART_UI_MESSAGES.PROCEED_TO_CHECKOUT, "i"),
    });
    expect(checkoutBtn).toBeDisabled();

    rerender(<CartSummaryCard subtotal={100} itemCount={2} disabled />);
    expect(checkoutBtn).toBeDisabled();
  });
});

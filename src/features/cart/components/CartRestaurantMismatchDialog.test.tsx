import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CART_MESSAGES } from "../constants/cart.constants";
import { CartRestaurantMismatchDialog } from "./CartRestaurantMismatchDialog";

describe("CartRestaurantMismatchDialog", () => {
  it("renders the confirmation message and handles confirm and cancel actions", async () => {
    const user = userEvent.setup();
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();
    const handleOpenChange = jest.fn();

    const { rerender } = render(
      <CartRestaurantMismatchDialog
        open={true}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />,
    );

    expect(screen.getByText(CART_MESSAGES.RESTAURANT_MISMATCH_CONFIRMATION)).toBeInTheDocument();
    expect(screen.getByText(CART_MESSAGES.CONFIRM_TITLE)).toBeInTheDocument();

    const confirmButton = screen.getByText(CART_MESSAGES.CONFIRM_BUTTON);
    const cancelButton = screen.getByText(CART_MESSAGES.CANCEL_BUTTON);

    await user.click(confirmButton);
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    await user.click(cancelButton);
    expect(handleCancel).toHaveBeenCalledTimes(1);

    rerender(
      <CartRestaurantMismatchDialog
        open={false}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />,
    );

    expect(
      screen.queryByText(CART_MESSAGES.RESTAURANT_MISMATCH_CONFIRMATION),
    ).not.toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { RemoveConfirmationPill } from "./RemoveConfirmationPill";

describe("RemoveConfirmationPill component", () => {
  it("renders confirmation title and actions", () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();

    render(<RemoveConfirmationPill onConfirm={handleConfirm} onCancel={handleCancel} />);

    expect(screen.getByText(CART_UI_MESSAGES.REMOVE_CONFIRM_TITLE)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: CART_UI_MESSAGES.CONFIRM_REMOVE_ARIA }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: CART_UI_MESSAGES.CANCEL_REMOVE_ARIA }),
    ).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();

    render(<RemoveConfirmationPill onConfirm={handleConfirm} onCancel={handleCancel} />);

    fireEvent.click(screen.getByRole("button", { name: CART_UI_MESSAGES.CONFIRM_REMOVE_ARIA }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleCancel).not.toHaveBeenCalled();
  });

  it("calls onCancel when cancel button is clicked", () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();

    render(<RemoveConfirmationPill onConfirm={handleConfirm} onCancel={handleCancel} />);

    fireEvent.click(screen.getByRole("button", { name: CART_UI_MESSAGES.CANCEL_REMOVE_ARIA }));
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleConfirm).not.toHaveBeenCalled();
  });

  it("disables buttons when isPending is true", () => {
    render(<RemoveConfirmationPill onConfirm={jest.fn()} onCancel={jest.fn()} isPending={true} />);

    expect(
      screen.getByRole("button", { name: CART_UI_MESSAGES.CONFIRM_REMOVE_ARIA }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: CART_UI_MESSAGES.CANCEL_REMOVE_ARIA }),
    ).toBeDisabled();
  });
});

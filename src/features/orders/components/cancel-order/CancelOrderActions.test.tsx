import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CANCEL_ORDER_MESSAGES } from "@/features/orders/constants/cancel-order.constants";
import { CancelOrderActions } from "./CancelOrderActions";

describe("CancelOrderActions", () => {
  it("renders buttons with proper labels and triggers callbacks", async () => {
    const user = userEvent.setup();
    const onKeepOrder = jest.fn();
    const onConfirmCancel = jest.fn();

    render(
      <CancelOrderActions
        onKeepOrder={onKeepOrder}
        onConfirmCancel={onConfirmCancel}
        isPending={false}
        canConfirm={true}
      />,
    );

    const keepBtn = screen.getByRole("button", {
      name: CANCEL_ORDER_MESSAGES.KEEP_ORDER_BUTTON,
    });
    const confirmBtn = screen.getByRole("button", {
      name: CANCEL_ORDER_MESSAGES.CONFIRM_CANCEL_BUTTON,
    });

    expect(keepBtn).toBeInTheDocument();
    expect(confirmBtn).toBeInTheDocument();

    await user.click(keepBtn);
    expect(onKeepOrder).toHaveBeenCalledTimes(1);

    await user.click(confirmBtn);
    expect(onConfirmCancel).toHaveBeenCalledTimes(1);
  });

  it("shows spinner and disables both buttons when isPending is true", () => {
    render(
      <CancelOrderActions
        onKeepOrder={jest.fn()}
        onConfirmCancel={jest.fn()}
        isPending={true}
        canConfirm={true}
      />,
    );

    expect(
      screen.getByRole("button", { name: CANCEL_ORDER_MESSAGES.KEEP_ORDER_BUTTON }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: CANCEL_ORDER_MESSAGES.CANCELLING_BUTTON }),
    ).toBeDisabled();
    expect(screen.getByText(CANCEL_ORDER_MESSAGES.CANCELLING_BUTTON)).toBeInTheDocument();
  });

  it("disables confirm button when canConfirm is false", () => {
    render(
      <CancelOrderActions
        onKeepOrder={jest.fn()}
        onConfirmCancel={jest.fn()}
        isPending={false}
        canConfirm={false}
      />,
    );

    expect(
      screen.getByRole("button", { name: CANCEL_ORDER_MESSAGES.CONFIRM_CANCEL_BUTTON }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: CANCEL_ORDER_MESSAGES.KEEP_ORDER_BUTTON }),
    ).not.toBeDisabled();
  });
});

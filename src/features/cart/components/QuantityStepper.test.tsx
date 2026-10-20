import { fireEvent, render, screen } from "@testing-library/react";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { QuantityStepper } from "./QuantityStepper";

describe("QuantityStepper component", () => {
  it("renders current quantity count and accessible buttons", () => {
    const handleIncrement = jest.fn();
    const handleDecrement = jest.fn();

    render(
      <QuantityStepper quantity={3} onIncrement={handleIncrement} onDecrement={handleDecrement} />,
    );

    expect(screen.getByTestId("quantity-stepper-count")).toHaveTextContent("3");
    expect(
      screen.getByRole("button", { name: CART_UI_MESSAGES.INCREASE_QUANTITY_ARIA }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: CART_UI_MESSAGES.DECREASE_QUANTITY_ARIA }),
    ).toBeInTheDocument();
  });

  it("calls onIncrement when plus button is clicked", () => {
    const handleIncrement = jest.fn();
    const handleDecrement = jest.fn();

    render(
      <QuantityStepper quantity={2} onIncrement={handleIncrement} onDecrement={handleDecrement} />,
    );

    fireEvent.click(screen.getByRole("button", { name: CART_UI_MESSAGES.INCREASE_QUANTITY_ARIA }));
    expect(handleIncrement).toHaveBeenCalledTimes(1);
    expect(handleDecrement).not.toHaveBeenCalled();
  });

  it("calls onDecrement when minus button is clicked", () => {
    const handleIncrement = jest.fn();
    const handleDecrement = jest.fn();

    render(
      <QuantityStepper quantity={4} onIncrement={handleIncrement} onDecrement={handleDecrement} />,
    );

    fireEvent.click(screen.getByRole("button", { name: CART_UI_MESSAGES.DECREASE_QUANTITY_ARIA }));
    expect(handleDecrement).toHaveBeenCalledTimes(1);
    expect(handleIncrement).not.toHaveBeenCalled();
  });

  it("disables plus button and shows tooltip when reaching maximum limit (20)", () => {
    const handleIncrement = jest.fn();
    const handleDecrement = jest.fn();

    render(
      <QuantityStepper
        quantity={20}
        max={20}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />,
    );

    const plusBtn = screen.getByRole("button", {
      name: CART_UI_MESSAGES.INCREASE_QUANTITY_ARIA,
    });
    expect(plusBtn).toBeDisabled();
    expect(plusBtn).toHaveAttribute("title", CART_UI_MESSAGES.MAX_QUANTITY_REACHED_TOOLTIP);

    fireEvent.click(plusBtn);
    expect(handleIncrement).not.toHaveBeenCalled();
  });

  it("disables both buttons when isPending or disabled is true", () => {
    const handleIncrement = jest.fn();
    const handleDecrement = jest.fn();

    const { rerender } = render(
      <QuantityStepper
        quantity={2}
        isPending={true}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />,
    );

    expect(
      screen.getByRole("button", { name: CART_UI_MESSAGES.INCREASE_QUANTITY_ARIA }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: CART_UI_MESSAGES.DECREASE_QUANTITY_ARIA }),
    ).toBeDisabled();

    rerender(
      <QuantityStepper
        quantity={2}
        disabled={true}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />,
    );

    expect(
      screen.getByRole("button", { name: CART_UI_MESSAGES.INCREASE_QUANTITY_ARIA }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: CART_UI_MESSAGES.DECREASE_QUANTITY_ARIA }),
    ).toBeDisabled();
  });

  it("triggers remove confirmation pill when quantity is 1 and confirmRemove is enabled", () => {
    const handleIncrement = jest.fn();
    const handleDecrement = jest.fn();
    const handleRemove = jest.fn();

    render(
      <QuantityStepper
        quantity={1}
        confirmRemove={true}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
      />,
    );

    fireEvent.click(screen.getByTestId("quantity-stepper-decrement"));

    // Confirmation pill appears
    expect(screen.getByTestId("remove-confirmation-pill")).toBeInTheDocument();
    expect(screen.getByText(CART_UI_MESSAGES.REMOVE_CONFIRM_TITLE)).toBeInTheDocument();

    // Cancel removal
    fireEvent.click(screen.getByTestId("remove-cancel-button"));
    expect(screen.queryByTestId("remove-confirmation-pill")).not.toBeInTheDocument();
    expect(screen.getByTestId("quantity-stepper")).toBeInTheDocument();
    expect(handleRemove).not.toHaveBeenCalled();

    // Trigger again and confirm
    fireEvent.click(screen.getByTestId("quantity-stepper-decrement"));
    fireEvent.click(screen.getByTestId("remove-confirm-button"));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
});

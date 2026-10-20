import { fireEvent, render, screen } from "@testing-library/react";
import { CART_UI_MESSAGES } from "../constants/cart.constants";
import { RemoveItemButton } from "./RemoveItemButton";

describe("RemoveItemButton component", () => {
  it("renders trash button with accessible label", () => {
    render(<RemoveItemButton cartItemId="item-123" onRemove={jest.fn()} />);

    const button = screen.getByTestId("remove-item-button-item-123");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", CART_UI_MESSAGES.REMOVE_ITEM_ARIA);
    expect(button).toHaveAttribute("title", CART_UI_MESSAGES.REMOVE_ITEM_ARIA);
  });

  it("calls onRemove when clicked", () => {
    const onRemove = jest.fn();
    render(<RemoveItemButton cartItemId="item-123" onRemove={onRemove} />);

    const button = screen.getByTestId("remove-item-button-item-123");
    fireEvent.click(button);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    const onRemove = jest.fn();
    render(<RemoveItemButton cartItemId="item-123" onRemove={onRemove} disabled={true} />);

    const button = screen.getByTestId("remove-item-button-item-123");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("is disabled and displays spinner when isPending is true", () => {
    const onRemove = jest.fn();
    render(<RemoveItemButton cartItemId="item-123" onRemove={onRemove} isPending={true} />);

    const button = screen.getByTestId("remove-item-button-item-123");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onRemove).not.toHaveBeenCalled();
  });
});

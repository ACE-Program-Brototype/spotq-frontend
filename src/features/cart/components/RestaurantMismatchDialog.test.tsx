import { fireEvent, render, screen } from "@testing-library/react";
import { RestaurantMismatchDialog } from "./RestaurantMismatchDialog";

describe("RestaurantMismatchDialog component", () => {
  it("renders null when isOpen is false", () => {
    const { container } = render(
      <RestaurantMismatchDialog
        isOpen={false}
        onClose={jest.fn()}
        onConfirmClearAndAdd={jest.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders warning title and explanation when open", () => {
    render(
      <RestaurantMismatchDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirmClearAndAdd={jest.fn()}
      />,
    );

    expect(screen.getByText("Replace cart items?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your cart already contains items from another restaurant. Would you like to clear your existing cart and add this dish?",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mismatch-cancel-button")).toBeInTheDocument();
    expect(screen.getByTestId("mismatch-confirm-button")).toBeInTheDocument();
  });

  it("triggers onClose when clicking cancel", () => {
    const handleClose = jest.fn();
    render(
      <RestaurantMismatchDialog
        isOpen={true}
        onClose={handleClose}
        onConfirmClearAndAdd={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId("mismatch-cancel-button"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("triggers onConfirmClearAndAdd when clicking confirm", () => {
    const handleConfirm = jest.fn();
    render(
      <RestaurantMismatchDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirmClearAndAdd={handleConfirm}
      />,
    );

    fireEvent.click(screen.getByTestId("mismatch-confirm-button"));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("shows clearing state when isClearing is true", () => {
    render(
      <RestaurantMismatchDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirmClearAndAdd={jest.fn()}
        isClearing={true}
      />,
    );

    expect(screen.getByText("Clearing cart...")).toBeInTheDocument();
    expect(screen.getByTestId("mismatch-confirm-button")).toBeDisabled();
    expect(screen.getByTestId("mismatch-cancel-button")).toBeDisabled();
  });
});

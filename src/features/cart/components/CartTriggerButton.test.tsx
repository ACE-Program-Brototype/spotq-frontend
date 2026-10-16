import { fireEvent, render, screen } from "@testing-library/react";
import { useCartStore } from "../store/cart.store";
import { CartTriggerButton } from "./CartTriggerButton";

describe("CartTriggerButton component", () => {
  beforeEach(() => {
    useCartStore.getState().resetCart();
  });

  it("renders cart trigger icon button without badge when count is 0", () => {
    render(<CartTriggerButton itemCount={0} />);

    expect(screen.getByTestId("cart-trigger-button")).toBeInTheDocument();
    expect(screen.queryByTestId("cart-badge-count")).not.toBeInTheDocument();
  });

  it("renders badge count when itemCount > 0", () => {
    render(<CartTriggerButton itemCount={4} />);

    const badge = screen.getByTestId("cart-badge-count");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("4");
  });

  it("opens cart drawer on click by default", () => {
    render(<CartTriggerButton itemCount={1} />);

    expect(useCartStore.getState().isDrawerOpen).toBe(false);
    fireEvent.click(screen.getByTestId("cart-trigger-button"));
    expect(useCartStore.getState().isDrawerOpen).toBe(true);
  });

  it("executes custom onClick callback when provided", () => {
    const handleCustomClick = jest.fn();
    render(<CartTriggerButton itemCount={2} onClick={handleCustomClick} />);

    fireEvent.click(screen.getByTestId("cart-trigger-button"));
    expect(handleCustomClick).toHaveBeenCalledTimes(1);
    expect(useCartStore.getState().isDrawerOpen).toBe(false);
  });
});

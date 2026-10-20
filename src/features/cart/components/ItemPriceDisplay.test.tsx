import { render, screen } from "@testing-library/react";
import { ItemPriceDisplay } from "./ItemPriceDisplay";

describe("ItemPriceDisplay component", () => {
  it("renders formatted total price in INR", () => {
    render(<ItemPriceDisplay totalPrice={450} />);

    expect(screen.getByTestId("item-total-price")).toHaveTextContent("₹450.00");
    expect(screen.queryByTestId("item-unit-breakdown")).not.toBeInTheDocument();
  });

  it("renders unit price breakdown when quantity is greater than 1", () => {
    render(<ItemPriceDisplay totalPrice={600} unitPrice={200} quantity={3} />);

    expect(screen.getByTestId("item-total-price")).toHaveTextContent("₹600.00");
    expect(screen.getByTestId("item-unit-breakdown")).toHaveTextContent("3 × ₹200.00");
  });

  it("does not render unit price breakdown when quantity is 1", () => {
    render(<ItemPriceDisplay totalPrice={250} unitPrice={250} quantity={1} />);

    expect(screen.getByTestId("item-total-price")).toHaveTextContent("₹250.00");
    expect(screen.queryByTestId("item-unit-breakdown")).not.toBeInTheDocument();
  });
});

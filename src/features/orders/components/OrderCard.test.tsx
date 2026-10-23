import { fireEvent, render, screen } from "@testing-library/react";
import type { OrderHistoryItem } from "../types/orders.types";
import { OrderCard } from "./OrderCard";

describe("OrderCard", () => {
  const mockOrder: OrderHistoryItem = {
    order_id: "9a123bc4-56de-78fa-9012-3456789abcde",
    order_number: "ORD-20261021-0001",
    restaurant_id: "3dc35af0-3ff5-4ee9-a60a-fbb47124731b",
    restaurant_name: "Spice Garden",
    status: "COMPLETED",
    items_count: 2,
    total_amount: 540.0,
    created_at: "2026-10-21T18:30:00.000Z",
  };

  it("renders order number, restaurant name, amount, items count, and status badge", () => {
    render(<OrderCard order={mockOrder} />);

    expect(screen.getByText("Order #ORD-20261021-0001")).toBeInTheDocument();
    expect(screen.getByText("Spice Garden")).toBeInTheDocument();
    expect(screen.getByText("₹540.00")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("2 items")).toBeInTheDocument();
  });

  it("renders fallback text when restaurant_name is empty", () => {
    render(<OrderCard order={{ ...mockOrder, restaurant_name: "" }} />);

    expect(screen.getByText("SpotQ Dining Order")).toBeInTheDocument();
  });

  it("renders cancelled badge when order status is CANCELLED", () => {
    render(<OrderCard order={{ ...mockOrder, status: "CANCELLED" }} />);

    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("renders preparing badge when order status is PREPARING", () => {
    render(<OrderCard order={{ ...mockOrder, status: "PREPARING" }} />);

    expect(screen.getByText("Preparing")).toBeInTheDocument();
  });

  it("renders singular item count when items_count is 1", () => {
    render(<OrderCard order={{ ...mockOrder, items_count: 1 }} />);

    expect(screen.getByText("1 item")).toBeInTheDocument();
  });

  it("triggers onSelect callback when card is clicked or Enter key is pressed", () => {
    const handleSelect = jest.fn();
    render(<OrderCard order={mockOrder} onSelect={handleSelect} />);

    const card = screen.getByTestId(`order-card-${mockOrder.order_id}`);
    expect(card).toHaveAttribute("role", "button");
    expect(card).not.toHaveClass("select-none");

    fireEvent.click(card);
    expect(handleSelect).toHaveBeenCalledWith(mockOrder);

    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleSelect).toHaveBeenCalledTimes(2);
  });
});

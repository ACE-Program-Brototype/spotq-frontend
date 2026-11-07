import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { CANCEL_ORDER_MESSAGES } from "@/features/orders/constants/cancel-order.constants";
import type { OrderHistoryItem } from "@/features/orders/types/orders.types";
import { OrderCard } from "./OrderCard";

jest.mock("@/features/orders/services/order.service");

describe("OrderCard", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );

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
    render(<OrderCard order={mockOrder} />, { wrapper });

    expect(screen.getByText("Order #ORD-20261021-0001")).toBeInTheDocument();
    expect(screen.getByText("Spice Garden")).toBeInTheDocument();
    expect(screen.getByText("₹540.00")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("2 items")).toBeInTheDocument();
  });

  it("renders fallback text when restaurant_name is empty or undefined", () => {
    const { rerender } = render(<OrderCard order={{ ...mockOrder, restaurant_name: "" }} />, {
      wrapper,
    });
    expect(screen.getByText("SpotQ Dining Order")).toBeInTheDocument();

    rerender(<OrderCard order={{ ...mockOrder, restaurant_name: undefined }} />);
    expect(screen.getByText("SpotQ Dining Order")).toBeInTheDocument();
  });

  it("handles null or undefined total_amount gracefully without throwing", () => {
    render(<OrderCard order={{ ...mockOrder, total_amount: undefined as unknown as number }} />, {
      wrapper,
    });
    expect(screen.getByText("₹0.00")).toBeInTheDocument();
  });

  it("renders cancelled badge when order status is CANCELLED", () => {
    render(<OrderCard order={{ ...mockOrder, status: "CANCELLED" }} />, { wrapper });

    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("renders preparing badge when order status is PREPARING", () => {
    render(<OrderCard order={{ ...mockOrder, status: "PREPARING" }} />, { wrapper });

    expect(screen.getByText("Preparing")).toBeInTheDocument();
  });

  it("renders singular item count when items_count is 1", () => {
    render(<OrderCard order={{ ...mockOrder, items_count: 1 }} />, { wrapper });

    expect(screen.getByText("1 item")).toBeInTheDocument();
  });

  it("triggers onSelect callback when card is clicked or Enter key is pressed", () => {
    const handleSelect = jest.fn();
    render(<OrderCard order={mockOrder} onSelect={handleSelect} />, { wrapper });

    const card = screen.getByTestId(`order-card-${mockOrder.order_id}`);
    expect(card).toHaveAttribute("role", "button");
    expect(card).not.toHaveClass("select-none");

    fireEvent.click(card);
    expect(handleSelect).toHaveBeenCalledWith(mockOrder);

    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleSelect).toHaveBeenCalledTimes(2);
  });

  it("renders three-dot menu on active order (PLACED) and clicking delete opens modal without triggering card onSelect", () => {
    const handleSelect = jest.fn();
    render(<OrderCard order={{ ...mockOrder, status: "PLACED" }} onSelect={handleSelect} />, {
      wrapper,
    });

    const menuTrigger = screen.getByTestId("cancel-order-menu-trigger");
    expect(menuTrigger).toBeInTheDocument();

    fireEvent.click(menuTrigger);
    expect(handleSelect).not.toHaveBeenCalled();

    const deleteBtn = screen.getByTestId("delete-order-button");
    expect(deleteBtn).toBeInTheDocument();
    expect(deleteBtn).toHaveTextContent(CANCEL_ORDER_MESSAGES.TRIGGER_BUTTON);

    fireEvent.click(deleteBtn);
    expect(handleSelect).not.toHaveBeenCalled();
    expect(screen.getByTestId("cancel-order-modal")).toBeInTheDocument();
  });

  it("does not render three-dot menu for COMPLETED order", () => {
    render(<OrderCard order={{ ...mockOrder, status: "COMPLETED" }} />, { wrapper });

    expect(screen.queryByTestId("cancel-order-menu-trigger")).not.toBeInTheDocument();
  });
});

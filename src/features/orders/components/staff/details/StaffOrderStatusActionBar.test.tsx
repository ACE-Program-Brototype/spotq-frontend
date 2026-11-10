import { fireEvent, render, screen } from "@testing-library/react";
import type { StaffOrderDetail } from "../../../types/staff-orders.types";
import { StaffOrderStatusActionBar } from "./StaffOrderStatusActionBar";

const mockMutate = jest.fn();
let mockIsPending = false;

jest.mock("../../../hooks/use-update-staff-order-status", () => ({
  useUpdateStaffOrderStatus: () => ({
    mutate: mockMutate,
    isPending: mockIsPending,
  }),
}));

describe("StaffOrderStatusActionBar", () => {
  const baseOrder: StaffOrderDetail = {
    id: "ord-test-1",
    orderNumber: "ORD-100",
    orderType: "QUEUE_PRO",
    status: "CONFIRMED",
    createdAt: "2026-11-08T10:00:00.000Z",
    queueId: null,
    tableNumber: null,
    customerNotes: null,
    items: [],
    totalQuantity: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsPending = false;
  });

  it("renders 'Start Cooking' when order status is CONFIRMED", () => {
    render(<StaffOrderStatusActionBar order={baseOrder} restaurantId="rest-1" />);

    const button = screen.getByRole("button", { name: /start cooking/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockMutate).toHaveBeenCalledWith({
      orderId: "ord-test-1",
      status: "PREPARING",
    });
  });

  it("renders 'Start Cooking' when order status is PLACED", () => {
    render(
      <StaffOrderStatusActionBar
        order={{ ...baseOrder, status: "PLACED" }}
        restaurantId="rest-1"
      />,
    );

    const button = screen.getByRole("button", { name: /start cooking/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockMutate).toHaveBeenCalledWith({
      orderId: "ord-test-1",
      status: "PREPARING",
    });
  });

  it("renders 'Food is Ready' when order status is PREPARING", () => {
    render(
      <StaffOrderStatusActionBar
        order={{ ...baseOrder, status: "PREPARING" }}
        restaurantId="rest-1"
      />,
    );

    const button = screen.getByRole("button", { name: /food is ready/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockMutate).toHaveBeenCalledWith({
      orderId: "ord-test-1",
      status: "READY",
    });
  });

  it("renders 'Complete Order' when order status is READY", () => {
    render(
      <StaffOrderStatusActionBar order={{ ...baseOrder, status: "READY" }} restaurantId="rest-1" />,
    );

    const button = screen.getByRole("button", { name: /complete order/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockMutate).toHaveBeenCalledWith({
      orderId: "ord-test-1",
      status: "COMPLETED",
    });
  });

  it("renders 'Order Completed' without action buttons when status is COMPLETED", () => {
    render(
      <StaffOrderStatusActionBar
        order={{ ...baseOrder, status: "COMPLETED" }}
        restaurantId="rest-1"
      />,
    );

    expect(screen.getByText("Order Completed")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("disables button and shows updating indicator when mutation is in flight", () => {
    mockIsPending = true;

    render(<StaffOrderStatusActionBar order={baseOrder} restaurantId="rest-1" />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.getByText("Updating Status...")).toBeInTheDocument();
  });
});

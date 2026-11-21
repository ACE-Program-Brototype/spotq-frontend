import { fireEvent, render, screen } from "@testing-library/react";
import { StaffOrderStatusActionBar } from "@/features/orders/components/staff/details/StaffOrderStatusActionBar";
import {
  STAFF_ORDER_DETAILS_MESSAGES,
  STAFF_ORDER_STATUS,
  STAFF_ORDER_TYPE,
} from "@/features/orders/constants/staff-orders.constants";
import type { StaffOrderDetail } from "@/features/orders/types/staff-orders.types";

const mockMutate = jest.fn();
let mockIsPending = false;

jest.mock("@/features/orders/hooks/use-update-staff-order-status", () => ({
  useUpdateStaffOrderStatus: () => ({
    mutate: mockMutate,
    isPending: mockIsPending,
  }),
}));

describe("StaffOrderStatusActionBar", () => {
  const baseOrder: StaffOrderDetail = {
    id: "ord-test-1",
    orderNumber: "ORD-100",
    orderType: STAFF_ORDER_TYPE.QUEUE_PRO,
    status: STAFF_ORDER_STATUS.CONFIRMED,
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
      status: STAFF_ORDER_STATUS.PREPARING,
    });
  });

  it("renders 'Start Cooking' when order status is PLACED", () => {
    render(
      <StaffOrderStatusActionBar
        order={{ ...baseOrder, status: STAFF_ORDER_STATUS.PLACED }}
        restaurantId="rest-1"
      />,
    );

    const button = screen.getByRole("button", { name: /start cooking/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockMutate).toHaveBeenCalledWith({
      orderId: "ord-test-1",
      status: STAFF_ORDER_STATUS.PREPARING,
    });
  });

  it("renders 'Food is Ready' when order status is PREPARING", () => {
    render(
      <StaffOrderStatusActionBar
        order={{ ...baseOrder, status: STAFF_ORDER_STATUS.PREPARING }}
        restaurantId="rest-1"
      />,
    );

    const button = screen.getByRole("button", { name: /food is ready/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockMutate).toHaveBeenCalledWith({
      orderId: "ord-test-1",
      status: STAFF_ORDER_STATUS.READY,
    });
  });

  it("renders 'Complete Order' when order status is READY", () => {
    render(
      <StaffOrderStatusActionBar
        order={{ ...baseOrder, status: STAFF_ORDER_STATUS.READY }}
        restaurantId="rest-1"
      />,
    );

    const button = screen.getByRole("button", { name: /complete order/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockMutate).toHaveBeenCalledWith({
      orderId: "ord-test-1",
      status: STAFF_ORDER_STATUS.COMPLETED,
    });
  });

  it("renders 'Order Completed' without action buttons when status is COMPLETED", () => {
    render(
      <StaffOrderStatusActionBar
        order={{ ...baseOrder, status: STAFF_ORDER_STATUS.COMPLETED }}
        restaurantId="rest-1"
      />,
    );

    expect(
      screen.getByText(STAFF_ORDER_DETAILS_MESSAGES.ORDER_COMPLETED_TITLE),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("disables button and shows updating indicator when mutation is in flight", () => {
    mockIsPending = true;

    render(<StaffOrderStatusActionBar order={baseOrder} restaurantId="rest-1" />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.getByText(STAFF_ORDER_DETAILS_MESSAGES.UPDATING_STATUS)).toBeInTheDocument();
  });
});

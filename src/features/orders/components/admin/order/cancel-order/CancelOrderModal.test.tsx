import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  CANCEL_ORDER_MESSAGES,
  CANCEL_ORDER_REASON_OPTIONS,
  CANCEL_ORDER_REASONS,
} from "@/features/orders/constants/cancel-order.constants";
import { orderService } from "@/features/orders/services/order.service";
import { CancelOrderModal } from "./CancelOrderModal";

jest.mock("@/features/orders/services/order.service");

describe("CancelOrderModal", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );

  it("renders accessible alertdialog with title, description, and warning", () => {
    render(
      <CancelOrderModal
        open={true}
        onOpenChange={jest.fn()}
        orderId="ord_test_123"
        orderNumber="ORD-999"
      />,
      { wrapper },
    );

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByTestId("cancel-order-modal-title")).toHaveTextContent(
      `${CANCEL_ORDER_MESSAGES.MODAL_TITLE} (#ORD-999)`,
    );
    expect(screen.getByTestId("cancel-order-modal-description")).toHaveTextContent(
      CANCEL_ORDER_MESSAGES.MODAL_DESCRIPTION,
    );
    expect(screen.getByTestId("cancellation-warning-card")).toBeInTheDocument();
  });

  it("focuses on 'Keep My Order' button on mount", async () => {
    render(<CancelOrderModal open={true} onOpenChange={jest.fn()} orderId="ord_test_123" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId("keep-order-button")).toHaveFocus();
    });
  });

  it("calls onOpenChange(false) when 'Keep My Order' or close button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(<CancelOrderModal open={true} onOpenChange={onOpenChange} orderId="ord_test_123" />, {
      wrapper,
    });

    await user.click(screen.getByTestId("keep-order-button"));
    expect(onOpenChange).toHaveBeenCalledWith(false);

    await user.click(screen.getByTestId("close-modal-icon-button"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("disables confirm button until a reason is selected", () => {
    render(<CancelOrderModal open={true} onOpenChange={jest.fn()} orderId="ord_test_123" />, {
      wrapper,
    });

    expect(screen.getByTestId("confirm-cancel-button")).toBeDisabled();
  });

  it("successfully cancels order with selected predefined reason", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const onSuccess = jest.fn();

    (orderService.cancelOrder as jest.Mock).mockResolvedValueOnce({
      order_id: "ord_test_123",
      order_number: "ORD-123",
      status: "CANCELLED",
      cancellation_reason: CANCEL_ORDER_REASON_OPTIONS[0].label,
      cancelled_at: "2026-10-29T22:00:00.000Z",
    });

    render(
      <CancelOrderModal
        open={true}
        onOpenChange={onOpenChange}
        orderId="ord_test_123"
        onSuccess={onSuccess}
      />,
      { wrapper },
    );

    // Select first reason
    await user.click(screen.getByLabelText(CANCEL_ORDER_REASON_OPTIONS[0].label));
    expect(screen.getByTestId("confirm-cancel-button")).not.toBeDisabled();

    // Click cancel button
    await user.click(screen.getByTestId("confirm-cancel-button"));

    await waitFor(() => {
      expect(orderService.cancelOrder).toHaveBeenCalledWith("ord_test_123", {
        cancellation_reason: CANCEL_ORDER_REASON_OPTIONS[0].label,
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("submits custom freeform note when 'OTHER' reason is chosen", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    (orderService.cancelOrder as jest.Mock).mockResolvedValueOnce({
      order_id: "ord_test_123",
      order_number: "ORD-123",
      status: "CANCELLED",
      cancellation_reason: "Emergency came up",
      cancelled_at: "2026-10-29T22:00:00.000Z",
    });

    render(<CancelOrderModal open={true} onOpenChange={onOpenChange} orderId="ord_test_123" />, {
      wrapper,
    });

    // Find and select "Other"
    const otherOption = CANCEL_ORDER_REASON_OPTIONS.find(
      (o) => o.value === CANCEL_ORDER_REASONS.OTHER,
    );
    if (!otherOption) throw new Error("Other option not found");
    await user.click(screen.getByLabelText(otherOption.label));

    // Type note
    const noteInput = screen.getByTestId("cancellation-note-input");
    fireEvent.change(noteInput, { target: { value: "Emergency came up" } });

    // Submit
    await user.click(screen.getByTestId("confirm-cancel-button"));

    await waitFor(() => {
      expect(orderService.cancelOrder).toHaveBeenCalledWith("ord_test_123", {
        cancellation_reason: "Emergency came up",
      });
    });
  });

  it("keeps modal open when cancel order fails", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    const error400 = Object.assign(
      new Error("Order is already in preparation and cannot be cancelled"),
      { status: 400 },
    );
    (orderService.cancelOrder as jest.Mock).mockRejectedValueOnce(error400);

    render(<CancelOrderModal open={true} onOpenChange={onOpenChange} orderId="ord_test_123" />, {
      wrapper,
    });

    await user.click(screen.getByLabelText(CANCEL_ORDER_REASON_OPTIONS[0].label));
    await user.click(screen.getByTestId("confirm-cancel-button"));

    await waitFor(() => {
      expect(orderService.cancelOrder).toHaveBeenCalled();
    });
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });
});

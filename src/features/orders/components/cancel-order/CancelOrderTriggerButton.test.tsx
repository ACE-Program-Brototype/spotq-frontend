import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { CANCEL_ORDER_MESSAGES } from "../../constants/cancel-order.constants";
import { ORDER_STATUS } from "../../constants/orders.constants";
import {
  CancelOrderTriggerButton,
  getDisabledTooltip,
  isOrderCancellable,
} from "./CancelOrderTriggerButton";

jest.mock("../../services/order.service");

describe("CancelOrderTriggerButton", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );

  describe("helper functions", () => {
    it("correctly identifies cancellable statuses", () => {
      expect(isOrderCancellable(ORDER_STATUS.PLACED)).toBe(true);
      expect(isOrderCancellable(ORDER_STATUS.CONFIRMED)).toBe(true);
      expect(isOrderCancellable("placed")).toBe(true);
      expect(isOrderCancellable(ORDER_STATUS.PREPARING)).toBe(false);
      expect(isOrderCancellable(ORDER_STATUS.READY)).toBe(false);
      expect(isOrderCancellable(ORDER_STATUS.COMPLETED)).toBe(false);
      expect(isOrderCancellable(ORDER_STATUS.CANCELLED)).toBe(false);
      expect(isOrderCancellable(undefined)).toBe(false);
    });

    it("returns correct disabled tooltips", () => {
      expect(getDisabledTooltip(ORDER_STATUS.PREPARING)).toBe(
        CANCEL_ORDER_MESSAGES.TRIGGER_TOOLTIP_PREPARING,
      );
      expect(getDisabledTooltip(ORDER_STATUS.COMPLETED)).toBe(
        CANCEL_ORDER_MESSAGES.TRIGGER_TOOLTIP_COMPLETED,
      );
      expect(getDisabledTooltip(ORDER_STATUS.CANCELLED)).toBe(
        CANCEL_ORDER_MESSAGES.TRIGGER_TOOLTIP_CANCELLED,
      );
    });
  });

  describe("three-dot action menu", () => {
    it("renders three-dot button for PLACED order", () => {
      render(
        <CancelOrderTriggerButton orderId="ord-1" orderNumber="101" status={ORDER_STATUS.PLACED} />,
        { wrapper },
      );

      const triggerBtn = screen.getByTestId("cancel-order-menu-trigger");
      expect(triggerBtn).toBeInTheDocument();
      expect(triggerBtn).toHaveAttribute("aria-label", "Order actions for order #101");
    });

    it("opens menu when three-dot button is clicked and shows delete button", async () => {
      const user = userEvent.setup();
      render(
        <CancelOrderTriggerButton orderId="ord-1" orderNumber="101" status={ORDER_STATUS.PLACED} />,
        { wrapper },
      );

      expect(screen.queryByTestId("order-actions-dropdown")).not.toBeInTheDocument();

      const triggerBtn = screen.getByTestId("cancel-order-menu-trigger");
      await user.click(triggerBtn);

      expect(screen.getByTestId("order-actions-dropdown")).toBeInTheDocument();
      const deleteBtn = screen.getByTestId("delete-order-button");
      expect(deleteBtn).toBeInTheDocument();
      expect(deleteBtn).toHaveTextContent(CANCEL_ORDER_MESSAGES.TRIGGER_BUTTON);
    });

    it("opens confirmation modal when delete button inside menu is clicked", async () => {
      const user = userEvent.setup();
      render(
        <CancelOrderTriggerButton orderId="ord-1" orderNumber="101" status={ORDER_STATUS.PLACED} />,
        { wrapper },
      );

      await user.click(screen.getByTestId("cancel-order-menu-trigger"));
      await user.click(screen.getByTestId("delete-order-button"));

      expect(screen.queryByTestId("order-actions-dropdown")).not.toBeInTheDocument();
      expect(screen.getByTestId("cancel-order-modal")).toBeInTheDocument();
    });

    it("closes menu when Escape key is pressed", async () => {
      const user = userEvent.setup();
      render(
        <CancelOrderTriggerButton orderId="ord-1" orderNumber="101" status={ORDER_STATUS.PLACED} />,
        { wrapper },
      );

      await user.click(screen.getByTestId("cancel-order-menu-trigger"));
      expect(screen.getByTestId("order-actions-dropdown")).toBeInTheDocument();

      fireEvent.keyDown(document, { key: "Escape" });
      expect(screen.queryByTestId("order-actions-dropdown")).not.toBeInTheDocument();
    });
  });

  describe("non-cancellable states", () => {
    it("returns null when status is not cancellable and showDisabled is false", () => {
      const { container } = render(
        <CancelOrderTriggerButton
          orderId="ord-3"
          status={ORDER_STATUS.PREPARING}
          showDisabled={false}
        />,
        { wrapper },
      );

      expect(container).toBeEmptyDOMElement();
    });

    it("renders disabled trigger with tooltip when showDisabled is true for non-cancellable status", () => {
      render(
        <CancelOrderTriggerButton
          orderId="ord-4"
          status={ORDER_STATUS.PREPARING}
          showDisabled={true}
        />,
        { wrapper },
      );

      const trigger = screen.getByTestId("cancel-order-menu-trigger");
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute("title", CANCEL_ORDER_MESSAGES.TRIGGER_TOOLTIP_PREPARING);
    });
  });
});

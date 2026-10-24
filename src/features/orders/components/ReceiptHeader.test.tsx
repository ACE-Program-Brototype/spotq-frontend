import { render, screen } from "@testing-library/react";
import { MOCK_ORDER_RECEIPT } from "../mocks/order-receipt.mock";
import { ReceiptHeader } from "./ReceiptHeader";

describe("ReceiptHeader", () => {
  it("renders restaurant name, order number, and status badge", () => {
    render(<ReceiptHeader receipt={MOCK_ORDER_RECEIPT} />);

    expect(screen.getByTestId("receipt-restaurant-name")).toHaveTextContent("Spice Garden Cafe");
    expect(screen.getByTestId("receipt-order-number")).toHaveTextContent("Order #SQ-101");
    expect(screen.getByTestId("receipt-status-badge")).toHaveTextContent("Completed");
    expect(screen.getByTestId("receipt-date")).toBeInTheDocument();
  });

  it("handles unknown status gracefully", () => {
    const customReceipt = {
      ...MOCK_ORDER_RECEIPT,
      status: "CUSTOM_STATUS",
    };

    render(<ReceiptHeader receipt={customReceipt} />);
    expect(screen.getByTestId("receipt-status-badge")).toHaveTextContent("CUSTOM_STATUS");
  });
});

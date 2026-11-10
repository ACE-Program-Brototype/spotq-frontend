import { render, screen } from "@testing-library/react";
import type { OrderReceipt } from "../types/order-receipt.types";
import { ReceiptHeader } from "./ReceiptHeader";

const mockReceipt: OrderReceipt = {
  order_id: "ord_992817203",
  order_number: "SQ-101",
  restaurant: {
    restaurant_id: "rest_65f2a1b9e12345",
    name: "Spice Garden Cafe",
  },
  status: "COMPLETED",
  items: [
    {
      menu_item_id: "item_pizza_01",
      name: "Margherita Pizza",
      variant_id: "var_large_12",
      variant_name: "Large (12 inch)",
      addons: [],
      quantity: 2,
      unit_price: 350.0,
      line_total: 820.0,
      special_instructions: null,
    },
  ],
  sub_total: 820.0,
  tax_amount: 41.0,
  platform_fee: 2.0,
  total_amount: 863.0,
  created_at: "2026-10-06T13:50:00.000Z",
};

describe("ReceiptHeader", () => {
  it("renders restaurant name, order number, and status badge", () => {
    render(<ReceiptHeader receipt={mockReceipt} />);

    expect(screen.getByTestId("receipt-restaurant-name")).toHaveTextContent("Spice Garden Cafe");
    expect(screen.getByTestId("receipt-order-number")).toHaveTextContent("Order #SQ-101");
    expect(screen.getByTestId("receipt-status-badge")).toHaveTextContent("Completed");
    expect(screen.getByTestId("receipt-date")).toBeInTheDocument();
  });

  it("handles unknown status gracefully", () => {
    const customReceipt = {
      ...mockReceipt,
      status: "CUSTOM_STATUS",
    };

    render(<ReceiptHeader receipt={customReceipt} />);
    expect(screen.getByTestId("receipt-status-badge")).toHaveTextContent("CUSTOM_STATUS");
  });
});

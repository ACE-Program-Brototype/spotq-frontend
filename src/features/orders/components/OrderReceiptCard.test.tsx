import { render, screen } from "@testing-library/react";
import type { OrderReceipt } from "../types/order-receipt.types";
import { OrderReceiptCard } from "./OrderReceiptCard";

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
      addons: [{ addon_id: "add_extra_cheese", name: "Extra Cheese", price: 40.0 }],
      quantity: 2,
      unit_price: 350.0,
      line_total: 820.0,
      special_instructions: "Less spicy please",
    },
  ],
  sub_total: 820.0,
  tax_amount: 41.0,
  platform_fee: 2.0,
  total_amount: 863.0,
  created_at: "2026-10-06T13:50:00.000Z",
};

describe("OrderReceiptCard", () => {
  it("renders header, item list, and bill breakdown", () => {
    render(<OrderReceiptCard receipt={mockReceipt} />);

    expect(screen.getByTestId("receipt-header")).toBeInTheDocument();
    expect(screen.getByTestId("receipt-items-container")).toBeInTheDocument();
    expect(screen.getByTestId("receipt-bill-breakdown")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import type { OrderReceipt } from "../types/order-receipt.types";
import { ReceiptBillBreakdown } from "./ReceiptBillBreakdown";

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

describe("ReceiptBillBreakdown", () => {
  it("renders subtotal, tax, platform fee, and total amount accurately", () => {
    render(<ReceiptBillBreakdown receipt={mockReceipt} />);

    expect(screen.getByTestId("receipt-subtotal")).toHaveTextContent("820");
    expect(screen.getByTestId("receipt-tax")).toHaveTextContent("41");
    expect(screen.getByTestId("receipt-platform-fee")).toHaveTextContent("2");
    expect(screen.getByTestId("receipt-total")).toHaveTextContent("863");
    expect(screen.getByText("Taxes & GST")).toBeInTheDocument();
  });

  it("renders dynamic tax percentage when tax_rate is present", () => {
    render(
      <ReceiptBillBreakdown
        receipt={{
          ...mockReceipt,
          tax_rate: 5,
        }}
      />,
    );

    expect(screen.getByText("Taxes & GST (5%)")).toBeInTheDocument();
  });

  it("triggers window.print when download button is clicked", () => {
    const printSpy = jest.spyOn(window, "print").mockImplementation(() => {});

    render(<ReceiptBillBreakdown receipt={mockReceipt} />);

    const downloadButton = screen.getByTestId("receipt-download-button");
    expect(downloadButton).toBeInTheDocument();
    downloadButton.click();

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });
});

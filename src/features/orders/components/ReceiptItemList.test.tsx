import { render, screen } from "@testing-library/react";
import { MOCK_ORDER_RECEIPT } from "../mocks/order-receipt.mock";
import { ReceiptItemList } from "./ReceiptItemList";

describe("ReceiptItemList", () => {
  it("renders all items with customization variants and addons", () => {
    render(<ReceiptItemList items={MOCK_ORDER_RECEIPT.items} />);

    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(screen.getByText("2x")).toBeInTheDocument();
    expect(screen.getByTestId("receipt-item-variant")).toHaveTextContent("Large (12 inch)");
    expect(screen.getByTestId("receipt-item-addons")).toHaveTextContent("Extra Cheese");
    expect(screen.getByTestId("receipt-item-addons")).toHaveTextContent("Jalapenos");
    expect(screen.getByTestId("receipt-item-instructions")).toHaveTextContent("Less spicy please");
    expect(screen.getByTestId("receipt-item-line-total")).toHaveTextContent("820");
  });

  it("handles items without variants, addons, or special instructions", () => {
    const simpleItem = [
      {
        menu_item_id: "item_simple",
        name: "Espresso",
        variant_id: null,
        variant_name: null,
        addons: [],
        quantity: 1,
        unit_price: 120,
        line_total: 120,
        special_instructions: null,
      },
    ];

    render(<ReceiptItemList items={simpleItem} />);

    expect(screen.getByText("Espresso")).toBeInTheDocument();
    expect(screen.queryByTestId("receipt-item-variant")).not.toBeInTheDocument();
    expect(screen.queryByTestId("receipt-item-addons")).not.toBeInTheDocument();
    expect(screen.queryByTestId("receipt-item-instructions")).not.toBeInTheDocument();
  });
});

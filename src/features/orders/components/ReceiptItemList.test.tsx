import { render, screen } from "@testing-library/react";
import type { ReceiptItem } from "../types/order-receipt.types";
import { ReceiptItemList } from "./ReceiptItemList";

const mockReceiptItems: ReceiptItem[] = [
  {
    menu_item_id: "item_pizza_01",
    name: "Margherita Pizza",
    variant_id: "var_large_12",
    variant_name: "Large (12 inch)",
    addons: [
      { addon_id: "add_extra_cheese", name: "Extra Cheese", price: 40.0 },
      { addon_id: "add_jalapenos", name: "Jalapenos", price: 20.0 },
    ],
    quantity: 2,
    unit_price: 350.0,
    line_total: 820.0,
    special_instructions: "Less spicy please",
  },
];

describe("ReceiptItemList", () => {
  it("renders all items with customization variants and addons", () => {
    render(<ReceiptItemList items={mockReceiptItems} />);

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

  it("handles duplicate menu items and variants without key collision issues", () => {
    const duplicateItems = [
      {
        menu_item_id: "item_duplicate",
        name: "Espresso",
        variant_id: "var_1",
        variant_name: "Single",
        addons: [],
        quantity: 1,
        unit_price: 120,
        line_total: 120,
        special_instructions: "Extra hot",
      },
      {
        menu_item_id: "item_duplicate",
        name: "Espresso",
        variant_id: "var_1",
        variant_name: "Single",
        addons: [],
        quantity: 1,
        unit_price: 120,
        line_total: 120,
        special_instructions: "Cold milk on side",
      },
    ];

    render(<ReceiptItemList items={duplicateItems} />);

    const rows = screen.getAllByTestId("receipt-item-row");
    expect(rows).toHaveLength(2);
    expect(screen.getByText("Extra hot")).toBeInTheDocument();
    expect(screen.getByText("Cold milk on side")).toBeInTheDocument();
  });
});

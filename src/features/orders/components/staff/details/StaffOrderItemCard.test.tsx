import { render, screen } from "@testing-library/react";
import type { StaffOrderDetailItem } from "../../../types/staff-orders.types";
import { StaffOrderItemCard } from "./StaffOrderItemCard";

describe("StaffOrderItemCard", () => {
  const mockItemWithAllProps: StaffOrderDetailItem = {
    id: "item-1",
    menuItemId: "menu-item-1",
    name: "Classic Cheeseburger",
    quantity: 3,
    variant: {
      id: "var-1",
      name: "Double Patty",
    },
    addons: [
      { id: "add-1", name: "Extra Cheese" },
      { id: "add-2", name: "Grilled Mushrooms" },
    ],
    specialInstructions: "No onions and extra crispy buns please",
  };

  it("renders quantity badge and item name clearly", () => {
    render(<StaffOrderItemCard item={mockItemWithAllProps} itemNumber={1} />);

    expect(screen.getByText("3×")).toBeInTheDocument();
    expect(screen.getByText("Classic Cheeseburger")).toBeInTheDocument();
  });

  it("renders selected variant tag", () => {
    render(<StaffOrderItemCard item={mockItemWithAllProps} itemNumber={1} />);

    expect(screen.getByText("Double Patty")).toBeInTheDocument();
  });

  it("renders all add-ons and modifiers", () => {
    render(<StaffOrderItemCard item={mockItemWithAllProps} itemNumber={1} />);

    expect(screen.getByText("Extra Cheese")).toBeInTheDocument();
    expect(screen.getByText("Grilled Mushrooms")).toBeInTheDocument();
  });

  it("prominently renders item-specific cooking instructions", () => {
    render(<StaffOrderItemCard item={mockItemWithAllProps} itemNumber={1} />);

    expect(screen.getByText("Kitchen Special Request")).toBeInTheDocument();
    expect(screen.getByText(/No onions and extra crispy buns please/)).toBeInTheDocument();
  });

  it("omits instructions banner when specialInstructions is null", () => {
    const itemWithoutInstructions: StaffOrderDetailItem = {
      ...mockItemWithAllProps,
      specialInstructions: null,
      variant: null,
      addons: [],
    };

    render(<StaffOrderItemCard item={itemWithoutInstructions} itemNumber={2} />);

    expect(screen.queryByText("Kitchen Special Request")).not.toBeInTheDocument();
    expect(screen.queryByText("Variant:")).not.toBeInTheDocument();
  });
});

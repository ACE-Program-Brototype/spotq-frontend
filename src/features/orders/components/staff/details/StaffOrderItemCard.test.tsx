import { render, screen } from "@testing-library/react";
import { StaffOrderItemCard } from "@/features/orders/components/staff/details/StaffOrderItemCard";
import { STAFF_ORDER_DETAILS_MESSAGES } from "@/features/orders/constants/staff-orders.constants";
import type { StaffOrderDetailItem } from "@/features/orders/types/staff-orders.types";

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

    expect(
      screen.getByText(`3${STAFF_ORDER_DETAILS_MESSAGES.QUANTITY_MULTIPLIER}`),
    ).toBeInTheDocument();
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

    expect(
      screen.getByText(STAFF_ORDER_DETAILS_MESSAGES.KITCHEN_SPECIAL_REQUEST_LABEL),
    ).toBeInTheDocument();
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

    expect(
      screen.queryByText(STAFF_ORDER_DETAILS_MESSAGES.KITCHEN_SPECIAL_REQUEST_LABEL),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(STAFF_ORDER_DETAILS_MESSAGES.VARIANT_LABEL)).not.toBeInTheDocument();
  });
});

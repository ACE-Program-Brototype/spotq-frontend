import { fireEvent, render, screen } from "@testing-library/react";
import type { StaffMenuItem } from "../types/staff-menu-item.types";
import { StaffMenuItemTable } from "./StaffMenuItemTable";

describe("StaffMenuItemTable", () => {
  const mockItems: StaffMenuItem[] = [
    {
      id: "item-1",
      name: "Paneer Tikka",
      sku: "PAN-TIK-01",
      description: "Charcoal grilled paneer cubes",
      basePrice: 210,
      categoryId: "cat-1",
      categoryName: "Appetizers",
      displayOrder: 1,
      isActive: true,
      isAvailable: true,
      unavailabilityReason: null,
      autoResetAt: null,
      variantCount: 1,
      hasVariants: true,
      variants: [
        {
          id: "v-1",
          name: "6 Pcs",
          sku: "PAN-6",
          price: 210,
          isDefault: true,
          isAvailable: true,
        },
      ],
      updatedAt: "2026-10-02T10:00:00.000Z",
    },
  ];

  it("renders table with items, categories, price and availability", () => {
    render(<StaffMenuItemTable items={mockItems} />);

    expect(screen.getByText("Paneer Tikka")).toBeInTheDocument();
    expect(screen.getByText("PAN-TIK-01")).toBeInTheDocument();
    expect(screen.getByText("Appetizers")).toBeInTheDocument();
    expect(screen.getAllByText("₹210.00").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("In Stock")).toBeInTheDocument();
    expect(screen.getByText("6 Pcs")).toBeInTheDocument();
  });

  it("renders empty state when items list is empty", () => {
    render(<StaffMenuItemTable items={[]} onResetFilters={jest.fn()} />);

    expect(screen.getByText("No staff menu items found")).toBeInTheDocument();
  });

  it("triggers onToggleAvailability when status badge button is clicked", () => {
    const onToggleMock = jest.fn();
    render(<StaffMenuItemTable items={mockItems} onToggleAvailability={onToggleMock} />);

    const toggleStatusBtn = screen.getByRole("button", {
      name: "Mark Paneer Tikka as out of stock",
    });
    expect(toggleStatusBtn).toBeInTheDocument();

    fireEvent.click(toggleStatusBtn);
    expect(onToggleMock).toHaveBeenCalledWith(mockItems[0]);
  });

  it("triggers onToggleAvailability when actions 86 Item button is clicked", () => {
    const onToggleMock = jest.fn();
    render(<StaffMenuItemTable items={mockItems} onToggleAvailability={onToggleMock} />);

    const actionBtn = screen.getByRole("button", {
      name: "Toggle Paneer Tikka availability",
    });
    expect(actionBtn).toBeInTheDocument();
    expect(screen.getByText("86 Item")).toBeInTheDocument();

    fireEvent.click(actionBtn);
    expect(onToggleMock).toHaveBeenCalledWith(mockItems[0]);
  });

  it("disables buttons when item is currently being toggled", () => {
    const onToggleMock = jest.fn();
    render(
      <StaffMenuItemTable
        items={mockItems}
        onToggleAvailability={onToggleMock}
        togglingItemId="item-1"
      />,
    );

    const toggleStatusBtn = screen.getByRole("button", {
      name: "Mark Paneer Tikka as out of stock",
    });
    const actionBtn = screen.getByRole("button", {
      name: "Toggle Paneer Tikka availability",
    });

    expect(toggleStatusBtn).toBeDisabled();
    expect(actionBtn).toBeDisabled();
  });
});

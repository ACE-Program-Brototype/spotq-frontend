import { render, screen } from "@testing-library/react";
import type { StaffMenuItem } from "../types/staff-menu-item.types";
import { StaffMenuItemCard } from "./StaffMenuItemCard";

describe("StaffMenuItemCard", () => {
  const availableItem: StaffMenuItem = {
    id: "item-1",
    name: "Butter Chicken",
    sku: "BUT-CHK-01",
    description: "Rich creamy butter chicken",
    basePrice: 280,
    categoryId: "cat-1",
    categoryName: "Main Course",
    displayOrder: 1,
    isActive: true,
    isAvailable: true,
    unavailabilityReason: null,
    autoResetAt: null,
    variantCount: 2,
    hasVariants: true,
    variants: [
      {
        id: "v-1",
        name: "Half",
        sku: "BUT-CHK-H",
        price: 280,
        isDefault: true,
        isAvailable: true,
      },
      {
        id: "v-2",
        name: "Full",
        sku: "BUT-CHK-F",
        price: 450,
        isDefault: false,
        isAvailable: true,
      },
    ],
    updatedAt: "2026-10-02T10:00:00.000Z",
  };

  const unavailableItem: StaffMenuItem = {
    id: "item-2",
    name: "Truffle Pasta",
    sku: "TRF-PAS-01",
    description: "Handmade fettuccine",
    basePrice: 350,
    categoryId: "cat-2",
    categoryName: "Italian",
    displayOrder: 2,
    isActive: true,
    isAvailable: false,
    unavailabilityReason: "Out of truffle oil",
    autoResetAt: "2026-10-02T20:00:00.000Z",
    variantCount: 0,
    hasVariants: false,
    variants: [],
    updatedAt: "2026-10-02T10:00:00.000Z",
  };

  it("renders in-stock item with category, price and variants", () => {
    render(<StaffMenuItemCard item={availableItem} />);

    expect(screen.getByText("Butter Chicken")).toBeInTheDocument();
    expect(screen.getByText("Main Course")).toBeInTheDocument();
    expect(screen.getByText("SKU: BUT-CHK-01")).toBeInTheDocument();
    expect(screen.getByText("In Stock")).toBeInTheDocument();
    expect(screen.getAllByText("₹280.00").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Half")).toBeInTheDocument();
    expect(screen.getByText("Full")).toBeInTheDocument();
  });

  it("renders 86'd unavailable item with reason and auto-reset details", () => {
    render(<StaffMenuItemCard item={unavailableItem} />);

    expect(screen.getByText("Truffle Pasta")).toBeInTheDocument();
    expect(screen.getByText("86'd / Out of Stock")).toBeInTheDocument();
    expect(screen.getByText("Reason: Out of truffle oil")).toBeInTheDocument();
    expect(screen.getByText(/Auto-resets:/i)).toBeInTheDocument();
  });
});

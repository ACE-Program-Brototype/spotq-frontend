import { fireEvent, render, screen } from "@testing-library/react";
import type { MenuCategory } from "../types/menu.types";
import { StaffMenuItemFilters } from "./StaffMenuItemFilters";

describe("StaffMenuItemFilters", () => {
  const mockCategories: MenuCategory[] = [
    {
      id: "cat-1",
      restaurantId: "rest-1",
      name: "Starters",
      description: "Crispy appetizers",
      displayOrder: 1,
      isActive: true,
      createdAt: "2026-09-01T00:00:00.000Z",
      updatedAt: "2026-09-01T00:00:00.000Z",
    },
    {
      id: "cat-2",
      restaurantId: "rest-1",
      name: "Mains",
      description: "Main dishes",
      displayOrder: 2,
      isActive: true,
      createdAt: "2026-09-01T00:00:00.000Z",
      updatedAt: "2026-09-01T00:00:00.000Z",
    },
  ];

  const defaultProps = {
    searchQuery: "",
    onSearchChange: jest.fn(),
    categories: mockCategories,
    selectedCategoryId: "ALL",
    onCategoryChange: jest.fn(),
    availabilityFilter: "ALL" as const,
    onAvailabilityChange: jest.fn(),
    sortBy: "createdAt" as const,
    sortOrder: "desc" as const,
    onSortChange: jest.fn(),
    onResetFilters: jest.fn(),
    isFiltered: false,
  };

  it("renders search input, category pills, and availability buttons", () => {
    render(<StaffMenuItemFilters {...defaultProps} />);

    expect(
      screen.getByPlaceholderText(/Search items by name, description, variant or SKU.../i),
    ).toBeInTheDocument();
    expect(screen.getByText("All Categories")).toBeInTheDocument();
    expect(screen.getByText("Starters")).toBeInTheDocument();
    expect(screen.getByText("Mains")).toBeInTheDocument();
    expect(screen.getByText("In Stock")).toBeInTheDocument();
    expect(screen.getByText("86'd Items")).toBeInTheDocument();
  });

  it("triggers category change when a category pill is clicked", () => {
    render(<StaffMenuItemFilters {...defaultProps} />);

    fireEvent.click(screen.getByText("Starters"));
    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith("cat-1");
  });

  it("triggers availability change when availability pill is clicked", () => {
    render(<StaffMenuItemFilters {...defaultProps} />);

    fireEvent.click(screen.getByText("86'd Items"));
    expect(defaultProps.onAvailabilityChange).toHaveBeenCalledWith("UNAVAILABLE");
  });

  it("renders reset button and triggers reset when filtered", () => {
    render(<StaffMenuItemFilters {...defaultProps} isFiltered={true} searchQuery="rice" />);

    const resetBtn = screen.getByRole("button", { name: /Reset/i });
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);
    expect(defaultProps.onResetFilters).toHaveBeenCalled();
  });

  it("triggers onToggleSortOrder when sort direction button is clicked", () => {
    const onToggleSortOrder = jest.fn();
    render(
      <StaffMenuItemFilters
        {...defaultProps}
        sortOrder="asc"
        onToggleSortOrder={onToggleSortOrder}
      />,
    );

    const sortOrderBtn = screen.getByRole("button", { name: /Sort order: Ascending/i });
    expect(sortOrderBtn).toBeInTheDocument();
    fireEvent.click(sortOrderBtn);
    expect(onToggleSortOrder).toHaveBeenCalled();
  });
});

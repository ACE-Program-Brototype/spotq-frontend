import { fireEvent, render, screen } from "@testing-library/react";
import type { CustomerRestaurantMenuItem } from "@/features/restaurants/types/customer-restaurant-details.types";
import { MenuItemCard } from "./MenuItemCard";

jest.mock("@/features/restaurants/hooks/usePresignedUrl", () => ({
  usePresignedUrl: () => ({ data: null, isLoading: false }),
}));

describe("MenuItemCard", () => {
  const mockItem: CustomerRestaurantMenuItem = {
    id: "item-1",
    name: "Butter Chicken",
    description: "Tender chicken cooked in rich buttery tomato gravy.",
    price: 320,
    preparationTime: 25,
    calories: 550,
    isVegetarian: false,
    isFeatured: true,
    isAvailable: true,
    images: [],
    variants: [],
    addons: [],
  };

  it("renders menu item details properly", () => {
    const handleSelect = jest.fn();
    render(<MenuItemCard item={mockItem} onSelect={handleSelect} />);

    expect(screen.getByRole("heading", { name: "Butter Chicken" })).toBeInTheDocument();
    expect(
      screen.getByText("Tender chicken cooked in rich buttery tomato gravy."),
    ).toBeInTheDocument();
    expect(screen.getByText("₹320.00")).toBeInTheDocument();
  });

  it("has an accessible aria-label on the Add to Cart button", () => {
    const handleSelect = jest.fn();
    render(<MenuItemCard item={mockItem} onSelect={handleSelect} />);

    const addButton = screen.getByRole("button", {
      name: "Add Butter Chicken to cart",
    });
    expect(addButton).toBeInTheDocument();
    expect(addButton).not.toBeDisabled();

    fireEvent.click(addButton);
    expect(handleSelect).toHaveBeenCalledWith(mockItem);
  });

  it("renders vegetarian badge when isVegetarian is true", () => {
    const handleSelect = jest.fn();
    const vegItem: CustomerRestaurantMenuItem = {
      ...mockItem,
      id: "item-veg",
      name: "Paneer Tikka",
      isVegetarian: true,
    };

    render(<MenuItemCard item={vegItem} onSelect={handleSelect} />);
    expect(screen.getByText("VEGETARIAN")).toBeInTheDocument();
  });

  it("disables add button and renders Sold Out badge when item is unavailable", () => {
    const handleSelect = jest.fn();
    const soldOutItem: CustomerRestaurantMenuItem = {
      ...mockItem,
      isAvailable: false,
    };

    render(<MenuItemCard item={soldOutItem} onSelect={handleSelect} />);

    expect(screen.getByText("Sold Out")).toBeInTheDocument();
    const addButton = screen.getByRole("button", {
      name: "Add Butter Chicken to cart",
    });
    expect(addButton).toBeDisabled();

    fireEvent.click(addButton);
    expect(handleSelect).not.toHaveBeenCalled();
  });
});

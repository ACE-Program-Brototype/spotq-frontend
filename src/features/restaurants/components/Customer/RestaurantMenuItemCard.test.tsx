import { render, screen } from "@testing-library/react";
import type { CustomerRestaurantMenuItem } from "../../types/customer-restaurant.types";
import { RestaurantMenuItemCard } from "./RestaurantMenuItemCard";

jest.mock("@/hooks/usePresignedUrl", () => ({
  usePresignedUrl: jest.fn(() => ({ data: null })),
}));

const item: CustomerRestaurantMenuItem = {
  id: "item-1",
  name: "Paneer Tikka",
  price: 280,
  isVegetarian: true,
  isFeatured: false,
  isAvailable: false,
  variants: [{ id: "variant-1", name: "Regular", price: 280, isDefault: true, isAvailable: true }],
};

describe("RestaurantMenuItemCard", () => {
  it("shows unavailable items while hiding their customization controls", () => {
    render(<RestaurantMenuItemCard item={item} />);

    expect(screen.getByRole("heading", { name: "Paneer Tikka" })).toBeInTheDocument();
    expect(screen.getByText("Currently unavailable")).toBeInTheDocument();
    expect(screen.queryByText("Choose a size")).not.toBeInTheDocument();
  });
});

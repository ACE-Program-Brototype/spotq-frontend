import { fireEvent, render, screen } from "@testing-library/react";
import { FALLBACK_CUISINE_IMAGES } from "../../constants/customer-restaurant.constants";
import type { CustomerRestaurantItem } from "../../types/customer-restaurant.types";
import { RestaurantCard } from "./RestaurantCard";

const mockRestaurant: CustomerRestaurantItem = {
  id: "res-101",
  restaurantName: "Royal Biryani House",
  city: "Calicut",
  state: "Kerala",
  cuisineType: "Biryani, South Indian",
  averageCost: 500,
  createdAt: "2026-10-10T10:00:00.000Z",
};

describe("RestaurantCard", () => {
  it("renders restaurant information correctly", () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);

    expect(screen.getByText("Royal Biryani House")).toBeInTheDocument();
    expect(screen.getByText("Calicut")).toBeInTheDocument();
    expect(screen.getByText("Biryani")).toBeInTheDocument();
    expect(screen.getByText("500 for two")).toBeInTheDocument();
    expect(screen.getByText("Open Now")).toBeInTheDocument();
    expect(screen.getByText("Live Queue")).toBeInTheDocument();
  });

  it("handles missing averageCost and cuisineType gracefully", () => {
    const minimalRestaurant: CustomerRestaurantItem = {
      id: "res-102",
      restaurantName: "Simple Dhaba",
      city: null,
      state: null,
      cuisineType: null,
      averageCost: null,
      createdAt: "2026-10-10T10:00:00.000Z",
    };

    render(<RestaurantCard restaurant={minimalRestaurant} />);

    expect(screen.getByText("Simple Dhaba")).toBeInTheDocument();
    expect(screen.getByText("Casual Dining")).toBeInTheDocument();
    expect(screen.queryByText("for two")).not.toBeInTheDocument();
  });

  it("falls back to default image when image fails to load", () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);

    const img = screen.getByRole("img", { name: "Royal Biryani House" }) as HTMLImageElement;
    fireEvent.error(img);

    expect(img.src).toBe(FALLBACK_CUISINE_IMAGES.default);
  });

  it("does not render any links or triggers to detail page", () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);

    expect(screen.queryByText(/View Details/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

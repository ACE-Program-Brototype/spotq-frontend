import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type { CustomerRestaurantItem } from "../../types/customer-restaurant.types";
import { RestaurantCard } from "./RestaurantCard";

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

const mockRestaurant: CustomerRestaurantItem = {
  id: "res-101",
  restaurantName: "Royal Biryani House",
  city: "Calicut",
  state: "Kerala",
  cuisineType: "Biryani, South Indian",
  averageCost: 500,
  isOpen: true,
  createdAt: "2026-10-10T10:00:00.000Z",
};

jest.mock("../../hooks/usePresignedUrl", () => ({
  usePresignedUrl: jest.fn((key?: string | null) => ({
    data: key ?? null,
    isLoading: false,
    isError: false,
  })),
}));

describe("RestaurantCard", () => {
  it("renders restaurant information correctly", () => {
    renderWithProviders(<RestaurantCard restaurant={mockRestaurant} />);

    expect(screen.getByRole("heading", { name: "Royal Biryani House" })).toBeInTheDocument();
    expect(screen.getByText(/Calicut/)).toBeInTheDocument();
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

    renderWithProviders(<RestaurantCard restaurant={minimalRestaurant} />);

    expect(screen.getByRole("heading", { name: "Simple Dhaba" })).toBeInTheDocument();
    expect(screen.getByText("Casual Dining")).toBeInTheDocument();
    expect(screen.queryByText("for two")).not.toBeInTheDocument();
  });

  it("renders cover image when provided and displays fallback placeholder on error", () => {
    const restaurantWithImage: CustomerRestaurantItem = {
      ...mockRestaurant,
      coverImage: "https://example.com/restaurant-cover.jpg",
    };

    renderWithProviders(<RestaurantCard restaurant={restaurantWithImage} />);

    const img = screen.getByRole("img", { name: "Royal Biryani House" }) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe("https://example.com/restaurant-cover.jpg");

    fireEvent.error(img);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Royal Biryani House" })).toBeInTheDocument();
  });

  it("renders Closed badge when restaurant is closed", () => {
    const closedRestaurant: CustomerRestaurantItem = {
      ...mockRestaurant,
      isOpen: false,
    };

    renderWithProviders(<RestaurantCard restaurant={closedRestaurant} />);

    expect(screen.getByText("Closed")).toBeInTheDocument();
    expect(screen.queryByText("Open Now")).not.toBeInTheDocument();
  });

  it("renders Status unavailable and does not assume open when status is missing", () => {
    const missingStatusRestaurant: CustomerRestaurantItem = {
      ...mockRestaurant,
      isOpen: undefined,
      isOpened: undefined,
    };

    renderWithProviders(<RestaurantCard restaurant={missingStatusRestaurant} />);

    expect(screen.getByText("Status unavailable")).toBeInTheDocument();
    expect(screen.queryByText("Open Now")).not.toBeInTheDocument();
    expect(screen.queryByText("Closed")).not.toBeInTheDocument();
  });

  it("renders open status using isOpened fallback when isOpen is undefined", () => {
    const isOpenedRestaurant: CustomerRestaurantItem = {
      ...mockRestaurant,
      isOpen: undefined,
      isOpened: true,
    };

    renderWithProviders(<RestaurantCard restaurant={isOpenedRestaurant} />);

    expect(screen.getByText("Open Now")).toBeInTheDocument();
  });

  it("renders Queue Paused when acceptsQueue is false", () => {
    const noQueueRestaurant: CustomerRestaurantItem = {
      ...mockRestaurant,
      acceptsQueue: false,
    };

    renderWithProviders(<RestaurantCard restaurant={noQueueRestaurant} />);

    expect(screen.getByText("Queue Paused")).toBeInTheDocument();
    expect(screen.queryByText("Live Queue")).not.toBeInTheDocument();
  });

  it("does not render any links or triggers to detail page", () => {
    renderWithProviders(<RestaurantCard restaurant={mockRestaurant} />);

    expect(screen.queryByText(/View Details/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

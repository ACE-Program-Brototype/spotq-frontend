import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { customerRestaurantService } from "../services/customer-restaurant.service";
import { HomePage } from "./HomePage";

jest.mock("../services/customer-restaurant.service", () => ({
  customerRestaurantService: {
    getRestaurants: jest.fn(),
  },
}));

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  );
}

describe("HomePage (Customer Restaurant Discovery)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders live restaurant data returned from the service", async () => {
    (customerRestaurantService.getRestaurants as jest.Mock).mockResolvedValue({
      restaurants: [
        {
          id: "rest-1",
          restaurantName: "Malabar Heritage Bistro",
          city: "Kozhikode",
          state: "Kerala",
          cuisineType: "South Indian, Biryani",
          averageCost: 450,
          createdAt: "2026-10-10T12:00:00.000Z",
        },
      ],
      pagination: {
        page: 1,
        limit: 8,
        total: 1,
        totalPages: 1,
      },
    });

    renderWithClient(<HomePage />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Malabar Heritage Bistro" })).toBeInTheDocument();
    });

    expect(screen.getByText("Kozhikode")).toBeInTheDocument();
    expect(screen.getByText(/450 for two/)).toBeInTheDocument();
    expect(screen.getAllByText("South Indian").length).toBeGreaterThan(0);
  });

  it("renders empty state when no restaurants are found", async () => {
    (customerRestaurantService.getRestaurants as jest.Mock).mockResolvedValue({
      restaurants: [],
      pagination: {
        page: 1,
        limit: 8,
        total: 0,
        totalPages: 0,
      },
    });

    renderWithClient(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId("restaurant-empty-state")).toBeInTheDocument();
    });

    expect(screen.getByText("No restaurants found")).toBeInTheDocument();
  });

  it("renders error alert with retry button when query fails", async () => {
    (customerRestaurantService.getRestaurants as jest.Mock).mockRejectedValue(
      new Error("Gateway Timeout"),
    );

    renderWithClient(<HomePage />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(screen.getByText("Failed to load restaurants")).toBeInTheDocument();
    expect(screen.getByText("Gateway Timeout")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Try Again/i })).toBeInTheDocument();
  });

  it("filters by category pill when clicked", async () => {
    (customerRestaurantService.getRestaurants as jest.Mock).mockResolvedValue({
      restaurants: [],
      pagination: { page: 1, limit: 8, total: 0, totalPages: 0 },
    });

    const user = userEvent.setup();
    renderWithClient(<HomePage />);

    const mandiPill = screen.getByRole("button", { name: "Mandi" });
    await user.click(mandiPill);

    await waitFor(() => {
      expect(customerRestaurantService.getRestaurants).toHaveBeenCalledWith(
        expect.objectContaining({
          cuisine: "Mandi",
        }),
      );
    });
  });

  it("renders pagination area when restaurants exist and displays page entries", async () => {
    (customerRestaurantService.getRestaurants as jest.Mock).mockResolvedValue({
      restaurants: [
        {
          id: "rest-1",
          restaurantName: "Malabar Heritage Bistro",
          city: "Kozhikode",
          state: "Kerala",
          cuisineType: "South Indian",
          averageCost: 450,
          createdAt: "2026-10-10T12:00:00.000Z",
        },
      ],
      pagination: {
        page: 1,
        limit: 8,
        total: 1,
        totalPages: 1,
      },
    });

    renderWithClient(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId("restaurant-pagination")).toBeInTheDocument();
    });

    expect(screen.getByText(/Showing 1 to 1 of 1 entries/i)).toBeInTheDocument();
  });

  it("applies search, city, and cuisine filters simultaneously", async () => {
    (customerRestaurantService.getRestaurants as jest.Mock).mockResolvedValue({
      restaurants: [],
      pagination: { page: 1, limit: 8, total: 0, totalPages: 0 },
    });

    const user = userEvent.setup();
    renderWithClient(<HomePage />);

    // Select cuisine pill
    const mandiPill = screen.getByRole("button", { name: "Mandi" });
    await user.click(mandiPill);

    // Type search text
    const searchInput = screen.getByPlaceholderText("Search restaurants or dishes...");
    await user.type(searchInput, "Chicken");

    // Type city text
    const cityInput = screen.getByPlaceholderText("Filter by city...");
    await user.type(cityInput, "Kozhikode");

    await waitFor(
      () => {
        expect(customerRestaurantService.getRestaurants).toHaveBeenCalledWith(
          expect.objectContaining({
            cuisine: "Mandi",
            search: "Chicken",
            city: "Kozhikode",
          }),
        );
      },
      { timeout: 2000 },
    );
  });

  it("does not render fake demo login buttons in guest session banner", async () => {
    (customerRestaurantService.getRestaurants as jest.Mock).mockResolvedValue({
      restaurants: [],
      pagination: { page: 1, limit: 8, total: 0, totalPages: 0 },
    });

    renderWithClient(<HomePage />);

    expect(screen.queryByRole("button", { name: /Demo Login/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign In/i })).toBeInTheDocument();
  });
});

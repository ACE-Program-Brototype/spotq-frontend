import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { restaurantService } from "../services/restaurant.service";
import { AdminRestaurantsPage } from "./AdminRestaurantsPage";

jest.mock("../services/restaurant.service", () => ({
  restaurantService: {
    getAdminRestaurants: jest.fn(),
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

describe("AdminRestaurantsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeleton and then table with restaurant data", async () => {
    (restaurantService.getAdminRestaurants as jest.Mock).mockResolvedValue({
      restaurants: [
        {
          id: "rest-1",
          restaurant_name: "Ajex Grand Bistro",
          owner_name: "Ajex Joshy",
          contact: {
            email: "ajex@example.com",
            phone: "+919876543210",
            owner_email: "ajex@example.com",
          },
          plan: "QUEUE_PRO",
          status: "APPROVED",
          is_subscription_active: true,
          is_blocked: false,
          created_at: "2026-09-10T12:00:00.000Z",
          updated_at: "2026-09-11T14:30:00.000Z",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
        has_next_page: false,
        has_prev_page: false,
      },
    });

    renderWithClient(<AdminRestaurantsPage />);

    expect(screen.getByRole("heading", { name: /restaurant management/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Ajex Grand Bistro")).toBeInTheDocument();
    });

    expect(screen.getByText("Ajex Joshy")).toBeInTheDocument();
    expect(screen.getByText("Queue Pro")).toBeInTheDocument();
  });

  it("renders empty state when no restaurants are returned", async () => {
    (restaurantService.getAdminRestaurants as jest.Mock).mockResolvedValue({
      restaurants: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        total_pages: 0,
        has_next_page: false,
        has_prev_page: false,
      },
    });

    renderWithClient(<AdminRestaurantsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("restaurant-empty-state")).toBeInTheDocument();
    });
  });

  it("renders error state when API fails", async () => {
    (restaurantService.getAdminRestaurants as jest.Mock).mockRejectedValue(
      new Error("Network Error"),
    );

    renderWithClient(<AdminRestaurantsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("restaurant-error-state")).toBeInTheDocument();
    });
    expect(screen.getByText(/failed to load restaurants/i)).toBeInTheDocument();
  });
});

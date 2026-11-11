import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useRestaurantAnalyticsContext } from "../layouts/RestaurantAnalyticsLayout";
import {
  mockAnalyticsDashboardData,
  mockDegradedAnalyticsData,
} from "../mocks/restaurant-analytics.mock";
import RestaurantMenuPerformancePage from "../pages/RestaurantMenuPerformancePage";

jest.mock("../layouts/RestaurantAnalyticsLayout", () => ({
  ...jest.requireActual("../layouts/RestaurantAnalyticsLayout"),
  useRestaurantAnalyticsContext: jest.fn(),
}));

describe("RestaurantMenuPerformancePage", () => {
  const mockRefetch = jest.fn();
  const mockSetPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders catalog summary, top-selling table, and slow-moving diagnostics with rule", () => {
    (useRestaurantAnalyticsContext as jest.Mock).mockReturnValue({
      data: mockAnalyticsDashboardData,
      refetch: mockRefetch,
      isLoading: false,
      isFetching: false,
      isError: false,
      filters: { setPage: mockSetPage },
    });

    render(
      <MemoryRouter>
        <RestaurantMenuPerformancePage />
      </MemoryRouter>,
    );

    // Catalog Context
    expect(screen.getByText("Menu Catalog Analytics")).toBeInTheDocument();
    expect(screen.getByText("36")).toBeInTheDocument();

    // Top Selling Items
    expect(screen.getByText("Top-Selling Menu Items")).toBeInTheDocument();
    expect(screen.getByText("Butter Chicken")).toBeInTheDocument();
    expect(screen.getByText("Garlic Naan")).toBeInTheDocument();

    // Slow Moving Rule & Diagnostics
    expect(screen.getByText("Slow-Moving Classification Rule")).toBeInTheDocument();
    expect(screen.getByText("Slow-Moving Menu Items")).toBeInTheDocument();
    expect(screen.getByText("Truffle Pasta")).toBeInTheDocument();
    expect(screen.getByText("Dragon Fruit Cooler")).toBeInTheDocument();
    expect(screen.getAllByText("Zero Sales").length).toBeGreaterThanOrEqual(1);
  });

  it("triggers setPage when interacting with table pagination", () => {
    (useRestaurantAnalyticsContext as jest.Mock).mockReturnValue({
      data: mockAnalyticsDashboardData,
      refetch: mockRefetch,
      isLoading: false,
      isFetching: false,
      isError: false,
      filters: { setPage: mockSetPage },
    });

    render(
      <MemoryRouter>
        <RestaurantMenuPerformancePage />
      </MemoryRouter>,
    );

    const nextButtons = screen.getAllByText("Next");
    fireEvent.click(nextButtons[0]);

    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("displays fallback card when products section is unavailable", () => {
    (useRestaurantAnalyticsContext as jest.Mock).mockReturnValue({
      data: mockDegradedAnalyticsData,
      refetch: mockRefetch,
      isLoading: false,
      isFetching: false,
      isError: false,
      filters: { setPage: mockSetPage },
    });

    render(
      <MemoryRouter>
        <RestaurantMenuPerformancePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Menu Analytics Unavailable")).toBeInTheDocument();
  });
});

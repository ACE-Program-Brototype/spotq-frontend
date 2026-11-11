import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  mockAnalyticsDashboardData,
  mockDegradedAnalyticsData,
} from "@/features/analytics/fixtures/restaurant-analytics.fixture";
import { useRestaurantAnalyticsContext } from "@/features/analytics/layouts/RestaurantAnalyticsLayout";
import RestaurantAnalyticsOverviewPage from "@/features/analytics/pages/RestaurantAnalyticsOverviewPage";

jest.mock("@/features/analytics/layouts/RestaurantAnalyticsLayout", () => ({
  ...jest.requireActual("@/features/analytics/layouts/RestaurantAnalyticsLayout"),
  useRestaurantAnalyticsContext: jest.fn(),
}));

describe("RestaurantAnalyticsOverviewPage", () => {
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 4 overview KPI cards and channel breakdown with mock data", () => {
    (useRestaurantAnalyticsContext as jest.Mock).mockReturnValue({
      data: mockAnalyticsDashboardData,
      refetch: mockRefetch,
      isLoading: false,
      isFetching: false,
      isError: false,
      filters: {},
    });

    render(
      <MemoryRouter>
        <RestaurantAnalyticsOverviewPage />
      </MemoryRouter>,
    );

    // KPI Cards
    expect(screen.getByText("Net Revenue")).toBeInTheDocument();
    expect(screen.getByText(/₹1,84,500/)).toBeInTheDocument();
    expect(screen.getByText("Total Orders")).toBeInTheDocument();
    expect(screen.getByText("450")).toBeInTheDocument();
    expect(screen.getByText("Avg. Order Value")).toBeInTheDocument();
    expect(screen.getByText("Unique Customers")).toBeInTheDocument();
    expect(screen.getByText("380")).toBeInTheDocument();

    // Channel Distribution
    expect(screen.getByText("Dining Channels")).toBeInTheDocument();
    expect(screen.getByText("Dine-In")).toBeInTheDocument();
    expect(screen.getByText("Takeaway")).toBeInTheDocument();

    // Order Fulfillment
    expect(screen.getByText("Order Fulfillment")).toBeInTheDocument();
    expect(screen.getByText("Completed Orders")).toBeInTheDocument();
  });

  it("renders graceful degradation cards when downstream microservices are unavailable", () => {
    (useRestaurantAnalyticsContext as jest.Mock).mockReturnValue({
      data: mockDegradedAnalyticsData,
      refetch: mockRefetch,
      isLoading: false,
      isFetching: false,
      isError: false,
      filters: {},
    });

    render(
      <MemoryRouter>
        <RestaurantAnalyticsOverviewPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Revenue Unavailable")).toBeInTheDocument();
    expect(screen.getByText("Orders Unavailable")).toBeInTheDocument();
    expect(screen.getByText("Operations Unavailable")).toBeInTheDocument();
  });
});

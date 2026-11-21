import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  mockAnalyticsDashboardData,
  mockDegradedAnalyticsData,
} from "@/features/analytics/__tests__/fixtures/restaurant-analytics.fixture";
import { useRestaurantAnalyticsContext } from "@/features/analytics/layouts/RestaurantAnalyticsLayout";
import RestaurantRevenueAnalyticsPage from "@/features/analytics/pages/RestaurantRevenueAnalyticsPage";

jest.mock("@/features/analytics/layouts/RestaurantAnalyticsLayout", () => ({
  ...jest.requireActual("@/features/analytics/layouts/RestaurantAnalyticsLayout"),
  useRestaurantAnalyticsContext: jest.fn(),
}));

describe("RestaurantRevenueAnalyticsPage", () => {
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders revenue KPIs and financial realization bridge", () => {
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
        <RestaurantRevenueAnalyticsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Net Sales")).toBeInTheDocument();
    expect(screen.getAllByText(/₹1,84,500/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Gross Total Bill").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/₹2,00,000/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Discounts Given")).toBeInTheDocument();
    expect(screen.getAllByText(/₹15,500/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Revenue Growth")).toBeInTheDocument();

    expect(screen.getByText("Revenue Realization")).toBeInTheDocument();
    expect(screen.getByText("Discounts Absorbed")).toBeInTheDocument();
    expect(screen.getByText("Net Revenue Received")).toBeInTheDocument();
  });

  it("handles unavailable revenue gracefully", () => {
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
        <RestaurantRevenueAnalyticsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Revenue Unavailable")).toBeInTheDocument();
    expect(screen.queryByText("Revenue Realization")).not.toBeInTheDocument();
  });
});

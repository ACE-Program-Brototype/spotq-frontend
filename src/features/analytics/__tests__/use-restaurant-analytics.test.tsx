import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { restaurantAnalyticsApi } from "../api/restaurant-analytics.api";
import { useRestaurantAnalytics } from "../hooks/use-restaurant-analytics";
import { mockAnalyticsDashboardData } from "../mocks/restaurant-analytics.mock";

jest.mock("../api/restaurant-analytics.api", () => ({
  restaurantAnalyticsApi: {
    getDashboard: jest.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useRestaurantAnalytics", () => {
  const restaurantId = "3dc35af0-3ff5-4ee9-a60a-fbb47124731b";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not fetch if restaurantId is empty", () => {
    const { result } = renderHook(() => useRestaurantAnalytics(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(restaurantAnalyticsApi.getDashboard).not.toHaveBeenCalled();
  });

  it("fetches analytics dashboard data successfully", async () => {
    (restaurantAnalyticsApi.getDashboard as jest.Mock).mockResolvedValue(
      mockAnalyticsDashboardData,
    );

    const { result } = renderHook(
      () => useRestaurantAnalytics(restaurantId, { interval: "MONTH" }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockAnalyticsDashboardData);
    expect(restaurantAnalyticsApi.getDashboard).toHaveBeenCalledWith(restaurantId, {
      interval: "MONTH",
    });
  });
});

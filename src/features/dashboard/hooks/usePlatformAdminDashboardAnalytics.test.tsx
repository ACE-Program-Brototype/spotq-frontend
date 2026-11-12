import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { platformAnalyticsService } from "../services/platform-analytics.service";
import type { PlatformDashboardAnalyticsResponse } from "../types/platform-analytics.types";
import { usePlatformAdminDashboardAnalytics } from "./usePlatformAdminDashboardAnalytics";

jest.mock("../services/platform-analytics.service", () => ({
  platformAnalyticsService: {
    getDashboardAnalytics: jest.fn(),
  },
}));

describe("usePlatformAdminDashboardAnalytics", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockData: PlatformDashboardAnalyticsResponse = {
    overview: {
      totalRestaurants: 50,
      activeSubscribedRestaurants: 40,
      subscriptionTierDistribution: { QUEUE_PRO: 40 },
    },
    customerGrowth: { status: "AVAILABLE", totalRegisteredCustomers: 1000 },
    revenue: { status: "AVAILABLE", currentMrrRupees: 100000 },
    growth: { onboardingFunnel: [], onboardingTrend: [] },
    filters: { period: "MONTH", day: null, month: 11, year: 2026, billingCycle: "ALL" },
    generatedAt: "2026-11-10T12:00:00Z",
  };

  it("fetches dashboard analytics successfully", async () => {
    (platformAnalyticsService.getDashboardAnalytics as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(
      () =>
        usePlatformAdminDashboardAnalytics({
          period: "MONTH",
          month: 11,
          year: 2026,
          billingCycle: "ALL",
        }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(platformAnalyticsService.getDashboardAnalytics).toHaveBeenCalledWith({
      period: "MONTH",
      month: 11,
      year: 2026,
      billingCycle: "ALL",
    });
  });
});

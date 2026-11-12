import { apiClient } from "@/lib/api/client";
import { PLATFORM_ANALYTICS_ENDPOINTS } from "../constants/platform-analytics.constants";
import { platformAnalyticsService } from "./platform-analytics.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("platformAnalyticsService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockDashboardData = {
    overview: {
      totalRestaurants: 142,
      activeSubscribedRestaurants: 118,
      subscriptionTierDistribution: {
        QUEUE_PRO: 86,
        ENTERPRISE: 32,
      },
    },
    customerGrowth: {
      status: "AVAILABLE" as const,
      totalRegisteredCustomers: 12500,
      newCustomersInPeriod: 48,
    },
    revenue: {
      status: "AVAILABLE" as const,
      grossSubscriptionRevenueRupees: 1820000,
      currentMrrRupees: 245000,
      currentArrRupees: 2940000,
      growthPercentage: 14.2,
      timeline: [
        {
          bucketLabel: "Nov 2026",
          grossRevenueRupees: 245000,
          mrrRupees: 245000,
          newSubscriptionsCount: 12,
        },
      ],
    },
    growth: {
      onboardingFunnel: [
        { stage: "REGISTERED", count: 180, label: "Email Verified / Logged In" },
        { stage: "APPROVED", count: 142, label: "Verified by Admin & Live" },
      ],
      onboardingTrend: [{ period: "2026-11", count: 24 }],
    },
    filters: {
      period: "MONTH" as const,
      day: null,
      month: 11,
      year: 2026,
      billingCycle: "ALL" as const,
    },
    generatedAt: "2026-11-10T12:00:00.000Z",
  };

  it("fetches dashboard analytics with correct search params", async () => {
    const mockJson = jest.fn().mockResolvedValue({
      success: true,
      message: "Platform dashboard analytics fetched successfully",
      data: mockDashboardData,
    });
    (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

    const result = await platformAnalyticsService.getDashboardAnalytics({
      period: "MONTH",
      month: 11,
      year: 2026,
      billingCycle: "ALL",
    });

    expect(apiClient.get).toHaveBeenCalledWith(PLATFORM_ANALYTICS_ENDPOINTS.DASHBOARD, {
      searchParams: {
        period: "MONTH",
        billingCycle: "ALL",
        month: 11,
        year: 2026,
      },
    });
    expect(result).toEqual(mockDashboardData);
  });

  it("throws error when response indicates failure", async () => {
    const mockJson = jest.fn().mockResolvedValue({
      success: false,
      message: "Database connection failed",
    });
    (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

    await expect(
      platformAnalyticsService.getDashboardAnalytics({
        period: "YEAR",
        year: 2026,
        billingCycle: "MONTHLY",
      }),
    ).rejects.toThrow("Database connection failed");
  });
});

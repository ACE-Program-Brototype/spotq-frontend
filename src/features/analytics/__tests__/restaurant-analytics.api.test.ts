import { apiClient } from "@/lib/api/client";
import { restaurantAnalyticsApi } from "../api/restaurant-analytics.api";
import { mockAnalyticsDashboardData } from "../mocks/restaurant-analytics.mock";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("restaurantAnalyticsApi", () => {
  const restaurantId = "3dc35af0-3ff5-4ee9-a60a-fbb47124731b";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws error when restaurantId is missing or empty", async () => {
    await expect(restaurantAnalyticsApi.getDashboard("")).rejects.toThrow(
      "Restaurant ID is required to fetch analytics dashboard",
    );
    await expect(restaurantAnalyticsApi.getDashboard("   ")).rejects.toThrow(
      "Restaurant ID is required to fetch analytics dashboard",
    );
  });

  it("fetches dashboard analytics without params and returns data", async () => {
    const mockJson = jest.fn().mockResolvedValue({
      success: true,
      data: mockAnalyticsDashboardData,
    });
    (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

    const result = await restaurantAnalyticsApi.getDashboard(restaurantId);

    expect(apiClient.get).toHaveBeenCalledWith(
      `api/v1/restaurants/${restaurantId}/analytics/dashboard`,
      { searchParams: {} },
    );
    expect(result).toEqual(mockAnalyticsDashboardData);
  });

  it("properly serializes strict query parameters", async () => {
    const mockJson = jest.fn().mockResolvedValue({
      success: true,
      data: mockAnalyticsDashboardData,
    });
    (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

    await restaurantAnalyticsApi.getDashboard(restaurantId, {
      interval: "DAY",
      day: 10,
      month: 11,
      year: 2026,
      status: "COMPLETED",
      page: 2,
      limit: 15,
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      `api/v1/restaurants/${restaurantId}/analytics/dashboard`,
      {
        searchParams: {
          interval: "DAY",
          day: 10,
          month: 11,
          year: 2026,
          status: "COMPLETED",
          page: 2,
          limit: 15,
        },
      },
    );
  });

  it("omits status param when set to ALL", async () => {
    const mockJson = jest.fn().mockResolvedValue({
      success: true,
      data: mockAnalyticsDashboardData,
    });
    (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

    await restaurantAnalyticsApi.getDashboard(restaurantId, {
      interval: "MONTH",
      status: "ALL",
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      `api/v1/restaurants/${restaurantId}/analytics/dashboard`,
      {
        searchParams: {
          interval: "MONTH",
        },
      },
    );
  });
});

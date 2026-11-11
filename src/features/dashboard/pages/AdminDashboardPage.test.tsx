import { fireEvent, render, screen } from "@testing-library/react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { usePlatformAdminDashboardAnalytics } from "../hooks/usePlatformAdminDashboardAnalytics";
import type { PlatformDashboardAnalyticsResponse } from "../types/platform-analytics.types";
import AdminDashboardPage from "./AdminDashboardPage";

jest.mock("../hooks/usePlatformAdminDashboardAnalytics");

const mockAnalyticsData: PlatformDashboardAnalyticsResponse = {
  overview: {
    totalRestaurants: 142,
    activeSubscribedRestaurants: 118,
    subscriptionTierDistribution: {
      QUEUE_PRO: 86,
      ENTERPRISE: 32,
    },
  },
  customerGrowth: {
    status: "AVAILABLE",
    totalRegisteredCustomers: 12500,
    newCustomersInPeriod: 48,
  },
  revenue: {
    status: "AVAILABLE",
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
    geographicBreakdown: [
      { city: "Bangalore", state: "Karnataka", restaurantCount: 65 },
      { city: "Kochi", state: "Kerala", restaurantCount: 42 },
    ],
  },
  filters: {
    period: "MONTH",
    day: null,
    month: 11,
    year: 2026,
    billingCycle: "ALL",
  },
  generatedAt: "2026-11-10T12:00:00.000Z",
};

describe("AdminDashboardPage", () => {
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().setUser({
      _id: "admin-1",
      name: "Admin User",
      email: "admin@spotq.com",
      created_at: "2026-08-18T21:59:52.665Z",
    });

    (usePlatformAdminDashboardAnalytics as jest.Mock).mockReturnValue({
      data: mockAnalyticsData,
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      refetch: mockRefetch,
    });
  });

  it("renders page header, filters, and all three analytics sections", () => {
    render(<AdminDashboardPage />);

    expect(
      screen.getByRole("heading", { name: /Platform Analytics & Executive Dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Superadmin", { selector: "span" })).toBeInTheDocument();
    expect(screen.getByText(/Export reports/i)).toBeInTheDocument();

    // 3 section titles
    expect(screen.getByText("Executive Overview")).toBeInTheDocument();
    expect(screen.getByText("Subscription & Revenue Analytics")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Restaurant Growth & Customer Acquisition/i }),
    ).toBeInTheDocument();

    // Prominent New Users Count in Customer Growth card
    expect(screen.getByText("New Customer Registrations")).toBeInTheDocument();
    expect(screen.getByText("New Users Registered")).toBeInTheDocument();
    expect(screen.getAllByText("48").length).toBeGreaterThan(0);
  });

  it("renders all 4 executive KPI cards with formatted values and service badges", () => {
    render(<AdminDashboardPage />);

    expect(screen.getByText("Total Restaurants")).toBeInTheDocument();
    expect(screen.getAllByText("142").length).toBeGreaterThan(0);
    expect(screen.getByText("Subscribed Restaurants")).toBeInTheDocument();
    expect(screen.getAllByText("118").length).toBeGreaterThan(0);
    expect(screen.getByText("Registered Customers")).toBeInTheDocument();
    expect(screen.getAllByText("12,500").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Current MRR").length).toBeGreaterThan(0);

    // Currency INR format check
    expect(screen.getAllByText(/₹\s*2,45,000/).length).toBeGreaterThan(0);

    // Microservice attribution badges
    expect(screen.getAllByText("restaurant-svc").length).toBeGreaterThan(0);
    expect(screen.getAllByText("payment-svc").length).toBeGreaterThan(0);
    expect(screen.getAllByText("user-service").length).toBeGreaterThan(0);
  });

  it("handles circuit breaker fallback when revenue service is UNAVAILABLE", () => {
    (usePlatformAdminDashboardAnalytics as jest.Mock).mockReturnValue({
      data: {
        ...mockAnalyticsData,
        revenue: {
          status: "UNAVAILABLE",
          error: {
            code: "PAYMENT_SERVICE_UNAVAILABLE",
            message: "Subscription revenue metrics unavailable",
          },
        },
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      refetch: mockRefetch,
    });

    render(<AdminDashboardPage />);

    // Fallback banner rendered inside revenue section
    expect(screen.getByText("Subscription Revenue Metrics Unavailable")).toBeInTheDocument();
    expect(screen.getByText("Subscription revenue metrics unavailable")).toBeInTheDocument();

    // Subscribed Restaurants & Current MRR display dash fallback instead of false zero
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThan(0);

    // Other services (Total Restaurants, Customer Growth) remain fully available
    expect(screen.getAllByText("142").length).toBeGreaterThan(0);
    expect(screen.getAllByText("12,500").length).toBeGreaterThan(0);
  });

  it("opens and closes the export reports modal without leaving dashboard", () => {
    render(<AdminDashboardPage />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const exportBtn = screen.getByRole("button", { name: /Export reports/i });
    fireEvent.click(exportBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Export Analytics Reports")).toBeInTheDocument();
    expect(screen.getByText(/Platform Finance & Revenue Ledger/i)).toBeInTheDocument();

    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders full error state with retry button when query fails", () => {
    (usePlatformAdminDashboardAnalytics as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Network connection lost"),
      isFetching: false,
      refetch: mockRefetch,
    });

    render(<AdminDashboardPage />);

    expect(screen.getByText("Failed to load platform analytics")).toBeInTheDocument();
    expect(screen.getByText("Network connection lost")).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /Retry/i });
    fireEvent.click(retryBtn);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("updates timeline period filter when clicking filter pill", () => {
    render(<AdminDashboardPage />);

    const yearlyBtn = screen.getByRole("button", { name: "Yearly" });
    fireEvent.click(yearlyBtn);

    // Filter pill clicked
    expect(yearlyBtn).toHaveClass("bg-slate-900");
  });
});

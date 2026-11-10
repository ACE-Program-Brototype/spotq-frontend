import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import BillingHistoryPage from "@/features/subscription/pages/BillingHistoryPage";
import { subscriptionService } from "@/features/subscription/services/subscription.service";

jest.mock("@/features/subscription/services/subscription.service", () => ({
  subscriptionService: {
    getSubscriptionHistory: jest.fn(),
  },
}));

describe("BillingHistoryPage", () => {
  let queryClient: QueryClient;

  const mockTransactions = [
    {
      id: "tx-1",
      planCode: "QUEUE_PRO",
      planName: "Queue Pro",
      billingCycle: "MONTHLY" as const,
      amountPaise: 199900,
      amountRupees: 1999,
      currency: "INR",
      status: "SUCCESS" as const,
      razorpayPaymentId: "pay_123",
      invoiceNumber: "INV-2026-0001",
      invoiceUrl: "https://s3.amazonaws.com/test-invoice.pdf",
      createdAt: "2026-11-08T10:00:00Z",
    },
  ];

  const mockPagination = {
    currentPage: 1,
    pageSize: 10,
    totalRecords: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BillingHistoryPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    useAuthStore.getState().setAuth(
      {
        id: "rest-123",
        restaurantId: "rest-123",
        email: "owner@restaurant.com",
        fullName: "Spice Garden",
        role: "RESTAURANT_ADMIN",
      },
      "fake-token",
    );
  });

  afterEach(() => {
    act(() => {
      useAuthStore.getState().clearAuth();
    });
  });

  it("renders page header, breadcrumbs, and filter controls", async () => {
    (subscriptionService.getSubscriptionHistory as jest.Mock).mockResolvedValue({
      transactions: mockTransactions,
      pagination: mockPagination,
    });

    renderComponent();

    expect(screen.getByTestId("billing-history-page")).toBeInTheDocument();
    expect(screen.getByText("Subscription History & Tax Invoices")).toBeInTheDocument();
    expect(screen.getByTestId("status-filter-select")).toBeInTheDocument();
    expect(screen.getByTestId("billing-history-refresh-button")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("invoice-table")).toBeInTheDocument();
    });

    expect(screen.getByText("Queue Pro")).toBeInTheDocument();
    expect(screen.getByText("INV-2026-0001")).toBeInTheDocument();
    expect(screen.getByTestId("total-records-count")).toHaveTextContent("Total Transactions: 1");
  });

  it("filters transactions when status filter dropdown is changed", async () => {
    (subscriptionService.getSubscriptionHistory as jest.Mock).mockResolvedValue({
      transactions: mockTransactions,
      pagination: mockPagination,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("invoice-table")).toBeInTheDocument();
    });

    const select = screen.getByTestId("status-filter-select");
    fireEvent.change(select, { target: { value: "SUCCESS" } });

    expect(screen.getByTestId("reset-filter-toolbar-button")).toBeInTheDocument();

    expect(subscriptionService.getSubscriptionHistory).toHaveBeenCalledWith(
      "rest-123",
      expect.objectContaining({
        page: 1,
        status: "SUCCESS",
      }),
    );

    // Clicking reset filter returns status to ALL
    const resetBtn = screen.getByTestId("reset-filter-toolbar-button");
    fireEvent.click(resetBtn);

    expect(screen.queryByTestId("reset-filter-toolbar-button")).not.toBeInTheDocument();
  });

  it("displays error banner and handles retry when API fails", async () => {
    (subscriptionService.getSubscriptionHistory as jest.Mock).mockRejectedValue(
      new Error("Failed to connect to billing server"),
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("billing-history-error-banner")).toBeInTheDocument();
    });

    expect(screen.getByText("Failed to connect to billing server")).toBeInTheDocument();

    const retryBtn = screen.getByTestId("error-retry-button");
    (subscriptionService.getSubscriptionHistory as jest.Mock).mockResolvedValue({
      transactions: mockTransactions,
      pagination: mockPagination,
    });

    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByTestId("invoice-table")).toBeInTheDocument();
    });
  });

  it("renders pagination controls when multiple pages exist", async () => {
    (subscriptionService.getSubscriptionHistory as jest.Mock).mockResolvedValue({
      transactions: mockTransactions,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalRecords: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: false,
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("billing-pagination")).toBeInTheDocument();
    });
  });
});

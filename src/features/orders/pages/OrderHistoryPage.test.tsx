import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { apiClient } from "@/lib/api/client";
import { OrderHistoryPage } from "./OrderHistoryPage";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

jest.mock("@/features/profile/hooks/use-customer-profile", () => ({
  useCustomerProfile: () => ({
    data: {
      full_name: "John Doe",
      email: "john@example.com",
    },
    isLoading: false,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

const mockOrdersListResponse = {
  success: true,
  message: "Order history retrieved successfully",
  data: {
    orders: [
      {
        order_id: "9a123bc4-56de-78fa-9012-3456789abcde",
        order_number: "ORD-20261021-0001",
        restaurant_id: "3dc35af0-3ff5-4ee9-a60a-fbb47124731b",
        restaurant_name: "Spice Garden",
        status: "COMPLETED",
        items_count: 2,
        total_amount: 540.0,
        created_at: "2026-10-21T18:30:00.000Z",
      },
      {
        order_id: "9a123bc4-56de-78fa-9012-3456789abcdf",
        order_number: "ORD-20261021-0002",
        restaurant_id: "3dc35af0-3ff5-4ee9-a60a-fbb47124731b",
        restaurant_name: "Burger Bistro",
        status: "CANCELLED",
        items_count: 1,
        total_amount: 420.0,
        created_at: "2026-10-21T19:00:00.000Z",
      },
    ],
    pagination: {
      current_page: 1,
      total_pages: 3,
      total_orders: 24,
      has_next: true,
    },
  },
};

describe("OrderHistoryPage Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders page title, subtitle, filter chips, and order cards", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockOrdersListResponse),
    });

    render(<OrderHistoryPage />, { wrapper: createWrapper() });

    expect(screen.getByText("Order History")).toBeInTheDocument();
    expect(
      screen.getByText("Track and re-visit your past dining and takeaway orders."),
    ).toBeInTheDocument();

    expect(screen.getByRole("tab", { name: "Filter by All" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Filter by Completed" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Filter by Cancelled" })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Order #ORD-20261021-0001")).toBeInTheDocument();
    });

    expect(screen.getByText("Spice Garden")).toBeInTheDocument();
    expect(screen.getByText("₹540.00")).toBeInTheDocument();
    expect(screen.getByText("Order #ORD-20261021-0002")).toBeInTheDocument();
    expect(screen.getByText("Burger Bistro")).toBeInTheDocument();
    expect(screen.getByText("₹420.00")).toBeInTheDocument();
  });

  it("switches status filter immediately when clicking filter chips", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockOrdersListResponse),
    });

    render(<OrderHistoryPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Order #ORD-20261021-0001")).toBeInTheDocument();
    });

    const completedTab = screen.getByRole("tab", { name: "Filter by Completed" });
    fireEvent.click(completedTab);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith(
        "orders/history",
        expect.objectContaining({
          searchParams: expect.objectContaining({
            status: "COMPLETED",
            page: 1,
          }),
        }),
      );
    });
  });

  it("renders empty state when orders array is empty", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        message: "Order history retrieved successfully",
        data: {
          orders: [],
          pagination: {
            current_page: 1,
            total_pages: 1,
            total_orders: 0,
            has_next: false,
          },
        },
      }),
    });

    render(<OrderHistoryPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId("order-history-empty-state")).toBeInTheDocument();
    });
    expect(screen.getByText("No orders found")).toBeInTheDocument();
    expect(screen.getByText("Explore Restaurants")).toBeInTheDocument();
  });

  it("renders error state with retry button on API failure", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockRejectedValue(new Error("Network Error")),
    });

    render(<OrderHistoryPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId("order-history-error-state")).toBeInTheDocument();
    });
    expect(screen.getByText("Failed to load orders")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Try Again/i })).toBeInTheDocument();
  });
});

import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminOrdersPage from "./AdminOrdersPage";

const mockOrders = [
  {
    orderId: "ord-uuid-1",
    orderNumber: "SQ-20261111-001",
    restaurantId: "rest-uuid-1",
    restaurantName: "Burger Spot Deluxe",
    customerId: "cust-uuid-101",
    status: "PLACED" as const,
    paymentStatus: "PAID" as const,
    subtotal: 450,
    taxAmount: 22.5,
    totalAmount: 472.5,
    platformFeeAssessed: 18.9,
    paymentReference: "pay-ref-998877",
    createdAt: "2026-11-11T10:30:00.000Z",
    updatedAt: "2026-11-11T10:35:00.000Z",
  },
  {
    orderId: "ord-uuid-2",
    orderNumber: "SQ-20261111-002",
    restaurantId: "rest-uuid-2",
    restaurantName: "Pizza Napoli",
    customerId: null,
    status: "COMPLETED" as const,
    paymentStatus: "PAID" as const,
    subtotal: 820,
    taxAmount: 41,
    totalAmount: 861,
    platformFeeAssessed: 34.44,
    paymentReference: "pay-ref-554433",
    createdAt: "2026-11-11T11:00:00.000Z",
    updatedAt: "2026-11-11T11:45:00.000Z",
  },
];

const mockMetrics = {
  totalOrders: 150,
  ordersByStatus: {
    PLACED: 10,
    CONFIRMED: 5,
    PREPARING: 8,
    READY: 4,
    SERVED: 2,
    COMPLETED: 115,
    CANCELLED: 6,
  },
  totalOrderValue: 125400.5,
};

const mockRefetch = jest.fn();
const mockUseAdminOrders = jest.fn();

jest.mock("../hooks/use-admin-orders", () => ({
  useAdminOrders: (params: unknown) => mockUseAdminOrders(params),
}));

describe("AdminOrdersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAdminOrders.mockReturnValue({
      data: {
        orders: mockOrders,
        pagination: {
          currentPage: 1,
          limit: 25,
          totalOrders: 2,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        metrics: mockMetrics,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <AdminOrdersPage />
      </MemoryRouter>,
    );

  it("renders page header, badge, title, and subtitle", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Platform Orders" })).toBeInTheDocument();
    expect(screen.getByText("Console Operations")).toBeInTheDocument();
    expect(
      screen.getByText(
        "System-wide order monitor, financial ledger summaries, and real-time statuses.",
      ),
    ).toBeInTheDocument();
  });

  it("renders metrics overview cards with correct formatted values", () => {
    renderPage();

    expect(screen.getByText("Total Orders")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();

    expect(screen.getByText("Gross Order Value")).toBeInTheDocument();
    expect(screen.getAllByText("Completed").length).toBeGreaterThan(0);
    expect(screen.getByText("115")).toBeInTheDocument();

    expect(screen.getByText("Active Orders")).toBeInTheDocument();
    // 10 + 5 + 8 + 4 + 2 = 29
    expect(screen.getByText("29")).toBeInTheDocument();

    expect(screen.getAllByText("Cancelled").length).toBeGreaterThan(0);
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("renders the filter toolbar with search input, status options, and payment options", () => {
    renderPage();

    expect(
      screen.getByPlaceholderText("Search by order #, ID, restaurant, or customer..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "All Statuses" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Placed" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Preparing" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Completed" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All Payment States" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Paid" })).toBeInTheDocument();
  });

  it("renders orders list with order numbers, restaurant names, and pricing without raw UUID clutter", () => {
    renderPage();

    expect(screen.getAllByText("#SQ-20261111-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("#SQ-20261111-002").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Burger Spot Deluxe").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pizza Napoli").length).toBeGreaterThan(0);
    // Table should not render raw internal UUIDs
    expect(screen.queryByText("ord-uuid-1")).not.toBeInTheDocument();
    expect(screen.queryByText("rest-uuid-1")).not.toBeInTheDocument();
  });

  it("triggers refetch when clicking the refresh button", () => {
    renderPage();

    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    fireEvent.click(refreshButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("updates query when filtering by order status", () => {
    renderPage();

    const completedTab = screen.getByRole("tab", { name: "Completed" });
    act(() => {
      fireEvent.click(completedTab);
    });

    expect(mockUseAdminOrders).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: "COMPLETED",
      }),
    );
  });

  it("updates query when filtering by payment status", () => {
    renderPage();

    const paidBtn = screen.getByRole("button", { name: "Paid" });
    act(() => {
      fireEvent.click(paidBtn);
    });

    expect(mockUseAdminOrders).toHaveBeenLastCalledWith(
      expect.objectContaining({
        paymentStatus: "PAID",
      }),
    );
  });

  it("updates query when clicking date range preset", () => {
    renderPage();

    const todayBtn = screen.getByRole("button", { name: "Today" });
    act(() => {
      fireEvent.click(todayBtn);
    });

    expect(mockUseAdminOrders).toHaveBeenLastCalledWith(
      expect.objectContaining({
        startDate: expect.any(String),
        endDate: expect.any(String),
      }),
    );
  });

  it("toggles sorting when clicking table header", () => {
    renderPage();

    const amountHeader = screen.getByTitle("Sort by Total Amount");
    act(() => {
      fireEvent.click(amountHeader);
    });

    expect(mockUseAdminOrders).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sortBy: "totalAmount",
        sortOrder: "desc",
      }),
    );
  });

  it("opens order detail modal with full financial breakdown when clicking an order row", () => {
    renderPage();

    const orderRow = screen.getByTestId("admin-order-row-ord-uuid-1");
    fireEvent.click(orderRow);

    expect(screen.getByRole("heading", { name: /Order #SQ-20261111-001/i })).toBeInTheDocument();
    expect(screen.getByText("Authoritative Financial Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Subtotal (Items Net)")).toBeInTheDocument();
    expect(screen.getByText("Platform Fee Assessed")).toBeInTheDocument();
    expect(screen.getAllByText("pay-ref-998877").length).toBeGreaterThan(0);

    const closeBtn = screen.getByRole("button", { name: /^Close$/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText("Authoritative Financial Breakdown")).not.toBeInTheDocument();
  });

  it("closes order detail modal when pressing Escape key", () => {
    renderPage();

    const orderRow = screen.getByTestId("admin-order-row-ord-uuid-1");
    fireEvent.click(orderRow);

    expect(screen.getByRole("heading", { name: /Order #SQ-20261111-001/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByText("Authoritative Financial Breakdown")).not.toBeInTheDocument();
  });

  it("renders empty state when there are no orders", () => {
    mockUseAdminOrders.mockReturnValue({
      data: {
        orders: [],
        pagination: {
          currentPage: 1,
          limit: 25,
          totalOrders: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        metrics: mockMetrics,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderPage();

    expect(screen.getByTestId("admin-orders-empty-state")).toBeInTheDocument();
    expect(screen.getByText("No orders found")).toBeInTheDocument();
  });

  it("renders error state banner with retry button when query fails", () => {
    mockUseAdminOrders.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("Network connection failed"),
      refetch: mockRefetch,
    });

    renderPage();

    expect(screen.getByTestId("admin-orders-error-state")).toBeInTheDocument();
    expect(screen.getByText("Failed to load platform orders")).toBeInTheDocument();
    expect(screen.getByText("Network connection failed")).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(retryBtn);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});

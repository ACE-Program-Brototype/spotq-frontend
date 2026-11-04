import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RestaurantOrdersPage from "./RestaurantOrdersPage";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const mockMetrics = {
  totalOrders: 1248,
  totalOrdersTrend: "+12.5% vs last week",
  grossRevenue: 342850,
  grossRevenueTrend: "+18.2% vs last week",
  completedOrders: 1186,
  completedOrdersRate: "95% completion rate",
  cancelledOrders: 34,
  cancelledOrdersRate: "2.7% cancellation rate",
};

const mockOrders = [
  {
    orderId: "326a800d-494d-4e8c-a51d-23580c7ed725",
    orderNumber: "ORD-3DC35-008",
    orderStatus: "PLACED" as const,
    orderType: "DINE_IN" as const,
    tableNumber: 4,
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
    itemsCount: 2,
    itemsSummary: "Chicken Biryani x1, Garlic Naan x2",
    grandTotal: 1280,
    createdAt: "2026-11-02T20:22:02.440Z",
  },
  {
    orderId: "2fff7278-48e9-4593-a0cf-8ee20b124663",
    orderNumber: "ORD-3DC35-010",
    orderStatus: "SERVED" as const,
    orderType: "DINE_IN" as const,
    tableNumber: 7,
    customerName: "Priya Nair",
    customerPhone: "+91 94471 23456",
    itemsCount: 2,
    itemsSummary: "Paneer Butter Masala x1, Tandoori Roti x4",
    grandTotal: 890,
    createdAt: "2026-11-02T19:52:02.440Z",
  },
];

const mockUseRestaurantOrders = jest.fn();

jest.mock("../hooks/use-restaurant-orders-overview", () => ({
  useRestaurantOrdersOverview: () => ({
    data: mockMetrics,
    isLoading: false,
    refetch: jest.fn(),
  }),
}));

jest.mock("../hooks/use-restaurant-orders", () => ({
  useRestaurantOrders: (...args: unknown[]) => mockUseRestaurantOrders(...args),
}));

describe("RestaurantOrdersPage UI Presentation", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockUseRestaurantOrders.mockReturnValue({
      data: {
        orders: mockOrders,
        totalOrders: 1248,
        totalPages: 3,
        currentPage: 1,
        hasNext: true,
      },
      isLoading: false,
      isFetching: false,
      refetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderPage = () => {
    return render(
      <MemoryRouter>
        <RestaurantOrdersPage />
      </MemoryRouter>,
    );
  };

  it("renders page header with title and description", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Orders", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Order Management")).toBeInTheDocument();
    expect(screen.getByText("Manage and monitor restaurant orders.")).toBeInTheDocument();
  });

  it("renders all four overview metric cards", () => {
    renderPage();

    // 1. Total Orders
    expect(screen.getByText("Total Orders")).toBeInTheDocument();
    expect(screen.getByText("1,248")).toBeInTheDocument();

    // 2. Gross Revenue
    expect(screen.getByText("Gross Revenue")).toBeInTheDocument();
    expect(screen.getByText(/3,42,850/)).toBeInTheDocument();

    // 3. Completed Orders
    expect(screen.getByText("Completed Orders")).toBeInTheDocument();
    expect(screen.getByText("1,186")).toBeInTheDocument();

    // 4. Cancelled Orders
    expect(screen.getByText("Cancelled Orders")).toBeInTheDocument();
    expect(screen.getByText("34")).toBeInTheDocument();
  });

  it("renders the filter and search controls", () => {
    renderPage();

    // Search input
    expect(
      screen.getByPlaceholderText("Search by order number (e.g. ORD-9281)..."),
    ).toBeInTheDocument();

    // Date range selector
    const dateSelect = screen.getByLabelText("Filter by date range");
    expect(dateSelect).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Today" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Last 7 Days" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Custom Range" })).toBeInTheDocument();

    // Status selector
    const statusSelect = screen.getByLabelText("Filter by order status");
    expect(statusSelect).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "All Statuses" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Placed" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Preparing" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Ready" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Completed" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Cancelled" })).toBeInTheDocument();

    // Clear filters button
    expect(screen.getByRole("button", { name: /Clear Filters/i })).toBeInTheDocument();
  });

  it("renders table with sample orders and headers", () => {
    renderPage();

    // Table Headers
    expect(screen.getByRole("columnheader", { name: "Order Number" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Date / Time" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Items" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Total Amount" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Actions" })).toBeInTheDocument();

    // Sample Orders rendered
    expect(screen.getByText("#ORD-3DC35-008")).toBeInTheDocument();
    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByText("#ORD-3DC35-010")).toBeInTheDocument();
    expect(screen.getByText("Priya Nair")).toBeInTheDocument();

    // Action buttons
    const viewButtons = screen.getAllByRole("button", { name: /View Details/i });
    expect(viewButtons.length).toBeGreaterThan(0);
  });

  it("navigates to dedicated order details page when clicking View Details button", () => {
    renderPage();

    const viewButtons = screen.getAllByRole("button", { name: /View Details/i });
    fireEvent.click(viewButtons[0]);

    expect(mockedNavigate).toHaveBeenCalledWith(
      "/restaurant/orders/326a800d-494d-4e8c-a51d-23580c7ed725",
    );
  });

  it("navigates to dedicated order details page when clicking anywhere on an order row", () => {
    renderPage();

    const customerCell = screen.getByText("Rahul Sharma");
    fireEvent.click(customerCell);

    expect(mockedNavigate).toHaveBeenCalledWith(
      "/restaurant/orders/326a800d-494d-4e8c-a51d-23580c7ed725",
    );
  });

  it("resets currentPage to 1 when changing search query, status, or date range", () => {
    renderPage();

    // Verify initial call has page 1
    expect(mockUseRestaurantOrders).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ page: 1 }),
    );

    // Simulate search change
    const searchInput = screen.getByPlaceholderText("Search by order number (e.g. ORD-9281)...");
    fireEvent.change(searchInput, { target: { value: "ORD-999" } });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(mockUseRestaurantOrders).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ page: 1, search: "ORD-999" }),
    );

    // Simulate status filter change
    const statusSelect = screen.getByLabelText("Filter by order status");
    fireEvent.change(statusSelect, { target: { value: "PLACED" } });

    expect(mockUseRestaurantOrders).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ page: 1, status: "PLACED" }),
    );

    // Simulate date range change
    const dateSelect = screen.getByLabelText("Filter by date range");
    fireEvent.change(dateSelect, { target: { value: "LAST_7_DAYS" } });

    expect(mockUseRestaurantOrders).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ page: 1 }),
    );
  });
});

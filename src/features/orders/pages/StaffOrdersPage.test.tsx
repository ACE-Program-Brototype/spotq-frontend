import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import StaffOrdersPage from "./StaffOrdersPage";

const mockOrders = [
  {
    id: "ord-1",
    orderNumber: "ORD-001",
    orderType: "QUEUE_PRO" as const,
    status: "PLACED" as const,
    createdAt: "2026-11-08T10:30:00.000Z",
    queueId: "q-ticket-1",
    items: [
      {
        menuItemId: "item-1",
        name: "Classic Veg Burger",
        quantity: 2,
        variant: { id: "var-1", name: "Spicy" },
        addons: [{ id: "add-1", name: "Extra Cheese" }],
      },
    ],
  },
  {
    id: "ord-2",
    orderNumber: "ORD-002",
    orderType: "SELF_PRO" as const,
    status: "PREPARING" as const,
    createdAt: "2026-11-08T10:35:00.000Z",
    queueId: null,
    items: [
      {
        menuItemId: "item-2",
        name: "Cold Brew Coffee",
        quantity: 1,
        variant: null,
        addons: [],
      },
    ],
  },
];

const mockRefetch = jest.fn();
const mockUseStaffOrders = jest.fn();
const mockUseAuthStore = jest.fn();

jest.mock("../hooks/use-staff-orders", () => ({
  useStaffOrders: (restaurantId: string, params: unknown) =>
    mockUseStaffOrders(restaurantId, params),
}));

jest.mock("@/features/auth/store/auth.store", () => ({
  useAuthStore: (selector: (state: { user: { restaurantId?: string } | null }) => unknown) =>
    mockUseAuthStore(selector),
}));

describe("StaffOrdersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        user: {
          restaurantId: "rest-uuid-1234",
        },
      }),
    );
    mockUseStaffOrders.mockReturnValue({
      data: {
        orders: mockOrders,
        pagination: {
          page: 1,
          limit: 12,
          total: 2,
          totalPages: 1,
        },
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
        <StaffOrdersPage />
      </MemoryRouter>,
    );

  it("renders page header with terminal badge and title", () => {
    renderPage();

    expect(screen.getByText("Staff Orders")).toBeInTheDocument();
    expect(screen.getByText("Kitchen & Service Terminal")).toBeInTheDocument();
    expect(screen.getByText("Live Orders Feed")).toBeInTheDocument();
  });

  it("renders the filter and search controls", () => {
    renderPage();

    expect(
      screen.getByPlaceholderText("Search by order number (e.g. ORD-001)..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All Orders" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Placed" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Preparing" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ready" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Completed" })).toBeInTheDocument();
  });

  it("renders orders with order numbers, types, and items", () => {
    renderPage();

    expect(screen.getByText("ORD-001")).toBeInTheDocument();
    expect(screen.getByText("ORD-002")).toBeInTheDocument();
    expect(screen.getAllByText("Queue Pro").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Self Pro").length).toBeGreaterThan(0);
    expect(screen.getByText("Classic Veg Burger")).toBeInTheDocument();
    expect(screen.getByText("Cold Brew Coffee")).toBeInTheDocument();
    expect(screen.getByText("+Extra Cheese")).toBeInTheDocument();
  });

  it("triggers refetch when clicking the refresh button", () => {
    renderPage();

    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    fireEvent.click(refreshButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("renders empty state when there are no orders", () => {
    mockUseStaffOrders.mockReturnValue({
      data: {
        orders: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 1,
        },
      },
      isLoading: false,
      isFetching: false,
      refetch: mockRefetch,
    });

    renderPage();

    expect(screen.getByText(/no orders/i)).toBeInTheDocument();
  });

  it("filters when clicking status chip", () => {
    renderPage();

    const preparingButton = screen.getByRole("button", { name: "Preparing" });
    act(() => {
      fireEvent.click(preparingButton);
    });

    expect(mockUseStaffOrders).toHaveBeenLastCalledWith(
      "rest-uuid-1234",
      expect.objectContaining({
        status: "PREPARING",
      }),
    );
  });

  it("renders missing restaurant warning when staff has no restaurantId", () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        user: {
          restaurantId: "",
        },
      }),
    );

    renderPage();

    expect(screen.getByText("No restaurant assigned")).toBeInTheDocument();
    expect(
      screen.getByText(/Your staff account is not associated with an active restaurant/i),
    ).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/search by order number/i)).not.toBeInTheDocument();
  });

  it("renders error state with retry button when orders query fails", () => {
    mockUseStaffOrders.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("Network timeout"),
      refetch: mockRefetch,
    });

    renderPage();

    expect(screen.getByText("Failed to load orders")).toBeInTheDocument();
    expect(screen.getByText("Network timeout")).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /try again/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});

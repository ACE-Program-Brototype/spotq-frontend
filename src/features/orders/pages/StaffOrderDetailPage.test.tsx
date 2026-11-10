import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { StaffOrderDetail } from "../types/staff-orders.types";
import StaffOrderDetailPage from "./StaffOrderDetailPage";

const mockOrderDetail: StaffOrderDetail = {
  id: "ord-test-123",
  orderNumber: "ORD-5544",
  orderType: "QUEUE_PRO",
  status: "CONFIRMED",
  createdAt: "2026-11-08T10:30:00.000Z",
  queueId: "q-token-99",
  tableNumber: 3,
  priority: "HIGH",
  customerNotes: "Please deliver cutlery with napkins",
  totalQuantity: 3,
  items: [
    {
      id: "item-1",
      menuItemId: "menu-1",
      name: "Truffle Mushroom Pasta",
      quantity: 2,
      variant: { id: "v-1", name: "Gluten Free" },
      addons: [{ id: "a-1", name: "Extra Truffle Oil" }],
      specialInstructions: "Less pepper please",
    },
    {
      id: "item-2",
      menuItemId: "menu-2",
      name: "Sparkling Lemonade",
      quantity: 1,
      variant: null,
      addons: [],
      specialInstructions: null,
    },
  ],
};

const mockRefetch = jest.fn();
const mockUseStaffOrderDetail = jest.fn();
const mockUseAuthStore = jest.fn();
const mockMutate = jest.fn();

jest.mock("../hooks/use-staff-order-detail", () => ({
  useStaffOrderDetail: (restaurantId: string, orderId: string) =>
    mockUseStaffOrderDetail(restaurantId, orderId),
}));

jest.mock("../hooks/use-update-staff-order-status", () => ({
  useUpdateStaffOrderStatus: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

jest.mock("@/features/auth/store/auth.store", () => ({
  useAuthStore: (selector: (state: { user: { restaurantId?: string } | null }) => unknown) =>
    mockUseAuthStore(selector),
}));

describe("StaffOrderDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        user: {
          restaurantId: "rest-uuid-1234",
        },
      }),
    );
    mockUseStaffOrderDetail.mockReturnValue({
      data: mockOrderDetail,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  const renderPage = (orderId = "ord-test-123") =>
    render(
      <MemoryRouter initialEntries={[`/staff/orders/${orderId}`]}>
        <Routes>
          <Route path="/staff/orders/:orderId" element={<StaffOrderDetailPage />} />
          <Route path="/staff/orders" element={<div>Staff Orders List Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

  it("renders order details page with header, items, and metadata", () => {
    renderPage();

    // Header elements
    expect(screen.getByText("ORD-5544")).toBeInTheDocument();
    expect(screen.getAllByText("Confirmed").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Queue Pro").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Table 3").length).toBeGreaterThan(0);
    expect(screen.getByText("HIGH Priority")).toBeInTheDocument();
    expect(screen.getByText("Back to Orders")).toBeInTheDocument();

    // Items section
    expect(screen.getByText("Truffle Mushroom Pasta")).toBeInTheDocument();
    expect(screen.getByText("2×")).toBeInTheDocument();
    expect(screen.getByText("Gluten Free")).toBeInTheDocument();
    expect(screen.getByText("Extra Truffle Oil")).toBeInTheDocument();
    expect(screen.getByText(/Less pepper please/)).toBeInTheDocument();

    expect(screen.getByText("Sparkling Lemonade")).toBeInTheDocument();
    expect(screen.getByText("1×")).toBeInTheDocument();

    // General Customer Notes
    expect(screen.getByText("Customer Dining Notes")).toBeInTheDocument();
    expect(screen.getByText("Please deliver cutlery with napkins")).toBeInTheDocument();

    // Status action button
    expect(screen.getByRole("button", { name: /start cooking/i })).toBeInTheDocument();
  });

  it("renders loading skeleton while query is loading", () => {
    mockUseStaffOrderDetail.mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: true,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    const { container } = renderPage();

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
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
  });

  it("renders error state when order is not found or fetch fails", () => {
    mockUseStaffOrderDetail.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("Order does not exist"),
      refetch: mockRefetch,
    });

    renderPage();

    expect(screen.getByText("Order Not Found")).toBeInTheDocument();
    expect(screen.getByText("Order does not exist")).toBeInTheDocument();

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    expect(tryAgainButton).toBeInTheDocument();

    fireEvent.click(tryAgainButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("triggers status transition when clicking action button", () => {
    renderPage();

    const actionButton = screen.getByRole("button", { name: /start cooking/i });
    fireEvent.click(actionButton);

    expect(mockMutate).toHaveBeenCalledWith({
      orderId: "ord-test-123",
      status: "PREPARING",
    });
  });
});

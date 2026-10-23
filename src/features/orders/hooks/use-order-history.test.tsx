import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { ordersService } from "../services/orders.service";
import type { OrderHistoryItem } from "../types/orders.types";
import { useOrderHistory } from "./use-order-history";

jest.mock("../services/orders.service", () => ({
  ordersService: {
    getOrderHistory: jest.fn(),
  },
}));

const createWrapper = (initialEntries: string[] = ["/orders"]) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("useOrderHistory", () => {
  const mockOrders: OrderHistoryItem[] = [
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
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (ordersService.getOrderHistory as jest.Mock).mockResolvedValue({
      orders: mockOrders,
      pagination: {
        current_page: 1,
        total_pages: 3,
        total_orders: 25,
        has_next: true,
      },
    });
  });

  it("fetches orders with default page and status ALL", async () => {
    const { result } = renderHook(() => useOrderHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.orders).toEqual(mockOrders);
    expect(result.current.page).toBe(1);
    expect(result.current.status).toBe("ALL");
    expect(result.current.isFiltered).toBe(false);
  });

  it("reads page and status from URL searchParams", async () => {
    const { result } = renderHook(() => useOrderHistory(), {
      wrapper: createWrapper(["/orders?page=2&status=COMPLETED"]),
    });

    expect(result.current.page).toBe(2);
    expect(result.current.status).toBe("COMPLETED");
    expect(result.current.isFiltered).toBe(true);
  });

  it("updates status and resets page to 1 on setStatus", async () => {
    const { result } = renderHook(() => useOrderHistory({ initialPage: 3 }), {
      wrapper: createWrapper(["/orders?page=3"]),
    });

    expect(result.current.page).toBe(3);

    act(() => {
      result.current.setStatus("COMPLETED");
    });

    expect(result.current.status).toBe("COMPLETED");
    expect(result.current.page).toBe(1);
    expect(result.current.isFiltered).toBe(true);
  });

  it("updates page via setPage", async () => {
    const { result } = renderHook(() => useOrderHistory(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);
  });
});

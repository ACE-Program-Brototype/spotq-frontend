import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { subscriberService } from "../services/subscriber.service";
import { useSubscribers } from "./use-subscribers";

jest.mock("../services/subscriber.service", () => ({
  subscriberService: {
    getSubscribers: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useSubscribers hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (subscriberService.getSubscribers as jest.Mock).mockResolvedValue({
      subscribers: [
        {
          id: "sub-1",
          restaurantId: "rest-1",
          restaurantName: "Tasty Kitchen",
          subscriberName: "Alex",
          subscriberEmail: "alex@example.com",
          planName: "Basic",
          planCode: "BASIC",
          billingCycle: "MONTHLY",
          price: 199900,
          currency: "INR",
          status: "ACTIVE",
          currentPeriodStart: "2026-11-01T00:00:00.000Z",
          currentPeriodEnd: "2026-12-01T00:00:00.000Z",
          createdAt: "2026-11-01T00:00:00.000Z",
        },
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it("should fetch subscribers on mount with default settings", async () => {
    const { result } = renderHook(() => useSubscribers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.subscribers).toHaveLength(1);
    expect(result.current.page).toBe(1);
    expect(result.current.status).toBe("ALL");
    expect(result.current.isFiltered).toBe(false);
  });

  it("should reset page to 1 when status changes", async () => {
    const { result } = renderHook(() => useSubscribers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toBe(3);

    act(() => {
      result.current.setStatus("ACTIVE");
    });
    expect(result.current.page).toBe(1);
    expect(result.current.status).toBe("ACTIVE");
    expect(result.current.isFiltered).toBe(true);
  });

  it("should toggle sort order and reset page to 1", async () => {
    const { result } = renderHook(() => useSubscribers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setPage(2);
    });

    act(() => {
      result.current.toggleSortOrder();
    });

    expect(result.current.sortOrder).toBe("asc");
    expect(result.current.page).toBe(1);
  });

  it("should reset all filters when resetFilters is invoked", async () => {
    const { result } = renderHook(() => useSubscribers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setSearch("test query");
      result.current.setStatus("EXPIRED");
    });

    expect(result.current.isFiltered).toBe(true);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.search).toBe("");
    expect(result.current.status).toBe("ALL");
    expect(result.current.page).toBe(1);
    expect(result.current.isFiltered).toBe(false);
  });
});

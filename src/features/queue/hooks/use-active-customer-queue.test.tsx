import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { ACTIVE_QUEUE_STORAGE_KEY } from "../constants/websocket.constants";
import { queueService } from "../services/queue.service";
import type { ActiveCustomerQueueResponse } from "../types/queue.types";
import { useActiveCustomerQueue } from "./use-active-customer-queue";

jest.mock("../services/queue.service");

describe("useActiveCustomerQueue", () => {
  let queryClient: QueryClient;

  const mockCustomerUser = {
    id: "user-cust-1",
    email: "customer@example.com",
    role: "CUSTOMER" as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    useAuthStore.getState().clearAuth();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("does not fetch active queue when unauthenticated", () => {
    const { result } = renderHook(() => useActiveCustomerQueue(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(queueService.getActiveCustomerQueue).not.toHaveBeenCalled();
  });

  it("does not fetch active queue for non-customer roles", () => {
    useAuthStore.getState().setAuth(
      {
        id: "staff-1",
        email: "staff@example.com",
        role: "STAFF",
      },
      "token-staff",
    );

    const { result } = renderHook(() => useActiveCustomerQueue(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(queueService.getActiveCustomerQueue).not.toHaveBeenCalled();
  });

  it("fetches active queue when authenticated as a customer and stores ticket in localStorage", async () => {
    const activeTicket = {
      restaurantId: "rest-123",
      queueEntryId: "entry-456",
      queueNumber: "Q-012",
      status: "WAITING" as const,
    };

    const mockResponse: ActiveCustomerQueueResponse = {
      success: true,
      statusCode: 200,
      message: "Active queue check completed successfully",
      data: activeTicket,
    };

    (queueService.getActiveCustomerQueue as jest.Mock).mockResolvedValue(mockResponse);
    useAuthStore.getState().setAuth(mockCustomerUser, "token-cust");

    const { result } = renderHook(() => useActiveCustomerQueue(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(queueService.getActiveCustomerQueue).toHaveBeenCalledTimes(1);
    expect(JSON.parse(localStorage.getItem(ACTIVE_QUEUE_STORAGE_KEY) || "null")).toEqual(
      activeTicket,
    );
  });

  it("clears stale localStorage ticket when backend reports no active queue entry", async () => {
    localStorage.setItem(
      ACTIVE_QUEUE_STORAGE_KEY,
      JSON.stringify({
        restaurantId: "rest-stale",
        queueEntryId: "entry-stale",
        queueNumber: "Q-999",
        status: "WAITING",
      }),
    );

    const mockResponse: ActiveCustomerQueueResponse = {
      success: true,
      statusCode: 200,
      message: "Active queue check completed successfully",
      data: null,
    };

    (queueService.getActiveCustomerQueue as jest.Mock).mockResolvedValue(mockResponse);
    useAuthStore.getState().setAuth(mockCustomerUser, "token-cust");

    const { result } = renderHook(() => useActiveCustomerQueue(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(localStorage.getItem(ACTIVE_QUEUE_STORAGE_KEY)).toBeNull();
  });

  it("respects options.enabled = false", () => {
    useAuthStore.getState().setAuth(mockCustomerUser, "token-cust");

    const { result } = renderHook(() => useActiveCustomerQueue({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(queueService.getActiveCustomerQueue).not.toHaveBeenCalled();
  });
});

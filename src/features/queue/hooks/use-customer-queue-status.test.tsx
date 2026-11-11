import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { queueService } from "../services/queue.service";
import type { CustomerQueueStatusResponse } from "../types/queue.types";
import { useCustomerQueueStatus } from "./use-customer-queue-status";

jest.mock("../services/queue.service");

describe("useCustomerQueueStatus", () => {
  let queryClient: QueryClient;
  const restaurantId = "rest-status-123";
  const queueEntryId = "entry-status-456";

  const mockResponse: CustomerQueueStatusResponse = {
    success: true,
    statusCode: 200,
    message: "Success",
    data: {
      queueEntryId,
      restaurantId,
      restaurantName: "Tasty Bites",
      queueNumber: "Q-101",
      partySize: 4,
      status: "WAITING",
      position: 2,
      peopleAhead: 1,
      estimatedWaitMinutes: 12,
      estimatedWaitMinutesAtJoin: 15,
      joinedAt: "2026-11-09T10:00:00.000Z",
      assignedTableNumber: null,
      responseDeadline: null,
      canCancel: true,
      serverTime: "2026-11-09T10:05:00.000Z",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
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

  it("fetches customer queue status when restaurantId and queueEntryId are provided", async () => {
    (queueService.getCustomerQueueStatus as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCustomerQueueStatus(restaurantId, queueEntryId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(queueService.getCustomerQueueStatus).toHaveBeenCalledWith(restaurantId, queueEntryId);
    expect(result.current.data).toEqual(mockResponse);
  });

  it("does not fetch customer queue status when restaurantId is missing", () => {
    const { result } = renderHook(() => useCustomerQueueStatus(undefined, queueEntryId), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(queueService.getCustomerQueueStatus).not.toHaveBeenCalled();
  });

  it("does not fetch customer queue status when queueEntryId is missing", () => {
    const { result } = renderHook(() => useCustomerQueueStatus(restaurantId, undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(queueService.getCustomerQueueStatus).not.toHaveBeenCalled();
  });

  it("disables query when options.enabled is explicitly false", () => {
    const { result } = renderHook(
      () => useCustomerQueueStatus(restaurantId, queueEntryId, { enabled: false }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(false);
    expect(queueService.getCustomerQueueStatus).not.toHaveBeenCalled();
  });
});

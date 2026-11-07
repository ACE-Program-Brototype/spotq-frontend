import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { queueService } from "../services/queue.service";
import type { QueueEtaResponse } from "../types/queue.types";
import { useQueueEta } from "./use-queue-eta";

jest.mock("../services/queue.service");

describe("useQueueEta", () => {
  let queryClient: QueryClient;
  const restaurantId = "rest-eta-123";

  const mockEtaResponse: QueueEtaResponse = {
    success: true,
    data: {
      estimatedWaitMinutes: 18,
      partiesAhead: 2,
      partySize: 3,
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

  it("fetches ETA after debouncing party size", async () => {
    (queueService.getQueueEta as jest.Mock).mockResolvedValue(mockEtaResponse);

    const { result, rerender } = renderHook(
      ({ partySize }) => useQueueEta(restaurantId, partySize),
      {
        wrapper: createWrapper(),
        initialProps: { partySize: 2 },
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(queueService.getQueueEta).toHaveBeenCalledWith(restaurantId, 2);
    expect(result.current.data).toEqual(mockEtaResponse);

    // Update party size
    rerender({ partySize: 4 });

    await waitFor(() => {
      expect(queueService.getQueueEta).toHaveBeenCalledWith(restaurantId, 4);
    });
  });

  it("does not fetch if restaurantId is omitted or disabled", () => {
    const { result } = renderHook(() => useQueueEta(undefined, 2), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(queueService.getQueueEta).not.toHaveBeenCalled();
  });
});

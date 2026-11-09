import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { queueService } from "../services/queue.service";
import type { LeaveQueueResponse } from "../types/queue.types";
import { clearActiveCustomerTicket } from "../utils/active-queue.utils";
import { useLeaveQueue } from "./use-leave-queue";

jest.mock("../services/queue.service");
jest.mock("../utils/active-queue.utils", () => ({
  ...jest.requireActual("../utils/active-queue.utils"),
  clearActiveCustomerTicket: jest.fn(),
}));
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("useLeaveQueue", () => {
  let queryClient: QueryClient;
  const restaurantId = "rest-leave-123";
  const queueEntryId = "entry-leave-456";

  const mockResponse: LeaveQueueResponse = {
    success: true,
    message: "Left restaurant queue successfully",
    data: {
      queueEntryId,
      restaurantId,
      status: "CANCELLED",
      cancelledAt: "2026-11-09T10:15:00.000Z",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("submits leaveQueue, clears active ticket, and triggers success callback and toast", async () => {
    (queueService.leaveQueue as jest.Mock).mockResolvedValue(mockResponse);
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useLeaveQueue({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        restaurantId,
        queueEntryId,
      });
    });

    expect(queueService.leaveQueue).toHaveBeenCalledWith(restaurantId, queueEntryId);
    expect(clearActiveCustomerTicket).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(mockResponse.message);
    expect(onSuccess).toHaveBeenCalledWith(mockResponse.data);
  });

  it("triggers error callback and toast on failure", async () => {
    const error = new Error("Unable to leave queue");
    (queueService.leaveQueue as jest.Mock).mockRejectedValue(error);
    const onError = jest.fn();

    const { result } = renderHook(() => useLeaveQueue({ onError }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          restaurantId,
          queueEntryId,
        });
      } catch {}
    });

    expect(toast.error).toHaveBeenCalledWith("Unable to leave queue");
    expect(onError).toHaveBeenCalledWith(error);
  });

  it("throws error when restaurantId is missing", async () => {
    const onError = jest.fn();

    const { result } = renderHook(() => useLeaveQueue({ onError }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          restaurantId: "",
          queueEntryId,
        });
      } catch {}
    });

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Restaurant ID is required to join queue.",
      }),
    );
  });
});

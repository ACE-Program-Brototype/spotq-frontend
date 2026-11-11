import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { queueService } from "../services/queue.service";
import type { JoinQueueResponse } from "../types/queue.types";
import { useJoinQueue } from "./use-join-queue";

jest.mock("../services/queue.service");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("useJoinQueue", () => {
  let queryClient: QueryClient;
  const restaurantId = "rest-join-789";

  const mockResponse: JoinQueueResponse = {
    success: true,
    statusCode: 201,
    message: "Successfully joined the queue!",
    data: {
      queueEntryId: "entry-555",
      restaurantId,
      userId: "user-123",
      guestName: "Sam Smith",
      guestPhone: "+919876543210",
      partySize: 2,
      specialNotes: "Quiet table",
      registrationType: "ONLINE",
      position: 3,
      estimatedWaitMinutes: 20,
      status: "WAITING",
      joinedAt: "2026-11-03T11:00:00.000Z",
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

  it("submits joinQueue and triggers success callback and toast", async () => {
    (queueService.joinQueue as jest.Mock).mockResolvedValue(mockResponse);
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useJoinQueue(restaurantId, { onSuccess }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        guestName: "Sam Smith",
        guestPhone: "+919876543210",
        partySize: 2,
        specialNotes: "Quiet table",
      });
    });

    expect(queueService.joinQueue).toHaveBeenCalledWith(restaurantId, {
      guestName: "Sam Smith",
      guestPhone: "+919876543210",
      partySize: 2,
      specialNotes: "Quiet table",
    });

    expect(toast.success).toHaveBeenCalledWith(mockResponse.message);
    expect(onSuccess).toHaveBeenCalledWith(mockResponse.data);
  });

  it("triggers error callback and toast on failure", async () => {
    const error = new Error("Queue is currently closed");
    (queueService.joinQueue as jest.Mock).mockRejectedValue(error);
    const onError = jest.fn();

    const { result } = renderHook(() => useJoinQueue(restaurantId, { onError }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          guestName: "Sam Smith",
          guestPhone: "+919876543210",
          partySize: 2,
        });
      } catch {}
    });

    expect(toast.error).toHaveBeenCalledWith("Queue is currently closed");
    expect(onError).toHaveBeenCalledWith(error);
  });

  it("throws error and toasts message when restaurantId is missing", async () => {
    const onError = jest.fn();

    const { result } = renderHook(() => useJoinQueue(undefined, { onError }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          guestName: "Sam Smith",
          guestPhone: "+919876543210",
          partySize: 2,
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

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { queueService } from "../services/queue.service";
import type { RegisterWalkInResponse } from "../types/queue.types";
import { useRegisterWalkIn } from "./use-register-walk-in";

jest.mock("../services/queue.service");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("useRegisterWalkIn", () => {
  let queryClient: QueryClient;
  const restaurantId = "rest-777";

  const mockResponse: RegisterWalkInResponse = {
    success: true,
    message: "Walk-in guest successfully registered to queue",
    data: {
      queueEntryId: "queue-entry-123",
      restaurantId,
      userId: null,
      guestName: "Alice Walker",
      guestPhone: "+919876543210",
      partySize: 2,
      specialNotes: "High chair",
      registrationType: "WALK_IN",
      position: 1,
      estimatedWaitMinutes: 5,
      status: "WAITING",
      joinedAt: "2026-10-16T12:00:00.000Z",
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

  it("successfully registers walk-in and triggers success toast", async () => {
    (queueService.registerWalkIn as jest.Mock).mockResolvedValue(mockResponse);
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useRegisterWalkIn(restaurantId, { onSuccess }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.registerWalkIn({
        guestName: "Alice Walker",
        guestPhone: "+919876543210",
        partySize: 2,
        specialNotes: "High chair",
      });
    });

    expect(queueService.registerWalkIn).toHaveBeenCalledWith(restaurantId, {
      guestName: "Alice Walker",
      guestPhone: "+919876543210",
      partySize: 2,
      specialNotes: "High chair",
    });

    expect(toast.success).toHaveBeenCalledWith("Walk-in guest successfully registered to queue");
    expect(onSuccess).toHaveBeenCalledWith(mockResponse);
  });

  it("handles failure and displays error toast", async () => {
    const error = new Error("Queue is currently closed");
    (queueService.registerWalkIn as jest.Mock).mockRejectedValue(error);
    const onError = jest.fn();

    const { result } = renderHook(() => useRegisterWalkIn(restaurantId, { onError }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.registerWalkIn({
          guestName: "Alice Walker",
          guestPhone: "+15551234567",
          partySize: 2,
        });
      } catch {
        // error expected
      }
    });

    expect(toast.error).toHaveBeenCalledWith("Queue is currently closed");
    expect(onError).toHaveBeenCalledWith(error);
  });
});

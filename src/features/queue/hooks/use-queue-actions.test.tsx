import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { queueService } from "../services/queue.service";
import { useQueueActions } from "./use-queue-actions";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../services/queue.service");

describe("useQueueActions", () => {
  let queryClient: QueryClient;
  const restaurantId = "rest-test-actions-1";

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("calls ringCustomer and displays success toast", async () => {
    const onRingSuccess = jest.fn();
    (queueService.ringCustomer as jest.Mock).mockResolvedValue({
      success: true,
      message: "Customer notified",
      data: { queueEntryId: "entry-1" },
    });

    const { result } = renderHook(() => useQueueActions(restaurantId, { onRingSuccess }), {
      wrapper,
    });

    await act(async () => {
      await result.current.ringCustomer("entry-1");
    });

    expect(queueService.ringCustomer).toHaveBeenCalledWith("entry-1");
    expect(toast.success).toHaveBeenCalledWith("Customer notified");
    expect(onRingSuccess).toHaveBeenCalled();
  });

  it("handles ringCustomer failure and displays error toast", async () => {
    (queueService.ringCustomer as jest.Mock).mockRejectedValue(new Error("Network failed"));

    const { result } = renderHook(() => useQueueActions(restaurantId), { wrapper });

    await act(async () => {
      try {
        await result.current.ringCustomer("entry-1");
      } catch {
        // Expected
      }
    });

    expect(toast.error).toHaveBeenCalledWith("Network failed");
  });

  it("calls skipParty and displays success toast", async () => {
    const onSkipSuccess = jest.fn();
    (queueService.skipParty as jest.Mock).mockResolvedValue({
      success: true,
      message: "Queue entry skipped",
      data: { queueEntryId: "entry-1" },
    });

    const { result } = renderHook(() => useQueueActions(restaurantId, { onSkipSuccess }), {
      wrapper,
    });

    await act(async () => {
      await result.current.skipParty({
        queueEntryId: "entry-1",
        input: { reason: "Party not ready", skipPositions: 3 },
      });
    });

    expect(queueService.skipParty).toHaveBeenCalledWith(restaurantId, "entry-1", {
      reason: "Party not ready",
      skipPositions: 3,
    });
    expect(toast.success).toHaveBeenCalledWith("Queue entry skipped");
    expect(onSkipSuccess).toHaveBeenCalled();
  });

  it("calls cancelQueueEntry and displays appropriate message for NO_SHOW", async () => {
    const onCancelSuccess = jest.fn();
    (queueService.cancelQueueEntry as jest.Mock).mockResolvedValue({
      success: true,
      message: "Queue entry updated",
      data: { queueEntryId: "entry-1", status: "NO_SHOW" },
    });

    const { result } = renderHook(() => useQueueActions(restaurantId, { onCancelSuccess }), {
      wrapper,
    });

    await act(async () => {
      await result.current.cancelQueueEntry({
        queueEntryId: "entry-1",
        input: { reason: "NO_SHOW", notes: "Unresponsive" },
      });
    });

    expect(queueService.cancelQueueEntry).toHaveBeenCalledWith(restaurantId, "entry-1", {
      reason: "NO_SHOW",
      notes: "Unresponsive",
    });
    expect(toast.success).toHaveBeenCalledWith("Queue entry updated");
    expect(onCancelSuccess).toHaveBeenCalled();
  });
});

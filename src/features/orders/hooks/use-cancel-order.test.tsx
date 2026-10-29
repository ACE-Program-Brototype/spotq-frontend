import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import {
  CANCEL_ORDER_MESSAGES,
  CANCEL_ORDER_QUERY_KEYS,
} from "../constants/cancel-order.constants";
import { orderService } from "../services/order.service";
import type { CancelOrderResponseData } from "../types/cancel-order.types";
import { useCancelOrder } from "./use-cancel-order";

jest.mock("../services/order.service");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

function createMockError(status: number, message = "HTTP Error"): Error {
  const error = new Error(message);
  (error as unknown as { status: number }).status = status;
  return error;
}

describe("useCancelOrder", () => {
  let queryClient: QueryClient;

  const mockCancelledData: CancelOrderResponseData = {
    order_id: "ord_cancel_999",
    order_number: "ORD-MVJQTNFL-54089E",
    status: "CANCELLED",
    cancellation_reason: "Changed my mind",
    cancelled_at: "2026-10-22T21:02:15.290Z",
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

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("successfully cancels order, invalidates customer orders cache, and triggers success toast", async () => {
    (orderService.cancelOrder as jest.Mock).mockResolvedValueOnce(mockCancelledData);
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useCancelOrder("ord_cancel_999", { onSuccess }), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({
        cancellation_reason: "Changed my mind",
      });
    });

    expect(orderService.cancelOrder).toHaveBeenCalledWith("ord_cancel_999", {
      cancellation_reason: "Changed my mind",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: CANCEL_ORDER_QUERY_KEYS.ORDERS_ROOT,
    });
    expect(toast.success).toHaveBeenCalledWith(CANCEL_ORDER_MESSAGES.TOAST_SUCCESS);
    expect(onSuccess).toHaveBeenCalledWith(mockCancelledData);
  });

  it("handles 409 Conflict race condition by invalidating customer orders cache and showing error toast", async () => {
    const error409 = createMockError(409, "Food preparation has already started");
    (orderService.cancelOrder as jest.Mock).mockRejectedValueOnce(error409);
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const onError = jest.fn();
    const { result } = renderHook(() => useCancelOrder("ord_cancel_999", { onError }), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          cancellation_reason: "Changed my mind",
        });
      } catch {
        // Handled in mutation onError
      }
    });

    expect(toast.error).toHaveBeenCalledWith("Food preparation has already started");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: CANCEL_ORDER_QUERY_KEYS.ORDERS_ROOT,
    });
    expect(onError).toHaveBeenCalledWith(error409);
  });

  it("handles generic API errors by displaying error message in toast", async () => {
    const error500 = createMockError(500, "Internal Server Error");
    (orderService.cancelOrder as jest.Mock).mockRejectedValueOnce(error500);

    const onError = jest.fn();
    const { result } = renderHook(() => useCancelOrder("ord_cancel_999", { onError }), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          cancellation_reason: "Changed my mind",
        });
      } catch {
        // Expected
      }
    });

    expect(toast.error).toHaveBeenCalledWith("Internal Server Error");
    expect(onError).toHaveBeenCalledWith(error500);
  });
});

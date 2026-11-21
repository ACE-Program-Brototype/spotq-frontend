import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { useSubscriptionHistory } from "@/features/subscription/hooks/useSubscriptionHistory";
import { subscriptionService } from "@/features/subscription/services/subscription.service";

jest.mock("@/features/subscription/services/subscription.service", () => ({
  subscriptionService: {
    getSubscriptionHistory: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useSubscriptionHistory hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch subscription history when restaurantId is provided", async () => {
    const mockData = {
      transactions: [
        {
          id: "tx-1",
          planCode: "QUEUE_PRO",
          planName: "Queue Pro",
          billingCycle: "MONTHLY" as const,
          amountPaise: 199900,
          amountRupees: 1999,
          currency: "INR",
          status: "SUCCESS" as const,
          razorpayPaymentId: "pay_123",
          invoiceNumber: "INV-2026-0001",
          invoiceUrl: "https://s3.amazonaws.com/test-invoice.pdf",
          createdAt: "2026-11-08T10:00:00Z",
        },
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalRecords: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };

    (subscriptionService.getSubscriptionHistory as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useSubscriptionHistory("rest-123", { page: 1, limit: 10, status: "ALL" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(subscriptionService.getSubscriptionHistory).toHaveBeenCalledWith("rest-123", {
      page: 1,
      limit: 10,
      status: "ALL",
    });
    expect(result.current.transactions).toEqual(mockData.transactions);
    expect(result.current.pagination).toEqual(mockData.pagination);
  });

  it("should not execute query when restaurantId is not provided", () => {
    const { result } = renderHook(() => useSubscriptionHistory(undefined, { page: 1, limit: 10 }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe("idle");
    expect(subscriptionService.getSubscriptionHistory).not.toHaveBeenCalled();
    expect(result.current.transactions).toEqual([]);
  });

  it("should return isError when service fails", async () => {
    (subscriptionService.getSubscriptionHistory as jest.Mock).mockRejectedValue(
      new Error("Network connection error"),
    );

    const { result } = renderHook(() => useSubscriptionHistory("rest-123", { page: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Network connection error");
  });
});

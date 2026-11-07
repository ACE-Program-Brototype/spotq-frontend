import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { customerPaymentService } from "../services/customer-payment.service";
import { useCustomerPaymentHistory } from "./use-customer-payment-history";

jest.mock("../services/customer-payment.service", () => ({
  customerPaymentService: {
    getPaymentHistory: jest.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useCustomerPaymentHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches payment history with initial state", async () => {
    const mockResponse = {
      transactions: [
        {
          transactionId: "tx-1",
          orderId: "ord-1",
          amountPaise: 25000,
          amountInRupees: 250,
          currency: "INR",
          paymentMethod: "UPI",
          status: "SUCCESS",
          createdAt: "2026-10-27T03:35:00.000Z",
          hasInvoice: true,
          retryEligible: false,
        },
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };

    (customerPaymentService.getPaymentHistory as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCustomerPaymentHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.pagination.totalItems).toBe(1);
    expect(result.current.status).toBe("ALL");
  });

  it("resets page to 1 when status filter changes", async () => {
    (customerPaymentService.getPaymentHistory as jest.Mock).mockResolvedValue({
      transactions: [],
      pagination: { currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
    });

    const { result } = renderHook(() => useCustomerPaymentHistory({ initialPage: 3 }), {
      wrapper: createWrapper(),
    });

    expect(result.current.page).toBe(3);

    act(() => {
      result.current.setStatus("FAILED");
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
      expect(result.current.status).toBe("FAILED");
    });
  });

  it("updates sort and resets page to 1 when changing sort", async () => {
    (customerPaymentService.getPaymentHistory as jest.Mock).mockResolvedValue({
      transactions: [],
      pagination: { currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
    });

    const { result } = renderHook(() => useCustomerPaymentHistory({ initialPage: 2 }), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSort("amountPaise", "asc");
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
      expect(result.current.sortBy).toBe("amountPaise");
      expect(result.current.sortOrder).toBe("asc");
    });

    // Toggle same field switches direction
    act(() => {
      result.current.handleToggleSort("amountPaise");
    });

    await waitFor(() => {
      expect(result.current.sortOrder).toBe("desc");
    });
  });

  it("updates date range and resets page to 1", async () => {
    (customerPaymentService.getPaymentHistory as jest.Mock).mockResolvedValue({
      transactions: [],
      pagination: { currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
    });

    const { result } = renderHook(() => useCustomerPaymentHistory({ initialPage: 2 }), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setStartDate("2026-11-01");
      result.current.setEndDate("2026-11-06");
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
      expect(result.current.startDate).toBe("2026-11-01");
      expect(result.current.endDate).toBe("2026-11-06");
      expect(result.current.isDateFiltered).toBe(true);
    });

    act(() => {
      result.current.clearDateRange();
    });

    await waitFor(() => {
      expect(result.current.startDate).toBe("");
      expect(result.current.endDate).toBe("");
      expect(result.current.isDateFiltered).toBe(false);
    });
  });
});

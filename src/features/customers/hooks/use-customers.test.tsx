import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { customerService } from "../services/customer.service";
import { useCustomers, useUpdateCustomerStatus } from "./use-customers";

jest.mock("../services/customer.service", () => ({
  customerService: {
    getCustomers: jest.fn(),
    updateCustomerStatus: jest.fn(),
  },
}));

const createWrapper = (queryClient?: QueryClient) => {
  const client =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

describe("useCustomers hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (customerService.getCustomers as jest.Mock).mockResolvedValue({
      users: [{ id: "1", fullName: "John Doe", email: "john@example.com" }],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  });

  it("should fetch customers on mount with defaults", async () => {
    const { result } = renderHook(() => useCustomers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.customers).toHaveLength(1);
    expect(result.current.page).toBe(1);
    expect(result.current.status).toBe("ALL");
  });

  it("should reset page to 1 when status filter changes", async () => {
    const { result } = renderHook(() => useCustomers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toBe(3);

    act(() => {
      result.current.setStatus("ACTIVE");
    });
    expect(result.current.page).toBe(1);
    expect(result.current.status).toBe("ACTIVE");
  });

  it("should toggle sort order", async () => {
    const { result } = renderHook(() => useCustomers(), {
      wrapper: createWrapper(),
    });

    expect(result.current.sortOrder).toBe("DESC");

    act(() => {
      result.current.toggleSortOrder();
    });

    expect(result.current.sortOrder).toBe("ASC");
  });

  it("should reset filters to default", async () => {
    const { result } = renderHook(() => useCustomers(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSearch("test");
      result.current.setStatus("BLOCKED");
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.search).toBe("");
    expect(result.current.status).toBe("ALL");
    expect(result.current.page).toBe(1);
  });
});

describe("useUpdateCustomerStatus mutation hook", () => {
  it("should call customerService.updateCustomerStatus and invalidate queries on success", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    (customerService.updateCustomerStatus as jest.Mock).mockResolvedValue({
      id: "user-1",
      status: "BLOCKED",
      updatedAt: "2026-09-10T12:00:00.000Z",
    });

    const { result } = renderHook(() => useUpdateCustomerStatus(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({
        userId: "user-1",
        status: "BLOCKED",
      });
    });

    expect(customerService.updateCustomerStatus).toHaveBeenCalledWith({
      userId: "user-1",
      status: "BLOCKED",
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["admin", "customers"],
    });
  });
});

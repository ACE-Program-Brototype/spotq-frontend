import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { staffMemberService } from "@/features/staff/services/staff-member.service";
import type { StaffMember } from "@/features/staff/types/staff-invitation.types";
import { useStaffMembers } from "./use-staff-members";

jest.mock("@/features/staff/services/staff-member.service");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useStaffMembers", () => {
  const mockGetStaffMembers = staffMemberService.getStaffMembers as jest.Mock;

  const mockStaffData: StaffMember[] = [
    {
      id: "staff-1",
      name: "Ravi Kumar",
      email: "ravi@example.com",
      phone: "9876543211",
      designation: "Manager",
      status: "ACTIVE",
      joinedDate: "2026-01-02",
      lastLogin: "2026-01-02",
      employeeCode: "EMP-AFF-1",
    },
    {
      id: "staff-2",
      name: "Arun Sharma",
      email: "arun@example.com",
      phone: "9876543212",
      designation: "Chef",
      status: "INACTIVE",
      joinedDate: "2026-01-01",
      lastLogin: "2026-01-01",
      employeeCode: "EMP-AFF-2",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: {
        id: "owner-1",
        email: "owner@spotq.com",
        fullName: "Owner User",
        role: "RESTAURANT_ADMIN",
        restaurantId: "rest-123",
      },
      accessToken: "mock-token",
      isAuthenticated: true,
    });
  });

  it("fetches staff members on mount and updates state", async () => {
    mockGetStaffMembers.mockResolvedValueOnce({
      success: true,
      message: "Success",
      data: mockStaffData,
      pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
    });

    const { result } = renderHook(() => useStaffMembers(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetStaffMembers).toHaveBeenCalledWith("rest-123", {
      page: 1,
      limit: 20,
      status: undefined,
      search: undefined,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });

    expect(result.current.staffList).toEqual(mockStaffData);
    expect(result.current.stats).toEqual({
      total: 2,
      active: 1,
      inactive: 1,
      suspended: 0,
      invited: 0,
      removed: 0,
    });
  });

  it("handles errors from staffMemberService", async () => {
    mockGetStaffMembers.mockResolvedValueOnce({
      success: false,
      message: "Unauthorized access",
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });

    const { result } = renderHook(() => useStaffMembers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Unauthorized access");
    expect(result.current.staffList).toEqual([]);
  });

  it("updates status filter and triggers re-fetch", async () => {
    mockGetStaffMembers.mockResolvedValue({
      success: true,
      message: "Success",
      data: [mockStaffData[0]],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    });

    const { result } = renderHook(() => useStaffMembers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      result.current.setStatusFilter("ACTIVE");
    });

    await waitFor(() => {
      expect(mockGetStaffMembers).toHaveBeenCalledWith(
        "rest-123",
        expect.objectContaining({
          status: "ACTIVE",
        }),
      );
    });
  });

  it("uses server-provided aggregate stats when available", async () => {
    const mockServerStats = {
      total: 50,
      active: 40,
      inactive: 8,
      suspended: 1,
      invited: 1,
      removed: 0,
    };

    mockGetStaffMembers.mockResolvedValueOnce({
      success: true,
      message: "Success",
      data: mockStaffData,
      pagination: { page: 1, limit: 20, total: 50, totalPages: 3 },
      stats: mockServerStats,
    });

    const { result } = renderHook(() => useStaffMembers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats).toEqual(mockServerStats);
  });

  it("preserves initialPage on mount without being overridden by filter defaults", async () => {
    mockGetStaffMembers.mockResolvedValueOnce({
      success: true,
      message: "Success",
      data: [],
      pagination: { page: 3, limit: 20, total: 50, totalPages: 3 },
    });

    const { result } = renderHook(() => useStaffMembers({ initialPage: 3 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.page).toBe(3);
  });

  it("resets filters when resetFilters is called", async () => {
    mockGetStaffMembers.mockResolvedValue({
      success: true,
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });

    const { result } = renderHook(() => useStaffMembers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSearchQuery("Ravi");
      result.current.setStatusFilter("ACTIVE");
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.searchQuery).toBe("");
    expect(result.current.statusFilter).toBe("ALL");
  });
});

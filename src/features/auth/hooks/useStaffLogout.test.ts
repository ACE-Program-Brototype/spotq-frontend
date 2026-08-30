import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { logoutStaff } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useStaffLogout } from "./useStaffLogout";

jest.mock("@/features/auth/services/auth.service");
jest.mock("sonner");

const mockLogoutStaff = logoutStaff as jest.MockedFunction<typeof logoutStaff>;

const mockToastSuccess = toast.success as jest.MockedFunction<typeof toast.success>;

const mockToastError = toast.error as jest.MockedFunction<typeof toast.error>;

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(QueryClientProvider, { client: queryClient }, children),
    );
};

describe("useStaffLogout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  test("successfully logs out staff", async () => {
    useAuthStore.getState().setAuth(
      {
        id: "staff-1",
        fullName: "Restaurant Staff",
        email: "staff@example.com",
        role: "RESTAURANT_STAFF",
        phone: "1234567890",
        status: "Active",
        createdAt: "2026-08-20T00:00:00.000Z",
        updatedAt: "2026-08-20T00:00:00.000Z",
      },
      "active-staff-token",
    );

    mockLogoutStaff.mockResolvedValueOnce({
      success: true,
      message: "Staff logged out successfully",
    });

    const { result } = renderHook(() => useStaffLogout(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleStaffLogout();
    });

    await waitFor(() => {
      expect(mockLogoutStaff).toHaveBeenCalledTimes(1);
    });

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    expect(mockToastSuccess).toHaveBeenCalledWith("Staff logged out successfully");

    expect(mockNavigate).toHaveBeenCalledWith("/staff/login", {
      replace: true,
    });
  });

  test("uses default success message when API message is empty", async () => {
    useAuthStore.getState().setAuth(
      {
        id: "staff-2",
        fullName: "Staff User",
        email: "staff2@example.com",
        role: "RESTAURANT_STAFF",
        phone: "1234567890",
        status: "Active",
        createdAt: "2026-08-20T00:00:00.000Z",
        updatedAt: "2026-08-20T00:00:00.000Z",
      },
      "active-staff-token",
    );

    mockLogoutStaff.mockResolvedValueOnce({
      success: true,
      message: "",
    });

    const { result } = renderHook(() => useStaffLogout(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleStaffLogout();
    });

    expect(mockToastSuccess).toHaveBeenCalledWith(AUTH_MESSAGES.LOGOUT_SUCCESS);

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    expect(mockNavigate).toHaveBeenCalledWith("/staff/login", {
      replace: true,
    });
  });

  test("handles logout API error and clears auth", async () => {
    useAuthStore.getState().setAuth(
      {
        id: "staff-3",
        fullName: "Restaurant Staff",
        email: "staff3@example.com",
        role: "RESTAURANT_STAFF",
        phone: "1234567890",
        status: "Active",
        createdAt: "2026-08-20T00:00:00.000Z",
        updatedAt: "2026-08-20T00:00:00.000Z",
      },
      "active-staff-token",
    );

    const errorMessage = "Staff logout failed on server";

    mockLogoutStaff.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useStaffLogout(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleStaffLogout();
    });

    await waitFor(() => {
      expect(mockLogoutStaff).toHaveBeenCalledTimes(1);
    });

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    expect(mockToastError).toHaveBeenCalledWith(errorMessage);

    expect(mockNavigate).toHaveBeenCalledWith("/staff/login", {
      replace: true,
    });
  });

  test("uses default error message for non-Error rejection", async () => {
    useAuthStore.getState().setAuth(
      {
        id: "staff-4",
        fullName: "Restaurant Staff",
        email: "staff4@example.com",
        role: "RESTAURANT_STAFF",
        phone: "1234567890",
        status: "Active",
        createdAt: "2026-08-20T00:00:00.000Z",
        updatedAt: "2026-08-20T00:00:00.000Z",
      },
      "active-staff-token",
    );

    mockLogoutStaff.mockRejectedValueOnce("Unknown logout error");

    const { result } = renderHook(() => useStaffLogout(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleStaffLogout();
    });

    await waitFor(() => {
      expect(mockLogoutStaff).toHaveBeenCalledTimes(1);
    });

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    expect(mockToastError).toHaveBeenCalledWith(AUTH_MESSAGES.LOGOUT_FAILED);

    expect(mockNavigate).toHaveBeenCalledWith("/staff/login", {
      replace: true,
    });
  });
});

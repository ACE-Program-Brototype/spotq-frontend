import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { logoutAdmin } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useLogout } from "./useLogout";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/features/auth/services/auth.service", () => ({
  logoutAdmin: jest.fn(),
}));

const mockNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;
const mockLogoutAdmin = logoutAdmin as jest.MockedFunction<typeof logoutAdmin>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useLogout Hook Testing", () => {
  const navigateFn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReturnValue(navigateFn);
    localStorage.setItem("accessToken", "existing-jwt-token");
    useAuthStore.getState().setUser({
      _id: "admin-1",
      name: "Admin User",
      email: "admin@spotq.com",
      created_at: "2026-08-18T21:59:52.665Z",
    });
  });

  it("handles successful logout: calls logoutAdmin API, removes token, clears store, shows success toast, and navigates to login", async () => {
    mockLogoutAdmin.mockResolvedValueOnce();

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate();
    });

    expect(mockLogoutAdmin).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(toast.success).toHaveBeenCalledWith("Logged out successfully.");
    expect(navigateFn).toHaveBeenCalledWith("/admin/login", { replace: true });
  });

  it("handles failed logout: clears local auth and notifies user with error toast", async () => {
    mockLogoutAdmin.mockRejectedValueOnce(new Error("Server error during logout"));

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate();
    });

    expect(mockLogoutAdmin).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Server error during logout");
    expect(navigateFn).toHaveBeenCalledWith("/admin/login", { replace: true });
  });
});

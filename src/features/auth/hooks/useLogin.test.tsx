import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { loginAdmin } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useLogin } from "./useLogin";

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
  loginAdmin: jest.fn(),
}));

const mockNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;
const mockLoginAdmin = loginAdmin as jest.MockedFunction<typeof loginAdmin>;

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

describe("useLogin Hook & Notification Testing", () => {
  const navigateFn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReturnValue(navigateFn);
    localStorage.clear();
    useAuthStore.getState().clearAuth();
  });

  it("handles successful login: stores token, sets store user, shows success toast, and navigates to dashboard", async () => {
    const mockUser = {
      _id: "admin-123",
      name: "spotQ Admin",
      email: "admin@spotq.com",
      created_at: "2026-08-18T21:59:52.665Z",
    };

    mockLoginAdmin.mockResolvedValueOnce({
      access_token: "mock-jwt-token",
      user: mockUser,
    });

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        email: "admin@spotq.com",
        password: "securepassword123",
      });
    });

    expect(localStorage.getItem("accessToken")).toBe("mock-jwt-token");
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(toast.success).toHaveBeenCalledWith(expect.stringMatching(/welcome back/i));
    expect(navigateFn).toHaveBeenCalledWith("/admin/dashboard", {
      replace: true,
    });
  });

  it("handles login error: fires error toast with backend message", async () => {
    mockLoginAdmin.mockRejectedValueOnce(new Error("User not found"));

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        email: "unknown@spotq.com",
        password: "wrongpassword",
      });
    });

    expect(toast.error).toHaveBeenCalledWith("User not found");
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

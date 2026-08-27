import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { loginAdmin } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useAdminLogin } from "./useAdminLogin";

jest.mock("@/features/auth/services/auth.service");
jest.mock("sonner");

const mockLoginAdmin = loginAdmin as jest.MockedFunction<typeof loginAdmin>;
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
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
};

describe("useAdminLogin Hook & Notification Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  it("successfully logs in, saves token in auth store, updates user state, and shows toast", async () => {
    const mockUser = {
      _id: "admin-1",
      name: "Super Admin",
      email: "admin@spotq.com",
      role: "ADMIN" as const,
      created_at: "2026-08-20T00:00:00.000Z",
    };

    mockLoginAdmin.mockResolvedValueOnce({
      access_token: "mock-jwt-token-12345",
      user: mockUser,
    });

    const { result } = renderHook(() => useAdminLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        email: "admin@spotq.com",
        password: "securepassword123",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(useAuthStore.getState().accessToken).toBe("mock-jwt-token-12345");
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    expect(mockToastSuccess).toHaveBeenCalledWith(AUTH_MESSAGES.ADMIN_LOGIN_SUCCESS);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard", {
      replace: true,
    });
  });

  it("handles login failure and surfaces error via Sonner toast", async () => {
    const errorMessage = "Invalid admin credentials provided";
    mockLoginAdmin.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useAdminLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        email: "admin@spotq.com",
        password: "wrongpassword",
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

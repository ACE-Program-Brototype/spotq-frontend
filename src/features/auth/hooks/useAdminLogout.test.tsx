import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { logoutAdmin } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useAdminLogout } from "./useAdminLogout";

jest.mock("@/features/auth/services/auth.service");
jest.mock("sonner");

const mockLogoutAdmin = logoutAdmin as jest.MockedFunction<typeof logoutAdmin>;
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

describe("useAdminLogout Hook Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  it("successfully logs out, clears auth store, and redirects to /admin/login", async () => {
    useAuthStore.getState().setAuth(
      {
        _id: "admin-1",
        name: "Super Admin",
        email: "admin@spotq.com",
        role: "ADMIN" as const,
        created_at: "2026-08-20T00:00:00.000Z",
      },
      "active-admin-token",
    );

    mockLogoutAdmin.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAdminLogout(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    expect(mockToastSuccess).toHaveBeenCalledWith(AUTH_MESSAGES.ADMIN_LOGOUT_SUCCESS);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/login", { replace: true });
  });

  it("handles logout backend error, still cleans up auth store", async () => {
    useAuthStore.getState().setAuth(
      {
        _id: "admin-1",
        name: "Super Admin",
        email: "admin@spotq.com",
        role: "ADMIN" as const,
        created_at: "2026-08-20T00:00:00.000Z",
      },
      "active-admin-token",
    );

    mockLogoutAdmin.mockRejectedValueOnce(new Error("Server error"));

    const { result } = renderHook(() => useAdminLogout(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    expect(mockToastError).toHaveBeenCalledWith("Server error");
    expect(mockNavigate).toHaveBeenCalledWith("/admin/login", { replace: true });
  });
});

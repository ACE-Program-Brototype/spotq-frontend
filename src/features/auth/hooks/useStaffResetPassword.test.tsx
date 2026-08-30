import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { staffResetPassword } from "@/features/auth/services/auth.service";
import { useStaffResetPassword } from "./useStaffResetPassword";

jest.mock("@/features/auth/services/auth.service");
jest.mock("sonner");

const mockStaffResetPassword = staffResetPassword as jest.MockedFunction<typeof staffResetPassword>;
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

describe("useStaffResetPassword Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls staffResetPassword API and on success shows toast and navigates to staff login page", async () => {
    mockStaffResetPassword.mockResolvedValueOnce({
      success: true,
      message: "Password reset successful! Please sign in with your new password.",
    });

    const { result } = renderHook(() => useStaffResetPassword(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ password: "NewPassword123!" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockToastSuccess).toHaveBeenCalledWith(AUTH_MESSAGES.PASSWORD_RESET_SUCCESS);
    expect(mockNavigate).toHaveBeenCalledWith("/staff/login", { replace: true });
  });

  it("handles reset password failure and shows toast error", async () => {
    mockStaffResetPassword.mockRejectedValueOnce(new Error("Token expired or invalid"));

    const { result } = renderHook(() => useStaffResetPassword(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ password: "NewPassword123!" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockToastError).toHaveBeenCalledWith("Token expired or invalid");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

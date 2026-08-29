import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { staffForgotPassword } from "@/features/auth/services/auth.service";
import { useStaffForgotPassword } from "./useStaffForgotPassword";

jest.mock("@/features/auth/services/auth.service");
jest.mock("sonner");

const mockStaffForgotPassword = staffForgotPassword as jest.MockedFunction<
  typeof staffForgotPassword
>;
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

describe("useStaffForgotPassword Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls staffForgotPassword API and on success shows toast and navigates to verify OTP page", async () => {
    mockStaffForgotPassword.mockResolvedValueOnce({
      success: true,
      message: "OTP sent",
    });

    const { result } = renderHook(() => useStaffForgotPassword(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ email: "staff@spotq.com" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockToastSuccess).toHaveBeenCalledWith(AUTH_MESSAGES.OTP_SENT_SUCCESS);
    expect(mockNavigate).toHaveBeenCalledWith("/staff/forgot-password/verify-otp", {
      state: { email: "staff@spotq.com" },
    });
  });

  it("handles forgot password failure and shows toast error", async () => {
    mockStaffForgotPassword.mockRejectedValueOnce(new Error("Staff user not found"));

    const { result } = renderHook(() => useStaffForgotPassword(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ email: "notfound@spotq.com" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockToastError).toHaveBeenCalledWith("Staff user not found");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

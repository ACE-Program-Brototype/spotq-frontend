import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { staffVerifyOtp } from "@/features/auth/services/auth.service";
import { useStaffVerifyOtp } from "./useStaffVerifyOtp";

jest.mock("@/features/auth/services/auth.service");
jest.mock("sonner");

const mockStaffVerifyOtp = staffVerifyOtp as jest.MockedFunction<typeof staffVerifyOtp>;
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

describe("useStaffVerifyOtp Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls staffVerifyOtp API and on success shows toast and navigates to reset-password page", async () => {
    mockStaffVerifyOtp.mockResolvedValueOnce({
      success: true,
      message: "Identity verified successfully.",
    });

    const { result } = renderHook(() => useStaffVerifyOtp(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ email: "staff@spotq.com", otp: "123456" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockToastSuccess).toHaveBeenCalledWith(AUTH_MESSAGES.OTP_VERIFIED_SUCCESS);
    expect(mockNavigate).toHaveBeenCalledWith("/staff/reset-password", {
      state: { email: "staff@spotq.com" },
    });
  });

  it("handles verify OTP failure and shows toast error", async () => {
    mockStaffVerifyOtp.mockRejectedValueOnce(new Error("Invalid OTP"));

    const { result } = renderHook(() => useStaffVerifyOtp(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ email: "staff@spotq.com", otp: "000000" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockToastError).toHaveBeenCalledWith("Invalid OTP");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

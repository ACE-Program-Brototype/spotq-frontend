import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { verifyOtp } from "@/features/auth/services/auth.service";
import { useVerifyOtp } from "./useVerifyOtp";

jest.mock("@/features/auth/services/auth.service");
jest.mock("sonner");

const mockVerifyOtp = verifyOtp as jest.MockedFunction<typeof verifyOtp>;
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

describe("useVerifyOtp Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls verifyOtp API and on success shows toast and navigates to reset-password page", async () => {
    mockVerifyOtp.mockResolvedValueOnce({
      success: true,
      message: "Verified",
    });

    const { result } = renderHook(() => useVerifyOtp(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ email: "user@example.com", otp: "123456" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockToastSuccess).toHaveBeenCalledWith(AUTH_MESSAGES.OTP_VERIFIED_SUCCESS);
    expect(mockNavigate).toHaveBeenCalledWith("/forgot-password/reset-password", {
      state: { email: "user@example.com" },
    });
  });

  it("handles verify OTP failure and shows toast error", async () => {
    mockVerifyOtp.mockRejectedValueOnce(new Error("Invalid OTP"));

    const { result } = renderHook(() => useVerifyOtp(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ email: "user@example.com", otp: "000000" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockToastError).toHaveBeenCalledWith("Invalid OTP");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

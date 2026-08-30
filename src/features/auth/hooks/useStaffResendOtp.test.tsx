import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { staffResendOtp } from "@/features/auth/services/auth.service";
import { useStaffResendOtp } from "./useStaffResendOtp";

jest.mock("@/features/auth/services/auth.service");
jest.mock("sonner");

const mockStaffResendOtp = staffResendOtp as jest.MockedFunction<typeof staffResendOtp>;
const mockToastSuccess = toast.success as jest.MockedFunction<typeof toast.success>;
const mockToastError = toast.error as jest.MockedFunction<typeof toast.error>;

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

describe("useStaffResendOtp Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls staffResendOtp API and on success shows toast", async () => {
    mockStaffResendOtp.mockResolvedValueOnce({
      success: true,
      message: "OTP resent",
    });

    const { result } = renderHook(() => useStaffResendOtp(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ email: "staff@spotq.com" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockToastSuccess).toHaveBeenCalledWith(AUTH_MESSAGES.OTP_RESENT_SUCCESS);
  });

  it("handles resend OTP failure and shows toast error", async () => {
    mockStaffResendOtp.mockRejectedValueOnce(new Error("Rate limit exceeded"));

    const { result } = renderHook(() => useStaffResendOtp(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ email: "staff@spotq.com" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockToastError).toHaveBeenCalledWith("Rate limit exceeded");
  });
});

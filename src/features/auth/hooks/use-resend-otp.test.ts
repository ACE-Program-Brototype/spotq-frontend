import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "../constants/auth.constants";
import { handleAuthError } from "../utils/auth-error-handler";
import { useResendEmailOtp } from "./use-auth-mutations";
import { useResendOtp } from "./use-resend-otp";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../utils/auth-error-handler", () => ({
  handleAuthError: jest.fn(),
}));

jest.mock("./use-auth-mutations", () => ({
  useResendEmailOtp: jest.fn(),
}));

describe("useResendOtp", () => {
  const mockMutateAsync = jest.fn();

  const validEmail = "alex@example.com";

  beforeEach(() => {
    jest.clearAllMocks();

    (useResendEmailOtp as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it("returns handleResendOtp and loading state", () => {
    const { result } = renderHook(() => useResendOtp());

    expect(result.current.handleResendOtp).toEqual(expect.any(Function));

    expect(result.current.isLoading).toBe(false);
  });

  it("calls resend OTP mutation with the email", async () => {
    mockMutateAsync.mockResolvedValue({
      success: true,
      message: "OTP resent successfully",
    });

    const { result } = renderHook(() => useResendOtp());

    await act(async () => {
      await result.current.handleResendOtp(validEmail);
    });

    expect(mockMutateAsync).toHaveBeenCalledTimes(1);

    expect(mockMutateAsync).toHaveBeenCalledWith({
      email: validEmail,
    });
  });

  it("handles successful OTP resend", async () => {
    const response = {
      success: true,
      message: "OTP resent successfully",
    };

    mockMutateAsync.mockResolvedValue(response);

    const { result } = renderHook(() => useResendOtp());

    const returnedResponse = await act(async () => result.current.handleResendOtp(validEmail));

    expect(toast.success).toHaveBeenCalledWith(AUTH_MESSAGES.OTP_RESEND_SUCCESS);

    expect(toast.error).not.toHaveBeenCalled();

    expect(returnedResponse).toEqual(response);
  });

  it("shows API error message when resend fails", async () => {
    const response = {
      success: false,
      message: "Too many requests",
    };

    mockMutateAsync.mockResolvedValue(response);

    const { result } = renderHook(() => useResendOtp());

    const returnedResponse = await act(async () => result.current.handleResendOtp(validEmail));

    expect(toast.error).toHaveBeenCalledWith("Too many requests");

    expect(toast.success).not.toHaveBeenCalled();

    expect(returnedResponse).toEqual(response);
  });

  it("shows generic error when resend fails without a message", async () => {
    const response = {
      success: false,
      message: "",
    };

    mockMutateAsync.mockResolvedValue(response);

    const { result } = renderHook(() => useResendOtp());

    const returnedResponse = await act(async () => result.current.handleResendOtp(validEmail));

    expect(toast.error).toHaveBeenCalledWith(AUTH_MESSAGES.GENERIC_ERROR);

    expect(toast.success).not.toHaveBeenCalled();

    expect(returnedResponse).toEqual(response);
  });

  it("handles resend OTP errors thrown by the mutation", async () => {
    const error = new Error("Network error");

    mockMutateAsync.mockRejectedValue(error);

    const { result } = renderHook(() => useResendOtp());

    const returnedResponse = await act(async () => result.current.handleResendOtp(validEmail));

    expect(handleAuthError).toHaveBeenCalledWith(error, "resend-otp");

    expect(returnedResponse).toBeNull();

    expect(toast.success).not.toHaveBeenCalled();

    expect(toast.error).not.toHaveBeenCalled();
  });

  it("returns true for isLoading when resend is pending", () => {
    (useResendEmailOtp as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    const { result } = renderHook(() => useResendOtp());

    expect(result.current.isLoading).toBe(true);
  });
});

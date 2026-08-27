import { act, renderHook } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "../constants/auth.constants";
import { useVerifyEmailMutation } from "./use-auth-mutations";
import { useVerifyOtp } from "./use-verify-email";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("./use-auth-mutations", () => ({
  useVerifyEmailMutation: jest.fn(),
}));

describe("useVerifyOtp", () => {
  const mockNavigate = jest.fn();
  const mockMutateAsync = jest.fn();

  const validEmail = "alex@example.com";
  const validOtp = "123456";

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    (useVerifyEmailMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it("returns handleVerifyOtp and loading state", () => {
    const { result } = renderHook(() => useVerifyOtp());

    expect(result.current.handleVerifyOtp).toEqual(expect.any(Function));

    expect(result.current.isLoading).toBe(false);
  });

  it("calls verify OTP mutation with email and OTP", async () => {
    mockMutateAsync.mockResolvedValue({
      success: true,
      message: "OTP verified successfully",
    });

    const { result } = renderHook(() => useVerifyOtp());

    await act(async () => {
      await result.current.handleVerifyOtp(validEmail, validOtp);
    });

    expect(mockMutateAsync).toHaveBeenCalledTimes(1);

    expect(mockMutateAsync).toHaveBeenCalledWith({
      email: validEmail,
      otp: validOtp,
    });
  });

  it("handles successful OTP verification", async () => {
    mockMutateAsync.mockResolvedValue({
      success: true,
      message: "OTP verified successfully",
    });

    const { result } = renderHook(() => useVerifyOtp());

    await act(async () => {
      await result.current.handleVerifyOtp(validEmail, validOtp);
    });

    expect(toast.success).toHaveBeenCalledWith(AUTH_MESSAGES.OTP_VERIFIED_SUCCESS);

    expect(mockNavigate).toHaveBeenCalledTimes(1);

    expect(mockNavigate).toHaveBeenCalledWith("/", {
      replace: true,
    });
  });

  it("shows API error message when OTP verification fails", async () => {
    mockMutateAsync.mockResolvedValue({
      success: false,
      message: "Invalid OTP",
    });

    const { result } = renderHook(() => useVerifyOtp());

    await act(async () => {
      await result.current.handleVerifyOtp(validEmail, validOtp);
    });

    expect(toast.error).toHaveBeenCalledWith("Invalid OTP");

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows generic error when OTP verification fails without a message", async () => {
    mockMutateAsync.mockResolvedValue({
      success: false,
      message: "",
    });

    const { result } = renderHook(() => useVerifyOtp());

    await act(async () => {
      await result.current.handleVerifyOtp(validEmail, validOtp);
    });

    expect(toast.error).toHaveBeenCalledWith(AUTH_MESSAGES.GENERIC_ERROR);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles OTP verification errors thrown by the mutation", async () => {
    const error = new Error("Network error");

    mockMutateAsync.mockRejectedValue(error);

    const { result } = renderHook(() => useVerifyOtp());

    await act(async () => {
      await result.current.handleVerifyOtp(validEmail, validOtp);
    });

    expect(toast.error).toHaveBeenCalledWith("Network error");

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("returns true for isLoading when verification is pending", () => {
    (useVerifyEmailMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    const { result } = renderHook(() => useVerifyOtp());

    expect(result.current.isLoading).toBe(true);
  });
});

import { act, renderHook } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { useLoginMutation } from "./use-auth-mutations";
import { useLogin } from "./use-login";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockSetAuth = jest.fn();
jest.mock("../store/auth.store", () => ({
  useAuthStore: () => ({
    setAuth: mockSetAuth,
  }),
}));

jest.mock("./use-auth-mutations", () => ({
  useLoginMutation: jest.fn(),
}));

describe("useLogin hook", () => {
  const mockNavigate = jest.fn();
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLoginMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it("handles successful login and redirects to home", async () => {
    mockMutateAsync.mockResolvedValue({
      success: true,
      data: {
        user: { id: "u-1", email: "user@example.com" },
        accessToken: "access-token-123",
      },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({
        email: "user@example.com",
        password: "ValidPassword123!",
      });
    });

    expect(toast.success).toHaveBeenCalledWith(AUTH_MESSAGES.LOGIN_SUCCESS);
    expect(mockSetAuth).toHaveBeenCalledWith(
      { id: "u-1", email: "user@example.com", role: "CUSTOMER" },
      "access-token-123",
    );
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("redirects unverified user to /verify-otp with prefilled email", async () => {
    const error = new Error("Email is not verified. Please verify your email first.");
    mockMutateAsync.mockRejectedValue(error);

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({
        email: "unverified@example.com",
        password: "ValidPassword123!",
      });
    });

    expect(toast.info).toHaveBeenCalledWith(AUTH_MESSAGES.EMAIL_NOT_VERIFIED_PROMPT);
    expect(mockNavigate).toHaveBeenCalledWith("/verify-otp?email=unverified%40example.com");
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows error toast for standard invalid credentials failure", async () => {
    const error = new Error("Invalid email or password");
    mockMutateAsync.mockRejectedValue(error);

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({
        email: "user@example.com",
        password: "WrongPassword!",
      });
    });

    expect(toast.error).toHaveBeenCalledWith("Invalid email or password");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

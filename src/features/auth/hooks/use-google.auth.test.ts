import { act, renderHook } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { useGoogleLoginMutation } from "./use-auth-mutations";
import { useGoogleAuth } from "./use-google.auth";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockSetAuth = jest.fn();
jest.mock("../store/auth.store", () => ({
  useAuthStore: () => ({
    setAuth: mockSetAuth,
  }),
}));

jest.mock("./use-auth-mutations", () => ({
  useGoogleLoginMutation: jest.fn(),
}));

describe("useGoogleAuth hook", () => {
  const mockNavigate = jest.fn();
  const mockGoogleMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useGoogleLoginMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockGoogleMutateAsync,
      isPending: false,
    });
  });

  it("handles successful Google login, sets auth, and navigates", async () => {
    mockGoogleMutateAsync.mockResolvedValue({
      success: true,
      data: {
        user: { id: "u-google-1", email: "google@example.com" },
        accessToken: "google-token-xyz",
      },
    });

    const { result } = renderHook(() => useGoogleAuth("/custom-destination"));

    await act(async () => {
      await result.current.handleGoogleSuccess({ credential: "mock-google-id-token" });
    });

    expect(mockGoogleMutateAsync).toHaveBeenCalledWith({
      idToken: "mock-google-id-token",
    });
    expect(toast.success).toHaveBeenCalledWith(AUTH_MESSAGES.GOOGLE_SUCCESS);
    expect(mockSetAuth).toHaveBeenCalledWith(
      { id: "u-google-1", email: "google@example.com" },
      "google-token-xyz",
    );
    expect(mockNavigate).toHaveBeenCalledWith("/custom-destination", { replace: true });
  });

  it("handles API unsuccessful response with error toast", async () => {
    mockGoogleMutateAsync.mockResolvedValue({
      success: false,
      message: "Google account blocked",
    });

    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.handleGoogleSuccess({ credential: "bad-token" });
    });

    expect(toast.error).toHaveBeenCalledWith("Google account blocked");
    expect(mockSetAuth).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles thrown error from mutation with error toast", async () => {
    mockGoogleMutateAsync.mockRejectedValue(new Error("Network failed"));

    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.handleGoogleSuccess({ credential: "bad-token" });
    });

    expect(toast.error).toHaveBeenCalledWith("Network failed");
    expect(mockSetAuth).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

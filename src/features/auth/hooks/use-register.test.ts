import { renderHook, act } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth.store";
import { handleAuthError } from "../utils/auth-error-handler";
import { useRegisterMutation } from "./use-auth-mutations";
import { useRegister } from "./use-register";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../store/auth.store", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("../utils/auth-error-handler", () => ({
  handleAuthError: jest.fn(),
}));

jest.mock("./use-auth-mutations", () => ({
  useRegisterMutation: jest.fn(),
}));

describe("useRegister", () => {
  const mockNavigate = jest.fn();
  const mockSetAuth = jest.fn();
  const mockMutateAsync = jest.fn();

  const validValues = {
    fullName: "Alex Johnson",
    email: "alex@example.com",
    phoneNumber: "9876543210",
    password: "Password@123",
    confirmPassword: "Password@123",
    termsAccepted: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
    setAuth: mockSetAuth,
    });
    
    (useRegisterMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it("returns handleRegister and loading state", () => {
    const { result } = renderHook(() => useRegister());

    expect(result.current.handleRegister).toEqual(
      expect.any(Function),
    );

    expect(result.current.isLoading).toBe(false);
  });

  it("calls registration mutation with the correct data", async () => {
    mockMutateAsync.mockResolvedValue({
      success: true,
      data: {
        user: {
          id: "user-1",
          name: "Alex Johnson",
        },
        accessToken: "access-token",
      },
    });

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.handleRegister(validValues);
    });

    expect(mockMutateAsync).toHaveBeenCalledTimes(1);

    expect(mockMutateAsync).toHaveBeenCalledWith({
      fullName: "Alex Johnson",
      email: "alex@example.com",
      phoneNumber: "9876543210",
      password: "Password@123",
    });
  });

  it("handles successful registration", async () => {
    const user = {
      id: "user-1",
      name: "Alex Johnson",
    };

    const accessToken = "access-token";

    mockMutateAsync.mockResolvedValue({
      success: true,
      data: {
        user,
        accessToken,
      },
    });

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.handleRegister(validValues);
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Registration successful",
    );

    expect(mockSetAuth).toHaveBeenCalledWith(
      user,
      accessToken,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/", {
      replace: true,
    });
  });

  it("shows an error when registration fails", async () => {
    mockMutateAsync.mockResolvedValue({
      success: false,
      message: "Email already exists",
    });

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.handleRegister(validValues);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Email already exists",
    );

    expect(mockSetAuth).not.toHaveBeenCalled();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows the generic error when registration fails without a message", async () => {
    mockMutateAsync.mockResolvedValue({
      success: false,
      message: "",
    });

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.handleRegister(validValues);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Something went wrong. Please try again.",
    );

    expect(mockSetAuth).not.toHaveBeenCalled();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles registration errors thrown by the mutation", async () => {
    const error = new Error("Network error");

    mockMutateAsync.mockRejectedValue(error);

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.handleRegister(validValues);
    });

    expect(handleAuthError).toHaveBeenCalledWith(
      error,
      "register",
    );

    expect(mockSetAuth).not.toHaveBeenCalled();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("returns true for isLoading when registration is pending", () => {
    (useRegisterMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    const { result } = renderHook(() => useRegister());

    expect(result.current.isLoading).toBe(true);
  });
});
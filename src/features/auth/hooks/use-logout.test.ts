import { act, renderHook } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { getOrCreateDeviceId } from "../utils/device.utils";
import { useLogoutMutation } from "./use-auth-mutations";
import { useDeactivateDevice } from "./use-device";
import { useLogout } from "./use-logout";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockClearAuth = jest.fn();
jest.mock("../store/auth.store", () => ({
  useAuthStore: () => ({
    clearAuth: mockClearAuth,
  }),
}));

jest.mock("../utils/device.utils", () => ({
  getOrCreateDeviceId: jest.fn(),
}));

jest.mock("./use-auth-mutations", () => ({
  useLogoutMutation: jest.fn(),
}));

jest.mock("./use-device", () => ({
  useDeactivateDevice: jest.fn(),
}));

describe("useLogout hook", () => {
  const mockNavigate = jest.fn();
  const mockLogoutMutateAsync = jest.fn();
  const mockDeactivateMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (getOrCreateDeviceId as jest.Mock).mockReturnValue("persistent-device-id-999");
    (useLogoutMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockLogoutMutateAsync,
      isPending: false,
    });
    (useDeactivateDevice as jest.Mock).mockReturnValue({
      mutateAsync: mockDeactivateMutateAsync,
      isPending: false,
    });
  });

  it("deactivates device, calls logout mutation, clears auth, and redirects to login", async () => {
    mockLogoutMutateAsync.mockResolvedValue({ success: true, message: "Logged out" });
    mockDeactivateMutateAsync.mockResolvedValue({
      success: true,
      message: "Device deactivated",
      data: null,
    });

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(getOrCreateDeviceId).toHaveBeenCalled();
    expect(mockDeactivateMutateAsync).toHaveBeenCalledWith("persistent-device-id-999");
    expect(mockLogoutMutateAsync).toHaveBeenCalled();
    expect(mockClearAuth).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(AUTH_MESSAGES.LOGOUT_SUCCESS);
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("handles deactivation error gracefully and still finishes logout and redirect", async () => {
    mockDeactivateMutateAsync.mockRejectedValue(new Error("Network Error"));
    mockLogoutMutateAsync.mockResolvedValue({ success: true, message: "Logged out" });

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockDeactivateMutateAsync).toHaveBeenCalledWith("persistent-device-id-999");
    expect(mockLogoutMutateAsync).toHaveBeenCalled();
    expect(mockClearAuth).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(AUTH_MESSAGES.LOGOUT_SUCCESS);
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("handles logout mutation failure gracefully and still clears auth and redirects", async () => {
    mockDeactivateMutateAsync.mockResolvedValue({ success: true });
    mockLogoutMutateAsync.mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockClearAuth).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(AUTH_MESSAGES.LOGOUT_SUCCESS);
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });
});

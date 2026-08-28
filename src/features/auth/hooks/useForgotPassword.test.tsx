import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { forgotPassword } from "@/features/auth/services/auth.service";
import { useForgotPassword } from "./useForgotPassword";

jest.mock("@/features/auth/services/auth.service");
jest.mock("sonner");

const mockForgotPassword = forgotPassword as jest.MockedFunction<typeof forgotPassword>;
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

describe("useForgotPassword Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls forgotPassword API and on success shows toast and navigates to verify OTP page", async () => {
    mockForgotPassword.mockResolvedValueOnce({
      success: true,
      message: "OTP sent",
    });

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ email: "user@example.com" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockToastSuccess).toHaveBeenCalledWith(AUTH_MESSAGES.OTP_SENT_SUCCESS);
    expect(mockNavigate).toHaveBeenCalledWith("/forgot-password/verify", {
      state: { email: "user@example.com" },
    });
  });

  it("handles forgot password failure and shows toast error", async () => {
    mockForgotPassword.mockRejectedValueOnce(new Error("User not found"));

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ email: "notfound@example.com" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockToastError).toHaveBeenCalledWith("User not found");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

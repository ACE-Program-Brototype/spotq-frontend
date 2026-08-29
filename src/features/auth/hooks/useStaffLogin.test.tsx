import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "../constants/auth.constants";
import { useAuthStore } from "../store/auth.store";
import { useStaffLoginMutation } from "./use-auth-mutations";
import { useStaffLogin } from "./useStaffLogin";

const mockNavigate = jest.fn();
const mockMutateAsync = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("./use-auth-mutations", () => ({
  useStaffLoginMutation: jest.fn(),
}));

const mockedUseStaffLoginMutation = useStaffLoginMutation as jest.MockedFunction<
  typeof useStaffLoginMutation
>;

const mockToastSuccess = toast.success as jest.MockedFunction<typeof toast.success>;

const mockToastError = toast.error as jest.MockedFunction<typeof toast.error>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
};

const mockUser = {
  id: "staff-1",
  name: "John Staff",
  email: "staff@restaurant.com",
  role: "RESTAURANT_STAFF" as const,
};

describe("useStaffLogin Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.getState().clearAuth();

    mockedUseStaffLoginMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as ReturnType<typeof useStaffLoginMutation>);
  });

  it("successfully logs in staff and redirects to dashboard", async () => {
    mockMutateAsync.mockResolvedValueOnce({
      success: true,
      message: "Staff login successful",
      data: {
        user: mockUser,
        accessToken: "staff-jwt-token",
      },
    });

    const { result } = renderHook(() => useStaffLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleStaffLogin({
        email: "staff@restaurant.com",
        password: "StaffPassword123!",
      });
    });

    expect(mockMutateAsync).toHaveBeenCalledTimes(1);

    expect(mockMutateAsync).toHaveBeenCalledWith({
      email: "staff@restaurant.com",
      password: "StaffPassword123!",
    });

    const authState = useAuthStore.getState();

    expect(authState.user).toEqual({
      ...mockUser,
      role: "RESTAURANT_STAFF",
    });

    expect(authState.accessToken).toBe("staff-jwt-token");

    expect(authState.isAuthenticated).toBe(true);

    expect(mockToastSuccess).toHaveBeenCalledWith("Staff login successful");

    expect(mockNavigate).toHaveBeenCalledWith("/staff/dashboard", {
      replace: true,
    });
  });

  it("sets the user role to RESTAURANT_STAFF", async () => {
    mockMutateAsync.mockResolvedValueOnce({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: "staff-1",
          name: "John Staff",
          email: "staff@restaurant.com",
          role: "CUSTOMER",
        },
        accessToken: "staff-token",
      },
    });

    const { result } = renderHook(() => useStaffLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleStaffLogin({
        email: "staff@restaurant.com",
        password: "password123",
      });
    });

    expect(useAuthStore.getState().user?.role).toBe("RESTAURANT_STAFF");
  });

  it("shows error when login fails", async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error("Invalid credentials"));

    const { result } = renderHook(() => useStaffLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleStaffLogin({
        email: "staff@restaurant.com",
        password: "wrong-password",
      });
    });

    expect(mockToastError).toHaveBeenCalledWith("Invalid credentials");

    expect(mockNavigate).not.toHaveBeenCalled();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("shows response message when login is unsuccessful", async () => {
    mockMutateAsync.mockResolvedValueOnce({
      success: false,
      message: "Staff account is inactive",
      data: {
        user: mockUser,
        accessToken: "",
      },
    });

    const { result } = renderHook(() => useStaffLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleStaffLogin({
        email: "staff@restaurant.com",
        password: "password123",
      });
    });

    expect(mockToastError).toHaveBeenCalledWith("Staff account is inactive");

    expect(mockNavigate).not.toHaveBeenCalled();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("uses LOGIN_FAILED for unknown errors", async () => {
    mockMutateAsync.mockRejectedValueOnce("Unknown error");

    const { result } = renderHook(() => useStaffLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleStaffLogin({
        email: "staff@restaurant.com",
        password: "password123",
      });
    });

    expect(mockToastError).toHaveBeenCalledWith(AUTH_MESSAGES.LOGIN_FAILED);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("returns the mutation loading state", () => {
    mockedUseStaffLoginMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    } as ReturnType<typeof useStaffLoginMutation>);

    const { result } = renderHook(() => useStaffLogin(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});

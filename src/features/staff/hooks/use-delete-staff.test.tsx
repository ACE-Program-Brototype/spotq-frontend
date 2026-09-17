import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import { staffDetailService } from "@/features/staff/services/staff-detail.service";
import { useDeleteStaff } from "./use-delete-staff";

jest.mock("@/features/staff/services/staff-detail.service");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("useDeleteStaff", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    useAuthStore.getState().setUser({
      _id: "res-456",
      restaurantId: "res-456",
      email: "owner@spotq.com",
      role: "RESTAURANT_ADMIN",
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("successfully deletes staff, invalidates cache, shows toast, and navigates to staff list", async () => {
    (staffDetailService.deleteStaff as jest.Mock).mockResolvedValueOnce(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(
      () =>
        useDeleteStaff({
          restaurantId: "res-456",
          staffId: "stf-123",
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(staffDetailService.deleteStaff).toHaveBeenCalledWith("res-456", "stf-123");
    expect(toast.success).toHaveBeenCalledWith(STAFF_MESSAGES.STAFF_DELETE_SUCCESS);
    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/staff");
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("handles 401 Unauthorized by clearing auth and redirecting to email verification", async () => {
    const error401 = new Error("Unauthorized");
    (error401 as unknown as { status: number }).status = 401;

    (staffDetailService.deleteStaff as jest.Mock).mockRejectedValueOnce(error401);

    const { result } = renderHook(
      () =>
        useDeleteStaff({
          restaurantId: "res-456",
          staffId: "stf-123",
        }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync();
      } catch {
        // Expected error
      }
    });

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/email/verification", { replace: true });
    expect(toast.error).toHaveBeenCalledWith("Session expired. Please sign in again.");
  });

  it("handles 403 Forbidden with permission error toast", async () => {
    const error403 = new Error("Forbidden");
    (error403 as unknown as { status: number }).status = 403;

    (staffDetailService.deleteStaff as jest.Mock).mockRejectedValueOnce(error403);

    const { result } = renderHook(
      () =>
        useDeleteStaff({
          restaurantId: "res-456",
          staffId: "stf-123",
        }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync();
      } catch {
        // Expected error
      }
    });

    expect(toast.error).toHaveBeenCalledWith(STAFF_MESSAGES.STAFF_FORBIDDEN);
  });

  it("handles 404 Not Found with staff not found toast", async () => {
    const error404 = new Error("Not Found");
    (error404 as unknown as { status: number }).status = 404;

    (staffDetailService.deleteStaff as jest.Mock).mockRejectedValueOnce(error404);

    const { result } = renderHook(
      () =>
        useDeleteStaff({
          restaurantId: "res-456",
          staffId: "stf-123",
        }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync();
      } catch {
        // Expected error
      }
    });

    expect(toast.error).toHaveBeenCalledWith(STAFF_MESSAGES.STAFF_NOT_FOUND);
  });
});

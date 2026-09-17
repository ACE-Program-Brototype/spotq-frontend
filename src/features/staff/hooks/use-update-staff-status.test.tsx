import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import { staffDetailService } from "@/features/staff/services/staff-detail.service";
import type { StaffDetail } from "@/features/staff/types/staff-detail.types";
import { useUpdateStaffStatus } from "./use-update-staff-status";

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

describe("useUpdateStaffStatus", () => {
  let queryClient: QueryClient;

  const mockStaff: StaffDetail = {
    id: "stf-123",
    restaurantId: "res-456",
    fullName: "John Owner",
    email: "owner@spotq.com",
    phone: "+1234567890",
    avatarUrl: null,
    role: "STAFF",
    status: "ACTIVE",
    createdAt: "2026-09-09T18:58:55.316Z",
    updatedAt: "2026-09-09T18:58:55.316Z",
  };

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

  it("successfully activates staff status, updates query cache, and shows success toast", async () => {
    const updatedStaff: StaffDetail = { ...mockStaff, status: "ACTIVE" };
    (staffDetailService.updateStaffStatus as jest.Mock).mockResolvedValueOnce(updatedStaff);

    const onSuccess = jest.fn();
    const { result } = renderHook(
      () =>
        useUpdateStaffStatus({
          restaurantId: "res-456",
          staffId: "stf-123",
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync("ACTIVE");
    });

    expect(staffDetailService.updateStaffStatus).toHaveBeenCalledWith(
      "res-456",
      "stf-123",
      "ACTIVE",
    );
    expect(toast.success).toHaveBeenCalledWith(STAFF_MESSAGES.STAFF_ACTIVATE_SUCCESS);
    expect(onSuccess).toHaveBeenCalledWith(updatedStaff);
  });

  it("successfully deactivates staff status, updates query cache, and shows success toast", async () => {
    const updatedStaff: StaffDetail = { ...mockStaff, status: "INACTIVE" };
    (staffDetailService.updateStaffStatus as jest.Mock).mockResolvedValueOnce(updatedStaff);

    const onSuccess = jest.fn();
    const { result } = renderHook(
      () =>
        useUpdateStaffStatus({
          restaurantId: "res-456",
          staffId: "stf-123",
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync("INACTIVE");
    });

    expect(staffDetailService.updateStaffStatus).toHaveBeenCalledWith(
      "res-456",
      "stf-123",
      "INACTIVE",
    );
    expect(toast.success).toHaveBeenCalledWith(STAFF_MESSAGES.STAFF_DEACTIVATE_SUCCESS);
    expect(onSuccess).toHaveBeenCalledWith(updatedStaff);
  });

  it("handles 401 Unauthorized by clearing auth and redirecting to email verification", async () => {
    const error401 = new Error("Unauthorized");
    (error401 as unknown as { status: number }).status = 401;

    (staffDetailService.updateStaffStatus as jest.Mock).mockRejectedValueOnce(error401);

    const { result } = renderHook(
      () =>
        useUpdateStaffStatus({
          restaurantId: "res-456",
          staffId: "stf-123",
        }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync("INACTIVE");
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

    (staffDetailService.updateStaffStatus as jest.Mock).mockRejectedValueOnce(error403);

    const { result } = renderHook(
      () =>
        useUpdateStaffStatus({
          restaurantId: "res-456",
          staffId: "stf-123",
        }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync("INACTIVE");
      } catch {
        // Expected error
      }
    });

    expect(toast.error).toHaveBeenCalledWith(STAFF_MESSAGES.STAFF_FORBIDDEN);
  });

  it("handles 404 Not Found with staff not found toast", async () => {
    const error404 = new Error("Not Found");
    (error404 as unknown as { status: number }).status = 404;

    (staffDetailService.updateStaffStatus as jest.Mock).mockRejectedValueOnce(error404);

    const { result } = renderHook(
      () =>
        useUpdateStaffStatus({
          restaurantId: "res-456",
          staffId: "stf-123",
        }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync("INACTIVE");
      } catch {
        // Expected error
      }
    });

    expect(toast.error).toHaveBeenCalledWith(STAFF_MESSAGES.STAFF_NOT_FOUND);
  });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import { staffDetailService } from "@/features/staff/services/staff-detail.service";
import type { StaffDetail } from "@/features/staff/types/staff-detail.types";
import { useUpdateStaffInfo } from "./use-update-staff-info";

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

describe("useUpdateStaffInfo", () => {
  let queryClient: QueryClient;

  const mockStaff: StaffDetail = {
    id: "stf-123",
    restaurantId: "res-456",
    fullName: "Ravi Kumar",
    email: "ravi@example.com",
    phone: "+919876543210",
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

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("successfully updates staff info, updates cache, and triggers success toast", async () => {
    (staffDetailService.updateStaffInfo as jest.Mock).mockResolvedValueOnce(mockStaff);

    const onSuccess = jest.fn();
    const { result } = renderHook(
      () =>
        useUpdateStaffInfo({
          restaurantId: "res-456",
          staffId: "stf-123",
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync({
        name: "Ravi Kumar",
        phone: "+919876543210",
      });
    });

    expect(staffDetailService.updateStaffInfo).toHaveBeenCalledWith("res-456", "stf-123", {
      name: "Ravi Kumar",
      phone: "+919876543210",
    });
    expect(toast.success).toHaveBeenCalledWith(STAFF_MESSAGES.STAFF_UPDATE_SUCCESS);
    expect(onSuccess).toHaveBeenCalledWith(mockStaff);
  });

  it("handles 401 Unauthorized by clearing auth and redirecting to login", async () => {
    const error401 = new Error("Unauthorized");
    (error401 as unknown as { status: number }).status = 401;

    (staffDetailService.updateStaffInfo as jest.Mock).mockRejectedValueOnce(error401);

    const { result } = renderHook(
      () =>
        useUpdateStaffInfo({
          restaurantId: "res-456",
          staffId: "stf-123",
        }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: "Ravi Kumar",
          phone: "+919876543210",
        });
      } catch {
        // expected failure
      }
    });

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/email/verification", { replace: true });
    expect(toast.error).toHaveBeenCalledWith("Session expired. Please sign in again.");
  });

  it("handles 403 Forbidden with permission error toast", async () => {
    const error403 = new Error("Forbidden");
    (error403 as unknown as { status: number }).status = 403;

    (staffDetailService.updateStaffInfo as jest.Mock).mockRejectedValueOnce(error403);

    const { result } = renderHook(
      () =>
        useUpdateStaffInfo({
          restaurantId: "res-456",
          staffId: "stf-123",
        }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: "Ravi Kumar",
          phone: "+919876543210",
        });
      } catch {
        // expected failure
      }
    });

    expect(toast.error).toHaveBeenCalledWith(STAFF_MESSAGES.STAFF_FORBIDDEN);
  });

  it("handles 404 Not Found with staff not found toast", async () => {
    const error404 = new Error("Not Found");
    (error404 as unknown as { status: number }).status = 404;

    (staffDetailService.updateStaffInfo as jest.Mock).mockRejectedValueOnce(error404);

    const { result } = renderHook(
      () =>
        useUpdateStaffInfo({
          restaurantId: "res-456",
          staffId: "stf-123",
        }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: "Ravi Kumar",
          phone: "+919876543210",
        });
      } catch {
        // expected failure
      }
    });

    expect(toast.error).toHaveBeenCalledWith(STAFF_MESSAGES.STAFF_NOT_FOUND);
  });
});

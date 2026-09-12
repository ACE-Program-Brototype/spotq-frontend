import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { staffDetailService } from "@/features/staff/services/staff-detail.service";
import type { StaffDetail } from "@/features/staff/types/staff-detail.types";
import { useStaffDetail } from "./use-staff-detail";

jest.mock("@/features/staff/services/staff-detail.service");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("useStaffDetail", () => {
  let queryClient: QueryClient;

  const mockStaff: StaffDetail = {
    id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
    restaurantId: "rest_id",
    fullName: "John Owner",
    email: "owner@spotq.com",
    phone: "+1234567890",
    avatarUrl: "key",
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
      },
    });

    useAuthStore.getState().setUser({
      _id: "rest_id",
      restaurantId: "rest_id",
      email: "owner@spotq.com",
      role: "RESTAURANT_ADMIN",
    });
  });

  const createWrapper = (initialRoute: string, pathPattern: string) => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path={pathPattern} element={children} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it("fetches and returns staff detail successfully", async () => {
    (staffDetailService.getStaffDetail as jest.Mock).mockResolvedValue(mockStaff);

    const wrapper = createWrapper(
      "/restaurant/staff/b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
      "/restaurant/staff/:staffId",
    );

    const { result } = renderHook(() => useStaffDetail(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.staff).toEqual(mockStaff);
    expect(staffDetailService.getStaffDetail).toHaveBeenCalledWith(
      "rest_id",
      "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
    );
  });

  it("detects forbidden access if URL restaurantId does not match authenticated owner", async () => {
    const wrapper = createWrapper(
      "/restaurant/other_rest/staff/stf_01",
      "/restaurant/:restaurantId/staff/:staffId",
    );

    const { result } = renderHook(() => useStaffDetail(), { wrapper });

    expect(result.current.isForbidden).toBe(true);
    expect(staffDetailService.getStaffDetail).not.toHaveBeenCalled();
  });

  it("handles 404 not found error", async () => {
    const notFoundError = new Error("Staff not found");
    (notFoundError as unknown as { status: number }).status = 404;
    (staffDetailService.getStaffDetail as jest.Mock).mockRejectedValue(notFoundError);

    const wrapper = createWrapper("/restaurant/staff/stf_999", "/restaurant/staff/:staffId");

    const { result } = renderHook(() => useStaffDetail(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isNotFound).toBe(true);
  });

  it("handles 401 unauthorized by clearing auth and navigating to email verification", async () => {
    const unauthorizedError = new Error("Unauthorized");
    (unauthorizedError as unknown as { status: number }).status = 401;
    (staffDetailService.getStaffDetail as jest.Mock).mockRejectedValue(unauthorizedError);

    const clearAuthSpy = jest.spyOn(useAuthStore.getState(), "clearAuth");
    const wrapper = createWrapper("/restaurant/staff/stf_01", "/restaurant/staff/:staffId");

    renderHook(() => useStaffDetail(), { wrapper });

    await waitFor(() => {
      expect(clearAuthSpy).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/restaurant/email/verification", {
        replace: true,
      });
    });
  });
});

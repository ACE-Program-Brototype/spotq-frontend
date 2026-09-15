import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { PROFILE_QUERY_KEYS } from "../constants/profile.constants";
import { profileService } from "../services/profile.service";
import { useUpdateStaffProfile } from "./use-update-staff-profile";

jest.mock("../services/profile.service");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("useUpdateStaffProfile", () => {
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
      _id: "staff-1",
      id: "staff-1",
      name: "Original Name",
      email: "staff@example.com",
      role: "RESTAURANT_STAFF",
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );

  it("successfully updates staff profile and updates cache & auth store", async () => {
    const updatedProfile = {
      id: "staff-1",
      restaurantId: "rest-1",
      fullName: "Updated Staff Name",
      email: "staff@example.com",
      phone: "+919876543210",
      avatarUrl: null,
      role: "Staff",
      status: "Active",
      createdAt: "2024-10-24T08:42:00.000Z",
    };

    (profileService.updateStaffProfile as jest.Mock).mockResolvedValue(updatedProfile);

    const { result } = renderHook(() => useUpdateStaffProfile(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        restaurantId: "rest-1",
        staffId: "staff-1",
        payload: {
          name: "Updated Staff Name",
          phone: "+919876543210",
        },
      });
    });

    expect(profileService.updateStaffProfile).toHaveBeenCalledWith("rest-1", "staff-1", {
      name: "Updated Staff Name",
      phone: "+919876543210",
    });

    // Check query cache
    const cached = queryClient.getQueryData(PROFILE_QUERY_KEYS.STAFF_PROFILE);
    expect(cached).toEqual(updatedProfile);

    // Check auth store user
    const user = useAuthStore.getState().user;
    expect(user?.name).toBe("Updated Staff Name");
  });

  it("handles 401 unauthorized error by clearing auth and navigating to login", async () => {
    const unauthorizedError = new Error("401 Unauthorized");
    (unauthorizedError as unknown as { status: number }).status = 401;

    (profileService.updateStaffProfile as jest.Mock).mockRejectedValue(unauthorizedError);

    const clearAuthSpy = jest.spyOn(useAuthStore.getState(), "clearAuth");

    const { result } = renderHook(() => useUpdateStaffProfile(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          restaurantId: "rest-1",
          staffId: "staff-1",
          payload: {
            name: "Ravi",
            phone: "+919876543210",
          },
        });
      } catch {}
    });

    await waitFor(() => {
      expect(clearAuthSpy).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/staff/login", { replace: true });
    });
  });
});

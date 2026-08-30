import ky from "ky";

import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getOrRefreshAccessToken } from "./auth-refresh";

jest.mock("ky");

describe("auth-refresh", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  test("should refresh customer token and update auth store", async () => {
    useAuthStore.getState().setAuth(
      {
        id: "user-123",
        fullName: "Existing Customer",
        email: "customer@example.com",
        role: "CUSTOMER",
        phone: "",
        status: "Active",
        createdAt: "",
        updatedAt: "",
      },
      "old-customer-token",
    );

    const mockPost = jest.fn().mockReturnValue({
      json: jest.fn().mockResolvedValue({
        data: {
          access_token: "new-customer-token",
          user: {
            id: "user-123",
            full_name: "Refreshed Customer",
            email: "refreshed@example.com",
            status: "ACTIVE",
          },
        },
      }),
    });

    (ky.post as jest.Mock) = mockPost;

    const token = await getOrRefreshAccessToken();

    expect(token).toBe("new-customer-token");

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      expect.objectContaining({
        credentials: "include",
      }),
    );

    const authState = useAuthStore.getState();

    expect(authState.accessToken).toBe("new-customer-token");
    expect(authState.user?.fullName).toBe("Refreshed Customer");
    expect(authState.user?.email).toBe("refreshed@example.com");
    expect(authState.user?.role).toBe("CUSTOMER");
    expect(authState.isAuthenticated).toBe(true);
  });

  test("should refresh staff token and update auth store with RESTAURANT_STAFF role", async () => {
    useAuthStore.getState().setAuth(
      {
        id: "staff-123",
        fullName: "Restaurant Staff",
        email: "staff@example.com",
        role: "RESTAURANT_STAFF",
        phone: "",
        status: "Active",
        createdAt: "",
        updatedAt: "",
      },
      "old-staff-token",
    );

    const mockPost = jest.fn().mockReturnValue({
      json: jest.fn().mockResolvedValue({
        data: {
          access_token: "new-staff-token",
          user: {
            id: "staff-123",
            full_name: "Refreshed Staff",
            email: "refreshed-staff@example.com",
            status: "ACTIVE",
          },
        },
      }),
    });

    (ky.post as jest.Mock) = mockPost;

    const token = await getOrRefreshAccessToken();

    expect(token).toBe("new-staff-token");

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.STAFF_REFRESH_TOKEN,
      expect.objectContaining({
        credentials: "include",
      }),
    );

    const authState = useAuthStore.getState();

    expect(authState.accessToken).toBe("new-staff-token");
    expect(authState.user?.fullName).toBe("Refreshed Staff");
    expect(authState.user?.email).toBe("refreshed-staff@example.com");

    // Important: staff must remain RESTAURANT_STAFF
    expect(authState.user?.role).toBe("RESTAURANT_STAFF");

    expect(authState.isAuthenticated).toBe(true);
  });

  test("should share a single in-flight promise across concurrent customer refresh callers", async () => {
    useAuthStore.getState().setAuth(
      {
        id: "user-1",
        fullName: "Shared Customer",
        email: "shared@example.com",
        role: "CUSTOMER",
        phone: "",
        status: "Active",
        createdAt: "",
        updatedAt: "",
      },
      "old-token",
    );

    let resolveRefresh: ((value: unknown) => void) | undefined;

    const pendingPromise = new Promise((resolve) => {
      resolveRefresh = resolve;
    });

    const mockPost = jest.fn().mockReturnValue({
      json: jest.fn().mockReturnValue(pendingPromise),
    });

    (ky.post as jest.Mock) = mockPost;

    // Trigger 3 concurrent refresh calls
    const call1 = getOrRefreshAccessToken();
    const call2 = getOrRefreshAccessToken();
    const call3 = getOrRefreshAccessToken();

    // Only one refresh request should be made
    expect(mockPost).toHaveBeenCalledTimes(1);

    expect(mockPost).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      expect.objectContaining({
        credentials: "include",
      }),
    );

    resolveRefresh?.({
      data: {
        access_token: "shared-token",
        user: {
          id: "user-1",
          full_name: "Shared User",
          email: "shared@example.com",
          status: "ACTIVE",
        },
      },
    });

    const [t1, t2, t3] = await Promise.all([call1, call2, call3]);

    expect(t1).toBe("shared-token");
    expect(t2).toBe("shared-token");
    expect(t3).toBe("shared-token");

    expect(mockPost).toHaveBeenCalledTimes(1);

    expect(useAuthStore.getState().accessToken).toBe("shared-token");
    expect(useAuthStore.getState().user?.role).toBe("CUSTOMER");
  });

  test("should share a single in-flight promise across concurrent staff refresh callers", async () => {
    useAuthStore.getState().setAuth(
      {
        id: "staff-1",
        fullName: "Shared Staff",
        email: "staff@example.com",
        role: "RESTAURANT_STAFF",
        phone: "",
        status: "Active",
        createdAt: "",
        updatedAt: "",
      },
      "old-staff-token",
    );

    let resolveRefresh: ((value: unknown) => void) | undefined;

    const pendingPromise = new Promise((resolve) => {
      resolveRefresh = resolve;
    });

    const mockPost = jest.fn().mockReturnValue({
      json: jest.fn().mockReturnValue(pendingPromise),
    });

    (ky.post as jest.Mock) = mockPost;

    const call1 = getOrRefreshAccessToken();
    const call2 = getOrRefreshAccessToken();
    const call3 = getOrRefreshAccessToken();

    // Only one staff refresh request should be made
    expect(mockPost).toHaveBeenCalledTimes(1);

    expect(mockPost).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.STAFF_REFRESH_TOKEN,
      expect.objectContaining({
        credentials: "include",
      }),
    );

    resolveRefresh?.({
      data: {
        access_token: "shared-staff-token",
        user: {
          id: "staff-1",
          full_name: "Shared Staff",
          email: "shared-staff@example.com",
          status: "ACTIVE",
        },
      },
    });

    const [t1, t2, t3] = await Promise.all([call1, call2, call3]);

    expect(t1).toBe("shared-staff-token");
    expect(t2).toBe("shared-staff-token");
    expect(t3).toBe("shared-staff-token");

    expect(mockPost).toHaveBeenCalledTimes(1);

    const authState = useAuthStore.getState();

    expect(authState.accessToken).toBe("shared-staff-token");
    expect(authState.user?.role).toBe("RESTAURANT_STAFF");
    expect(authState.isAuthenticated).toBe(true);
  });

  test("should throw when there is no authenticated user role", async () => {
    await expect(getOrRefreshAccessToken()).rejects.toThrow(
      "Cannot refresh token: unknown user role.",
    );

    expect(ky.post).not.toHaveBeenCalled();
  });
});

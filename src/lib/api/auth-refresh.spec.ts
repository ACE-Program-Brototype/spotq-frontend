import ky from "ky";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getOrRefreshAccessToken } from "./auth-refresh";

jest.mock("ky");

describe("auth-refresh", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  test("should refresh token and update auth store", async () => {
    const mockPost = jest.fn().mockReturnValue({
      json: jest.fn().mockResolvedValue({
        data: {
          access_token: "new-jwt-token",
          user: {
            id: "user-123",
            full_name: "Refreshed User",
            email: "refreshed@example.com",
            status: "ACTIVE",
          },
        },
      }),
    });

    (ky.post as jest.Mock) = mockPost;

    const token = await getOrRefreshAccessToken();

    expect(token).toBe("new-jwt-token");
    expect(useAuthStore.getState().accessToken).toBe("new-jwt-token");
    expect(useAuthStore.getState().user?.fullName).toBe("Refreshed User");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  test("should share a single in-flight promise across concurrent callers (mutex)", async () => {
    let resolveRefresh: ((val: unknown) => void) | undefined;
    const pendingPromise = new Promise((resolve) => {
      resolveRefresh = resolve;
    });

    const mockPost = jest.fn().mockReturnValue({
      json: jest.fn().mockReturnValue(pendingPromise),
    });

    (ky.post as jest.Mock) = mockPost;

    // Trigger 3 concurrent calls
    const call1 = getOrRefreshAccessToken();
    const call2 = getOrRefreshAccessToken();
    const call3 = getOrRefreshAccessToken();

    // Verify ky.post was called only once despite 3 concurrent triggers
    expect(mockPost).toHaveBeenCalledTimes(1);

    // Resolve the single refresh network call
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
  });
});

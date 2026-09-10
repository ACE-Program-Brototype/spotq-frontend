import type { NormalizedOptions } from "ky";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { afterResponse } from "./afterResponse";

describe("afterResponse hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  const createMockResponse = (status: number, data: unknown): Response => {
    return {
      status,
      clone: () => ({
        json: () => Promise.resolve(data),
      }),
    } as unknown as Response;
  };

  it("should clear auth state when response is 403 USER_BLOCKED", async () => {
    useAuthStore.getState().setAuth(
      {
        id: "user-1",
        email: "user@example.com",
        fullName: "Test User",
        role: "CUSTOMER",
      },
      "dummy-token",
    );

    const mockResponse = createMockResponse(403, {
      success: false,
      code: "USER_BLOCKED",
      message: "Your account has been blocked. Please contact support.",
    });

    const result = await afterResponse({
      request: {} as Request,
      options: {} as NormalizedOptions,
      response: mockResponse,
      retryCount: 0,
    });

    expect(result).toBe(mockResponse);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("should retain auth state on normal 200 response", async () => {
    useAuthStore.getState().setAuth(
      {
        id: "user-1",
        email: "user@example.com",
        fullName: "Test User",
        role: "CUSTOMER",
      },
      "dummy-token",
    );

    const mockResponse = createMockResponse(200, { success: true });

    const result = await afterResponse({
      request: {} as Request,
      options: {} as NormalizedOptions,
      response: mockResponse,
      retryCount: 0,
    });

    expect(result).toBe(mockResponse);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});

import { HTTPError, type NormalizedOptions } from "ky";
import { ADMIN_AUTH_ENDPOINTS, AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import * as authRefreshModule from "../auth-refresh";
import { redirectToPortalLogin } from "../portal-redirect";
import { beforeRetry } from "./beforeRetry";

jest.mock("../auth-refresh");
jest.mock("../portal-redirect", () => ({
  redirectToPortalLogin: jest.fn(),
}));

describe("beforeRetry hook", () => {
  const dummyOptions = {} as NormalizedOptions;

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  const createMockRequest = (url: string) => {
    const headersMap = new Map<string, string>();
    return {
      url,
      headers: {
        set: jest.fn((key: string, val: string) => headersMap.set(key, val)),
        get: jest.fn((key: string) => headersMap.get(key) || null),
      },
    } as unknown as Request;
  };

  const createHttpError = (status = 401, data?: unknown) => {
    const error = Object.create(HTTPError.prototype);
    error.name = "HTTPError";
    error.data = data || { message: "Unauthorized request." };
    error.response = {
      status,
      statusText: status === 401 ? "Unauthorized" : "Forbidden",
    } as Response;
    return error as HTTPError;
  };

  test("should throw error on 401 for auth routes (e.g. login) to propagate HTTPError", async () => {
    const request = createMockRequest(`http://localhost:10000/api/v1${AUTH_ENDPOINTS.LOGIN}`);
    const error = createHttpError(401, { message: "Invalid email or password." });

    await expect(
      beforeRetry({
        request,
        options: dummyOptions,
        error,
        retryCount: 1,
      }),
    ).rejects.toBe(error);

    expect(authRefreshModule.getOrRefreshAccessToken).not.toHaveBeenCalled();
  });

  test("should throw error on 401 for admin login route to propagate HTTPError without redirecting", async () => {
    const request = createMockRequest(
      `http://localhost:10000/api/v1/${ADMIN_AUTH_ENDPOINTS.LOGIN}`,
    );
    const error = createHttpError(401, { message: "Invalid credentials" });

    await expect(
      beforeRetry({
        request,
        options: dummyOptions,
        error,
        retryCount: 1,
      }),
    ).rejects.toBe(error);

    expect(authRefreshModule.getOrRefreshAccessToken).not.toHaveBeenCalled();
  });

  test("should throw error on 401 for google login to propagate HTTPError", async () => {
    const request = createMockRequest(
      `http://localhost:10000/api/v1${AUTH_ENDPOINTS.GOOGLE_LOGIN}`,
    );
    const error = createHttpError(401, { message: "Invalid Google token" });

    await expect(
      beforeRetry({
        request,
        options: dummyOptions,
        error,
        retryCount: 1,
      }),
    ).rejects.toBe(error);

    expect(authRefreshModule.getOrRefreshAccessToken).not.toHaveBeenCalled();
  });

  test("should refresh token and update Authorization header on 401 for protected endpoints", async () => {
    const request = createMockRequest("http://localhost:10000/api/v1/protected/resource");
    const error = createHttpError(401);

    (authRefreshModule.getOrRefreshAccessToken as jest.Mock).mockResolvedValue(
      "new-refreshed-token",
    );

    const result = await beforeRetry({
      request,
      options: dummyOptions,
      error,
      retryCount: 1,
    });

    expect(result).toBeUndefined();
    expect(authRefreshModule.getOrRefreshAccessToken).toHaveBeenCalledTimes(1);
    expect(request.headers.get("Authorization")).toBe("Bearer new-refreshed-token");
  });

  test("should throw error if retryCount > 1 on 401", async () => {
    const request = createMockRequest("http://localhost:10000/api/v1/protected/resource");
    const error = createHttpError(401);

    await expect(
      beforeRetry({
        request,
        options: dummyOptions,
        error,
        retryCount: 2,
      }),
    ).rejects.toBe(error);

    expect(authRefreshModule.getOrRefreshAccessToken).not.toHaveBeenCalled();
  });

  describe("blocked account handling", () => {
    it.each([
      { desc: "top-level USER_BLOCKED code", data: { code: "USER_BLOCKED" } },
      { desc: "top-level ACCOUNT_BLOCKED code", data: { code: "ACCOUNT_BLOCKED" } },
      { desc: "nested error.code USER_BLOCKED", data: { error: { code: "USER_BLOCKED" } } },
      { desc: "nested error.code ACCOUNT_BLOCKED", data: { error: { code: "ACCOUNT_BLOCKED" } } },
    ])("clears auth state and redirects to portal login on $desc", async ({ data }) => {
      useAuthStore.getState().setAuth(
        {
          id: "cust-1",
          email: "cust@example.com",
          fullName: "Blocked Customer",
          role: "CUSTOMER",
        },
        "expired-token",
      );

      const request = createMockRequest("http://localhost:10000/api/v1/customers/profile");
      const error = createHttpError(403, data);

      await expect(
        beforeRetry({
          request,
          options: dummyOptions,
          error,
          retryCount: 0,
        }),
      ).rejects.toBe(error);

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(redirectToPortalLogin).toHaveBeenCalledTimes(1);
      expect(authRefreshModule.getOrRefreshAccessToken).not.toHaveBeenCalled();
    });
  });

  describe("refresh failure handling", () => {
    it("clears auth state, redirects to portal login, and throws error when token refresh fails", async () => {
      useAuthStore.getState().setAuth(
        {
          id: "admin-1",
          email: "admin@example.com",
          fullName: "Admin User",
          role: "ADMIN",
        },
        "stale-token",
      );

      const request = createMockRequest("http://localhost:10000/api/v1/admin/customers");
      const error = createHttpError(401);

      const refreshError = new Error("Refresh token expired or invalid");
      (authRefreshModule.getOrRefreshAccessToken as jest.Mock).mockRejectedValue(refreshError);

      await expect(
        beforeRetry({
          request,
          options: dummyOptions,
          error,
          retryCount: 1,
        }),
      ).rejects.toBe(error);

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(redirectToPortalLogin).toHaveBeenCalledTimes(1);
    });
  });
});

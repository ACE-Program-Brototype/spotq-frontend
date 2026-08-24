import { HTTPError, type NormalizedOptions } from "ky";
import { ADMIN_AUTH_ENDPOINTS, AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import * as authRefreshModule from "../auth-refresh";
import { beforeRetry } from "./beforeRetry";

jest.mock("../auth-refresh");

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

  const create401Error = (status = 401) => {
    const error = Object.create(HTTPError.prototype);
    error.name = "HTTPError";
    error.data = { message: "Invalid email or password." };
    error.response = {
      status,
      statusText: "Unauthorized",
    } as Response;
    return error as HTTPError;
  };

  test("should throw error on 401 for auth routes (e.g. login) to propagate HTTPError", async () => {
    const request = createMockRequest(`http://localhost:10000/api/v1${AUTH_ENDPOINTS.LOGIN}`);
    const error = create401Error(401);

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
    const error = create401Error(401);

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
    const error = create401Error(401);

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
    const error = create401Error(401);

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
    const error = create401Error(401);

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
});

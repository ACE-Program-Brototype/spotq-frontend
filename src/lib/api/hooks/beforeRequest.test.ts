import type { NormalizedOptions } from "ky";
import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import * as authRefreshModule from "../auth-refresh";
import { beforeRequest } from "./beforeRequest";

jest.mock("../auth-refresh");

describe("beforeRequest hook", () => {
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

  it("attaches Authorization header when accessToken exists in authStore", async () => {
    useAuthStore.setState({
      accessToken: "existing-in-memory-token",
      isAuthenticated: true,
    });

    const request = createMockRequest("http://localhost:10000/api/v1/protected/data");
    const result = (await beforeRequest({
      request,
      options: dummyOptions,
      retryCount: 0,
    })) as Request;

    expect(result.headers.set).toHaveBeenCalledWith(
      "Authorization",
      "Bearer existing-in-memory-token",
    );
    expect(authRefreshModule.getOrRefreshAccessToken).not.toHaveBeenCalled();
  });

  it("silently restores accessToken on page refresh if user was authenticated", async () => {
    useAuthStore.setState({
      accessToken: null,
      isAuthenticated: true,
    });

    (authRefreshModule.getOrRefreshAccessToken as jest.Mock).mockResolvedValue(
      "restored-token-from-cookie",
    );

    const request = createMockRequest("http://localhost:10000/api/v1/protected/data");
    await beforeRequest({ request, options: dummyOptions, retryCount: 0 });

    expect(authRefreshModule.getOrRefreshAccessToken).toHaveBeenCalledTimes(1);
    expect(request.headers.set).toHaveBeenCalledWith(
      "Authorization",
      "Bearer restored-token-from-cookie",
    );
  });

  it("does not attach Authorization header or refresh token for public auth endpoints (e.g. login)", async () => {
    useAuthStore.setState({
      accessToken: null,
      isAuthenticated: false,
    });

    const request = createMockRequest(`http://localhost:10000/api/v1${AUTH_ENDPOINTS.LOGIN}`);
    await beforeRequest({ request, options: dummyOptions, retryCount: 0 });

    expect(authRefreshModule.getOrRefreshAccessToken).not.toHaveBeenCalled();
    expect(request.headers.set).not.toHaveBeenCalled();
  });
});

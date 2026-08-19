import type { NormalizedOptions } from "ky";
import { beforeRequest } from "./beforeRequest";

describe("beforeRequest hook", () => {
  const dummyOptions = {} as NormalizedOptions;

  beforeEach(() => {
    localStorage.clear();
  });

  it("attaches Authorization header when accessToken exists in localStorage", async () => {
    localStorage.setItem("accessToken", "mock-token-123");

    const headerMap = new Map<string, string>();
    const request = {
      headers: {
        set: jest.fn((k: string, v: string) => headerMap.set(k, v)),
        get: jest.fn((k: string) => headerMap.get(k) ?? null),
      },
    } as unknown as Request;

    const result = (await beforeRequest({
      request,
      options: dummyOptions,
      retryCount: 0,
    })) as Request;

    expect(result.headers.set).toHaveBeenCalledWith("Authorization", "Bearer mock-token-123");
    expect(result.headers.get("Authorization")).toBe("Bearer mock-token-123");
  });

  it("does not attach Authorization header when accessToken is absent", async () => {
    const headerMap = new Map<string, string>();
    const request = {
      headers: {
        set: jest.fn((k: string, v: string) => headerMap.set(k, v)),
        get: jest.fn((k: string) => headerMap.get(k) ?? null),
      },
    } as unknown as Request;

    const result = (await beforeRequest({
      request,
      options: dummyOptions,
      retryCount: 0,
    })) as Request;

    expect(result.headers.set).not.toHaveBeenCalled();
    expect(result.headers.get("Authorization")).toBeNull();
  });
});

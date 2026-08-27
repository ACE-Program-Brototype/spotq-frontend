import { HTTPError, type NormalizedOptions } from "ky";
import { beforeError } from "./beforeError";

describe("beforeError hook", () => {
  const dummyRequest = {} as Request;
  const dummyOptions = {} as NormalizedOptions;

  it("updates error message with data.message if error is HTTPError and data.message exists", async () => {
    const error = new HTTPError({} as Response, dummyRequest, dummyOptions);
    (error as unknown as { data: unknown }).data = {
      success: false,
      message: "Invalid email or password",
    };

    const result = await beforeError({
      error,
      request: dummyRequest,
      options: dummyOptions,
      retryCount: 0,
    });

    expect(result.message).toBe("Invalid email or password");
  });

  it("leaves original error message unchanged if error is HTTPError but data.message is absent", async () => {
    const error = new HTTPError({} as Response, dummyRequest, dummyOptions);
    const originalMessage = error.message;

    const result = await beforeError({
      error,
      request: dummyRequest,
      options: dummyOptions,
      retryCount: 0,
    });

    expect(result.message).toBe(originalMessage);
  });

  it("returns non-HTTPError errors untouched", async () => {
    const genericError = new Error("Generic network failure");

    const result = await beforeError({
      error: genericError as HTTPError,
      request: dummyRequest,
      options: dummyOptions,
      retryCount: 0,
    });

    expect(result.message).toBe("Generic network failure");
  });
});

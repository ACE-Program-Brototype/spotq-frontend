import { HTTPError, NetworkError, TimeoutError } from "ky";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { type ApiErrorPayload, extractErrorMessage, handleAuthError } from "./auth-error-handler";

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("auth-error-handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("extractErrorMessage", () => {
    test("extracts backend response format correctly", () => {
      const backendError: ApiErrorPayload = {
        success: false,
        message: "Invalid email or password.",
        code: "INVALID_CREDENTIALS",
        error: "INVALID_CREDENTIALS",
        statusCode: 401,
      };

      expect(extractErrorMessage(backendError)).toBe("Invalid email or password.");
    });

    test("maps code/error if message is not present", () => {
      expect(
        extractErrorMessage({
          code: "ACCOUNT_BLOCKED",
          statusCode: 403,
        }),
      ).toBe(AUTH_MESSAGES.ACCOUNT_BLOCKED);

      expect(
        extractErrorMessage({
          error: "ACCOUNT_INACTIVE",
          statusCode: 403,
        }),
      ).toBe(AUTH_MESSAGES.ACCOUNT_SUSPENDED);
    });

    test("extracts nested error object message", () => {
      expect(
        extractErrorMessage({
          error: { message: "Account disabled by admin" },
        }),
      ).toBe("Account disabled by admin");
    });

    test("extracts first validation error from errors array", () => {
      expect(extractErrorMessage({ errors: ["Password is too short"] })).toBe(
        "Password is too short",
      );
      expect(
        extractErrorMessage({
          errors: [{ message: "Please provide a valid email" }],
        }),
      ).toBe("Please provide a valid email");
    });
  });

  describe("handleAuthError", () => {
    const createMockHTTPError = (data: ApiErrorPayload, status = 400): HTTPError => {
      const error = Object.create(HTTPError.prototype);
      error.name = "HTTPError";
      error.data = data;
      error.response = {
        status,
        statusText: status === 401 ? "Unauthorized" : "Bad Request",
      } as Response;
      return error as HTTPError;
    };

    test("displays exact message from backend for 401 invalid credentials", () => {
      const error = createMockHTTPError(
        {
          success: false,
          message: "Invalid email or password.",
          code: "INVALID_CREDENTIALS",
          error: "INVALID_CREDENTIALS",
          statusCode: 401,
        },
        401,
      );

      handleAuthError(error, "login");
      expect(toast.error).toHaveBeenCalledWith("Invalid email or password.");
    });

    test("displays status fallback for 401 when body has no message", () => {
      const error = createMockHTTPError({} as ApiErrorPayload, 401);

      handleAuthError(error, "login");
      expect(toast.error).toHaveBeenCalledWith(AUTH_MESSAGES.INVALID_CREDENTIALS);
    });

    test("handles NetworkError correctly", () => {
      const error = Object.create(NetworkError.prototype);
      error.name = "NetworkError";

      handleAuthError(error, "login");
      expect(toast.error).toHaveBeenCalledWith(AUTH_MESSAGES.CONNECTION_ERROR);
    });

    test("handles TimeoutError correctly", () => {
      const error = Object.create(TimeoutError.prototype);
      error.name = "TimeoutError";

      handleAuthError(error, "login");
      expect(toast.error).toHaveBeenCalledWith(
        "Request timed out. Please check your connection and try again.",
      );
    });
  });
});

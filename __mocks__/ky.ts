const mockKyInstance = {
  get: jest.fn().mockReturnThis(),
  post: jest.fn().mockReturnThis(),
  put: jest.fn().mockReturnThis(),
  patch: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  json: jest.fn().mockResolvedValue({}),
};

const ky = Object.assign(
  jest.fn(() => mockKyInstance),
  {
    create: jest.fn(() => mockKyInstance),
    get: jest.fn(() => mockKyInstance),
    post: jest.fn(() => mockKyInstance),
    put: jest.fn(() => mockKyInstance),
    patch: jest.fn(() => mockKyInstance),
    delete: jest.fn(() => mockKyInstance),
  },
);

export class HTTPError extends Error {
  name = "HTTPError";
  response: Response;
  data?: unknown;
  constructor(
    response = new Response(),
    _request = new Request("http://localhost"),
    data?: unknown,
  ) {
    super(`Request failed with status code ${response.status}`);
    this.name = "HTTPError";
    this.response = response;
    this.data = data;
  }
}

export class NetworkError extends Error {
  name = "NetworkError";
  constructor(message = "Network error") {
    super(message);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends Error {
  name = "TimeoutError";
  constructor(message = "Timeout error") {
    super(message);
    this.name = "TimeoutError";
  }
}

export const isHTTPError = <T = unknown>(
  error: unknown,
): error is HTTPError & { data: T } => {
  return (
    error instanceof HTTPError ||
    (typeof error === "object" &&
      error !== null &&
      (error as { name?: string }).name === "HTTPError")
  );
};

export const isNetworkError = (error: unknown): error is NetworkError => {
  return (
    error instanceof NetworkError ||
    (typeof error === "object" &&
      error !== null &&
      (error as { name?: string }).name === "NetworkError")
  );
};

export const isTimeoutError = (error: unknown): error is TimeoutError => {
  return (
    error instanceof TimeoutError ||
    (typeof error === "object" &&
      error !== null &&
      (error as { name?: string }).name === "TimeoutError")
  );
};

export default ky;

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
  response: Response;
  data?: unknown;
  constructor(response = new Response(), _request = new Request("http://localhost"), data?: unknown) {
    super(`Request failed with status code ${response.status}`);
    this.response = response;
    this.data = data;
  }
}

export default ky;

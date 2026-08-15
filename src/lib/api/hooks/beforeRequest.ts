import type { BeforeRequestHook } from "ky";

export const beforeRequest: BeforeRequestHook = ({ request }) => {
  // TODO: Attach authentication token.

  return request;
};

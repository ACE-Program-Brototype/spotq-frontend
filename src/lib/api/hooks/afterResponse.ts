import type { AfterResponseHook } from "ky";

export const afterResponse: AfterResponseHook = ({ response }) => {
  // TODO: Handle common response processing.

  return response;
};

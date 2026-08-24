import type { AfterResponseHook } from "ky";

export const afterResponse: AfterResponseHook = async ({ response }) => {
  return response;
};

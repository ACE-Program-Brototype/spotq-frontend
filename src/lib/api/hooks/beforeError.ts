import type { BeforeErrorHook } from "ky";

export const beforeError: BeforeErrorHook = ({ error }) => {
  // TODO: Normalize API errors.

  return error;
};

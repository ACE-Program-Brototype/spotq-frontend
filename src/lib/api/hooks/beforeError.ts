import { type BeforeErrorHook, HTTPError } from "ky";

type ApiErrorBody = {
  success: boolean;
  message?: string;
};

export const beforeError: BeforeErrorHook = ({ error }) => {
  if (error instanceof HTTPError) {
    const data = error.data as ApiErrorBody | undefined;

    if (data?.message) {
      error.message = data.message;
    }
  }

  return error;
};

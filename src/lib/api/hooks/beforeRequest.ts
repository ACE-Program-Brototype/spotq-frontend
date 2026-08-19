import type { BeforeRequestHook } from "ky";

export const beforeRequest: BeforeRequestHook = ({ request }) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }

  return request;
};

import { apiClient } from "@/lib/api/client";
import type { LoginInput, LoginResult } from "../types/auth.types";

const getDeviceInfo = () => {
  if (typeof window === "undefined" || !navigator) {
    return {
      deviceName: "Server Side",
      platform: "WEB" as const,
    };
  }

  const ua = navigator.userAgent;
  let browser = "Unknown Browser";
  let os = "Unknown OS";

  if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Browser";
  else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
  else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
  else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) browser = "Edge";
  else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
  else if (ua.indexOf("Safari") > -1) browser = "Safari";

  if (ua.indexOf("Windows NT 10.0") > -1) os = "Windows 10/11";
  else if (ua.indexOf("Windows NT 6.2") > -1) os = "Windows 8";
  else if (ua.indexOf("Macintosh") > -1) os = "macOS";
  else if (ua.indexOf("Android") > -1) os = "Android";
  else if (ua.indexOf("iPhone") > -1) os = "iOS";
  else if (ua.indexOf("Linux") > -1) os = "Linux";

  return {
    deviceName: `${browser} on ${os}`,
    platform: "WEB" as const,
  };
};

export const authService = {
  login: async (input: LoginInput): Promise<LoginResult> => {
    const payload = {
      ...input,
      device: input.device || getDeviceInfo(),
    };

    return apiClient
      .post("api/v1/users/login", {
        json: payload,
      })
      .json<LoginResult>();
  },
};

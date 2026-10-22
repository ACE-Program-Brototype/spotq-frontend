import {
  APP_VERSION,
  DEVICE_STORAGE_KEYS,
  NOTIFICATION_PERMISSIONS,
  UUID_V4_TEMPLATE,
} from "../constants/auth.constants";
import type { RegisterDeviceRequest } from "../types/device.types";

/**
 * Generates a standard RFC4122 v4 UUID.
 * Falls back to Math.random implementation if crypto.randomUUID is unavailable.
 */
export const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return UUID_V4_TEMPLATE.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

/**
 * Retrieves the persistent device ID from localStorage or creates and persists a new one.
 */
export const getOrCreateDeviceId = (): string => {
  if (typeof window === "undefined" || !window.localStorage) {
    return generateUUID();
  }

  try {
    const stored = localStorage.getItem(DEVICE_STORAGE_KEYS.DEVICE_ID);
    if (stored && stored.trim().length > 0) {
      return stored.trim();
    }

    const newId = generateUUID();
    localStorage.setItem(DEVICE_STORAGE_KEYS.DEVICE_ID, newId);
    return newId;
  } catch {
    return generateUUID();
  }
};

/**
 * Sets the stored device ID in localStorage.
 */
export const setStoredDeviceId = (deviceId: string): void => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem(DEVICE_STORAGE_KEYS.DEVICE_ID, deviceId.trim());
  } catch {}
};

/**
 * Removes the stored device ID from localStorage.
 */
export const clearStoredDeviceId = (): void => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.removeItem(DEVICE_STORAGE_KEYS.DEVICE_ID);
  } catch {}
};

/**
 * Detects browser and operating system from navigator.userAgent.
 */
export const getDeviceName = (): string => {
  if (typeof window === "undefined" || !navigator) {
    return "Web Browser";
  }

  const ua = navigator.userAgent;
  let browser = "Web Browser";
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

  return `${browser} on ${os}`;
};

/**
 * Returns current client application version.
 */
export const getAppVersion = (): string => {
  return APP_VERSION;
};

/**
 * Constructs a full RegisterDeviceRequest payload with default values for browser clients.
 */
export const buildDevicePayload = (
  overrides?: Partial<RegisterDeviceRequest>,
): RegisterDeviceRequest => {
  return {
    deviceId: overrides?.deviceId ?? getOrCreateDeviceId(),
    platform: overrides?.platform ?? "WEB",
    deviceName: overrides?.deviceName !== undefined ? overrides.deviceName : getDeviceName(),
    appVersion: overrides?.appVersion !== undefined ? overrides.appVersion : getAppVersion(),
    fid: overrides?.fid ?? null,
  };
};

/**
 * Checks if the Web Notification API is supported in current environment.
 */
export const isNotificationSupported = (): boolean => {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    typeof window.Notification !== "undefined"
  );
};

/**
 * Checks current notification permission without triggering prompt.
 */
export const getNotificationPermission = ():
  | NotificationPermission
  | typeof NOTIFICATION_PERMISSIONS.UNSUPPORTED => {
  if (!isNotificationSupported()) return NOTIFICATION_PERMISSIONS.UNSUPPORTED;
  return Notification.permission;
};

/**
 * Requests push notification permission safely.
 */
export const requestPushNotificationPermission = async (): Promise<
  NotificationPermission | typeof NOTIFICATION_PERMISSIONS.UNSUPPORTED
> => {
  if (!isNotificationSupported()) return NOTIFICATION_PERMISSIONS.UNSUPPORTED;
  try {
    return await Notification.requestPermission();
  } catch {
    return NOTIFICATION_PERMISSIONS.DENIED;
  }
};

/**
 * Plays a modern two-tone chime for incoming notifications using Web Audio API.
 */
export const playNotificationChime = (): void => {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.08);
    gain2.gain.setValueAtTime(0.15, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.45);

    const closeContext = () => {
      ctx.close().catch(() => {});
    };

    osc2.onended = closeContext;
    setTimeout(closeContext, 600);
  } catch {
    // Suppress audio initialization failures (e.g. autoplay restriction)
  }
};

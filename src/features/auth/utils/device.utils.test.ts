import { DEVICE_STORAGE_KEYS } from "../constants/auth.constants";
import {
  buildDevicePayload,
  clearStoredDeviceId,
  generateUUID,
  getAppVersion,
  getDeviceName,
  getNotificationPermission,
  getOrCreateDeviceId,
  isNotificationSupported,
  playNotificationChime,
  requestPushNotificationPermission,
  setStoredDeviceId,
} from "./device.utils";

describe("device.utils", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe("generateUUID", () => {
    it("generates a valid UUID string using crypto.randomUUID when available", () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("falls back to manual generator if crypto.randomUUID is undefined", () => {
      const originalCrypto = global.crypto;
      Object.defineProperty(global, "crypto", {
        value: undefined,
        configurable: true,
        writable: true,
      });

      const fallbackUuid = generateUUID();
      expect(fallbackUuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      global.crypto = originalCrypto;
    });
  });

  describe("getOrCreateDeviceId", () => {
    it("returns existing device ID from localStorage if present", () => {
      localStorage.setItem(DEVICE_STORAGE_KEYS.DEVICE_ID, "test-device-uuid-123");

      const deviceId = getOrCreateDeviceId();
      expect(deviceId).toBe("test-device-uuid-123");
    });

    it("generates, stores, and returns new device ID if not present", () => {
      const deviceId = getOrCreateDeviceId();
      expect(deviceId).toBeDefined();
      expect(localStorage.getItem(DEVICE_STORAGE_KEYS.DEVICE_ID)).toBe(deviceId);
    });

    it("handles storage errors safely and returns a fallback UUID", () => {
      jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("Storage blocked");
      });

      const deviceId = getOrCreateDeviceId();
      expect(deviceId).toBeDefined();
      expect(typeof deviceId).toBe("string");
    });
  });

  describe("setStoredDeviceId and clearStoredDeviceId", () => {
    it("saves deviceId to localStorage", () => {
      setStoredDeviceId("custom-device-id");
      expect(localStorage.getItem(DEVICE_STORAGE_KEYS.DEVICE_ID)).toBe("custom-device-id");
    });

    it("clears deviceId from localStorage", () => {
      localStorage.setItem(DEVICE_STORAGE_KEYS.DEVICE_ID, "custom-device-id");
      clearStoredDeviceId();
      expect(localStorage.getItem(DEVICE_STORAGE_KEYS.DEVICE_ID)).toBeNull();
    });
  });

  describe("getDeviceName", () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, "navigator", {
        value: originalNavigator,
        configurable: true,
      });
    });

    it("detects Chrome on macOS correctly", () => {
      Object.defineProperty(global, "navigator", {
        value: {
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        configurable: true,
      });

      expect(getDeviceName()).toBe("Chrome on macOS");
    });

    it("detects Firefox on Windows correctly", () => {
      Object.defineProperty(global, "navigator", {
        value: {
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
        },
        configurable: true,
      });

      expect(getDeviceName()).toBe("Firefox on Windows 10/11");
    });

    it("detects Safari on iOS correctly", () => {
      Object.defineProperty(global, "navigator", {
        value: {
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        },
        configurable: true,
      });

      expect(getDeviceName()).toBe("Safari on iOS");
    });

    it("returns default fallback if navigator is undefined", () => {
      Object.defineProperty(global, "navigator", {
        value: undefined,
        configurable: true,
      });

      expect(getDeviceName()).toBe("Web Browser");
    });
  });

  describe("getAppVersion", () => {
    it("returns default version 1.0.0", () => {
      expect(getAppVersion()).toBe("1.0.0");
    });
  });

  describe("buildDevicePayload", () => {
    it("constructs payload with default detected values", () => {
      const payload = buildDevicePayload();

      expect(payload.platform).toBe("WEB");
      expect(payload.deviceId).toBeDefined();
      expect(typeof payload.deviceId).toBe("string");
      expect(payload.appVersion).toBe("1.0.0");
      expect(payload.deviceName).toBeDefined();
      expect(payload.fid).toBeNull();
    });

    it("allows overriding specific payload fields", () => {
      const payload = buildDevicePayload({
        deviceId: "override-device-id",
        fid: "custom-fid-token",
        appVersion: "2.1.0",
        deviceName: "Custom Device",
      });

      expect(payload.deviceId).toBe("override-device-id");
      expect(payload.fid).toBe("custom-fid-token");
      expect(payload.appVersion).toBe("2.1.0");
      expect(payload.deviceName).toBe("Custom Device");
      expect(payload.platform).toBe("WEB");
    });
  });

  describe("Push Notification Permission helpers", () => {
    it("returns unsupported if window.Notification is not present", () => {
      Object.defineProperty(window, "Notification", {
        value: undefined,
        configurable: true,
        writable: true,
      });

      expect(isNotificationSupported()).toBe(false);
      expect(getNotificationPermission()).toBe("unsupported");
    });

    it("checks permission when Notification is supported", () => {
      // @ts-expect-error mocking Notification
      window.Notification = {
        permission: "granted",
        requestPermission: jest.fn().mockResolvedValue("granted"),
      };

      expect(isNotificationSupported()).toBe(true);
      expect(getNotificationPermission()).toBe("granted");
    });

    it("requests push notification permission", async () => {
      // @ts-expect-error mocking Notification
      window.Notification = {
        permission: "default",
        requestPermission: jest.fn().mockResolvedValue("granted"),
      };

      const result = await requestPushNotificationPermission();
      expect(result).toBe("granted");
    });

    it("handles rejection when requesting permission", async () => {
      // @ts-expect-error mocking Notification
      window.Notification = {
        permission: "default",
        requestPermission: jest.fn().mockRejectedValue(new Error("Permission rejected")),
      };

      const result = await requestPushNotificationPermission();
      expect(result).toBe("denied");
    });
  });

  describe("playNotificationChime", () => {
    it("safely attempts to play chime using Web Audio API when supported", () => {
      const mockOscillator = {
        type: "sine",
        frequency: { setValueAtTime: jest.fn() },
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
      };
      const mockGain = {
        gain: {
          setValueAtTime: jest.fn(),
          exponentialRampToValueAtTime: jest.fn(),
        },
        connect: jest.fn(),
      };
      const mockAudioContext = jest.fn().mockImplementation(() => ({
        currentTime: 0,
        createOscillator: jest.fn().mockReturnValue(mockOscillator),
        createGain: jest.fn().mockReturnValue(mockGain),
        destination: {},
      }));

      (window as unknown as { AudioContext: unknown }).AudioContext = mockAudioContext;

      expect(() => playNotificationChime()).not.toThrow();
      expect(mockAudioContext).toHaveBeenCalled();
      expect(mockOscillator.start).toHaveBeenCalledTimes(2);
    });

    it("does not throw when AudioContext throws an error (e.g. autoplay restriction)", () => {
      (window as unknown as { AudioContext: unknown }).AudioContext = jest
        .fn()
        .mockImplementation(() => {
          throw new Error("Autoplay denied");
        });

      expect(() => playNotificationChime()).not.toThrow();
    });
  });
});

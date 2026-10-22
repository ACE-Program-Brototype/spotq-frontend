import {
  getFirebaseApp,
  getFirebaseMessaging,
  onForegroundMessage,
  onRegisteredFid,
  onUnregisteredFid,
  resetFirebaseInstances,
} from "./firebase";

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({ name: "[DEFAULT]" })),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({ name: "[DEFAULT]" })),
}));

const mockRegister = jest.fn();
const mockUnregister = jest.fn().mockResolvedValue(undefined);
const mockOnRegistered = jest.fn();
const mockOnUnregistered = jest.fn();
const mockOnMessage = jest.fn();
const mockIsSupported = jest.fn();
jest.mock("firebase/messaging", () => ({
  getMessaging: jest.fn(() => ({})),
  register: (...args: unknown[]) => mockRegister(...args),
  unregister: (...args: unknown[]) => mockUnregister(...args),
  onRegistered: (...args: unknown[]) => mockOnRegistered(...args),
  onUnregistered: (...args: unknown[]) => mockOnUnregistered(...args),
  onMessage: (...args: unknown[]) => mockOnMessage(...args),
  isSupported: () => mockIsSupported(),
}));

describe("Firebase Messaging Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetFirebaseInstances();
    mockIsSupported.mockResolvedValue(true);
  });

  describe("getFirebaseApp", () => {
    it("initializes and returns a Firebase app", () => {
      const app = getFirebaseApp();
      expect(app).toBeDefined();
    });
  });

  describe("getFirebaseMessaging", () => {
    it("returns null if messaging is not supported in environment", async () => {
      mockIsSupported.mockResolvedValue(false);
      const messaging = await getFirebaseMessaging();
      expect(messaging).toBeNull();
    });
  });

  describe("onForegroundMessage", () => {
    it("subscribes to messages and formats notification payload", async () => {
      let messageHandler: ((payload: unknown) => void) | undefined;
      mockOnMessage.mockImplementation((_messaging, handler) => {
        messageHandler = handler;
        return () => {};
      });

      const callback = jest.fn();
      await onForegroundMessage(callback);

      expect(mockOnMessage).toHaveBeenCalled();

      if (messageHandler) {
        messageHandler({
          notification: { title: "Order Ready", body: "Table 4" },
          data: { orderId: "123" },
        });

        expect(callback).toHaveBeenCalledWith({
          notification: { title: "Order Ready", body: "Table 4" },
          data: { orderId: "123" },
        });
      }
    });
  });

  describe("onUnregisteredFid", () => {
    it("subscribes to unregistration events", async () => {
      let unregisterHandler: ((fid: string) => void) | undefined;
      mockOnUnregistered.mockImplementation((_messaging, handler) => {
        unregisterHandler = handler;
        return () => {};
      });

      const callback = jest.fn();
      await onUnregisteredFid(callback);

      expect(mockOnUnregistered).toHaveBeenCalled();

      if (unregisterHandler) {
        unregisterHandler("unregistered-fid");
        expect(callback).toHaveBeenCalledWith("unregistered-fid");
      }
    });
  });

  describe("onRegisteredFid", () => {
    it("subscribes to registration events and passes fid to callback", async () => {
      let registeredHandler: ((fid: string) => void) | undefined;
      mockOnRegistered.mockImplementation((_messaging, handler) => {
        registeredHandler = handler;
        return () => {};
      });

      const callback = jest.fn();
      await onRegisteredFid(callback);

      expect(mockOnRegistered).toHaveBeenCalled();

      if (registeredHandler) {
        registeredHandler("new-listener-fid-999");
        expect(callback).toHaveBeenCalledWith("new-listener-fid-999");
      }
    });
  });
});

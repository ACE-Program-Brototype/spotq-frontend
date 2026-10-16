import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { onForegroundMessage, onRegisteredFid, onUnregisteredFid } from "@/lib/firebase/firebase";
import { usePushNotification } from "./use-push-notification";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

let mockIsAuthenticated = false;
jest.mock("../store/auth.store", () => ({
  useAuthStore: (selector: (state: { isAuthenticated: boolean }) => boolean) =>
    selector({ isAuthenticated: mockIsAuthenticated }),
}));

const mockRegisterDeviceMutateAsync = jest.fn();
const mockRegisterDeviceMutate = jest.fn();
const mockDeactivateDeviceMutate = jest.fn();
jest.mock("./use-device", () => ({
  useRegisterDevice: () => ({
    mutateAsync: mockRegisterDeviceMutateAsync,
    mutate: mockRegisterDeviceMutate,
    isPending: false,
  }),
  useDeactivateDevice: () => ({
    mutateAsync: jest.fn(),
    mutate: mockDeactivateDeviceMutate,
    isPending: false,
  }),
}));

const mockRegisterPushNotifications = jest.fn().mockResolvedValue(undefined);
const mockUnregisterPushNotifications = jest.fn().mockResolvedValue(undefined);

jest.mock("@/lib/firebase/firebase", () => ({
  registerPushNotifications: () => mockRegisterPushNotifications(),
  unregisterPushNotifications: () => mockUnregisterPushNotifications(),
  onRegisteredFid: jest.fn().mockResolvedValue(jest.fn()),
  onUnregisteredFid: jest.fn().mockResolvedValue(jest.fn()),
  onForegroundMessage: jest.fn(),
}));

describe("usePushNotification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockRegisterPushNotifications.mockReset();
    mockRegisterPushNotifications.mockResolvedValue(undefined);
    mockUnregisterPushNotifications.mockReset();
    mockUnregisterPushNotifications.mockResolvedValue(undefined);
    mockIsAuthenticated = false;
    // @ts-expect-error mocking Notification
    window.Notification = {
      permission: "default",
      requestPermission: jest.fn().mockResolvedValue("granted"),
    };
  });

  it("successfully enables notifications and triggers registration", async () => {
    mockRegisterPushNotifications.mockImplementation(async () => {
      // @ts-expect-error mocking Notification
      window.Notification.permission = "granted";
    });

    const { result } = renderHook(() => usePushNotification());

    let success = false;
    await act(async () => {
      success = await result.current.enableNotifications();
    });

    expect(mockRegisterPushNotifications).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Notifications enabled successfully!");
    expect(success).toBe(true);
  });

  it("handles denied permission gracefully", async () => {
    // @ts-expect-error mocking Notification
    window.Notification.permission = "denied";

    const { result } = renderHook(() => usePushNotification());

    let success = false;
    await act(async () => {
      success = await result.current.enableNotifications();
    });

    expect(mockRegisterDeviceMutateAsync).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      "Notifications are blocked in browser settings. Please enable them to receive updates.",
    );
    expect(success).toBe(false);
  });

  it("subscribes to foreground push notifications when user is authenticated", async () => {
    mockIsAuthenticated = true;
    let messageCallback: ((payload: unknown) => void) | undefined;
    (onForegroundMessage as jest.Mock).mockImplementation((cb) => {
      messageCallback = cb;
      return Promise.resolve(jest.fn());
    });

    renderHook(() => usePushNotification());

    expect(onForegroundMessage).toHaveBeenCalled();

    if (messageCallback) {
      act(() => {
        messageCallback?.({
          notification: {
            title: "SpotQ: Your Table is Ready!",
            body: "Please proceed to the counter.",
          },
        });
      });

      expect(toast.info).toHaveBeenCalledWith("SpotQ: Your Table is Ready!", {
        description: "Please proceed to the counter.",
      });
    }
  });

  it("automatically triggers registration on mount if permission was already granted", async () => {
    mockIsAuthenticated = true;
    // @ts-expect-error mocking Notification
    window.Notification.permission = "granted";

    await act(async () => {
      renderHook(() => usePushNotification());
    });

    expect(mockRegisterPushNotifications).toHaveBeenCalled();
  });

  it("automatically prompts for permission on mount when user is authenticated and permission is default", async () => {
    mockIsAuthenticated = true;
    // @ts-expect-error mocking Notification
    window.Notification.permission = "default";

    await act(async () => {
      renderHook(() => usePushNotification());
    });

    expect(mockRegisterPushNotifications).toHaveBeenCalled();
  });

  it("does not prompt or register when user is unauthenticated", async () => {
    mockIsAuthenticated = false;
    // @ts-expect-error mocking Notification
    window.Notification.permission = "default";

    await act(async () => {
      renderHook(() => usePushNotification());
    });

    expect(mockRegisterPushNotifications).not.toHaveBeenCalled();
  });
  it("registers device token on server when onRegisteredFid emits a fid", async () => {
    mockIsAuthenticated = true;
    let registeredCallback: ((fid: string) => void) | undefined;
    (onRegisteredFid as jest.Mock).mockImplementation((cb) => {
      registeredCallback = cb;
      return Promise.resolve(jest.fn());
    });

    await act(async () => {
      renderHook(() => usePushNotification());
    });

    act(() => {
      registeredCallback?.("shared-fid-123");
    });

    expect(mockRegisterDeviceMutate).toHaveBeenCalledTimes(1);
    expect(mockRegisterDeviceMutate).toHaveBeenCalledWith({
      fid: "shared-fid-123",
    });
  });

  it("automatically deactivates device on unregistration event", async () => {
    mockIsAuthenticated = true;
    let unregisteredHandler: ((fid: string) => void) | undefined;
    (onUnregisteredFid as jest.Mock).mockImplementation((cb) => {
      unregisteredHandler = cb;
      return Promise.resolve(jest.fn());
    });

    renderHook(() => usePushNotification());

    expect(onUnregisteredFid).toHaveBeenCalled();

    act(() => {
      unregisteredHandler?.("unregistered-fid-789");
    });

    expect(mockDeactivateDeviceMutate).toHaveBeenCalled();
  });

  it("handles permission changes from permissions.query in real time", async () => {
    mockIsAuthenticated = true;

    let changeListener: (() => void) | undefined;
    const mockStatus = {
      state: "granted",
      addEventListener: jest.fn((event, cb) => {
        if (event === "change") changeListener = cb;
      }),
      removeEventListener: jest.fn(),
    };

    Object.defineProperty(navigator, "permissions", {
      value: {
        query: jest.fn().mockResolvedValue(mockStatus),
      },
      configurable: true,
    });

    await act(async () => {
      renderHook(() => usePushNotification());
    });

    expect(navigator.permissions.query).toHaveBeenCalledWith({ name: "notifications" });

    // Simulate switching permission to "granted" in browser
    mockStatus.state = "granted";
    await act(async () => {
      changeListener?.();
    });

    expect(mockRegisterPushNotifications).toHaveBeenCalled();

    // Simulate switching permission to "denied" in browser
    mockStatus.state = "denied";
    act(() => {
      changeListener?.();
    });

    expect(mockUnregisterPushNotifications).toHaveBeenCalled();

    // Simulate switching permission to "prompt" (default) in browser
    mockStatus.state = "prompt";
    act(() => {
      changeListener?.();
    });

    expect(mockUnregisterPushNotifications).toHaveBeenCalledTimes(2);
  });
});

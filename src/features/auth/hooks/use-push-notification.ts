import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  onForegroundMessage,
  onRegisteredFid,
  onUnregisteredFid,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/lib/firebase/firebase";
import {
  NOTIFICATION_EVENTS,
  NOTIFICATION_PERMISSIONS,
  PUSH_NOTIFICATION_MESSAGES,
} from "../constants/auth.constants";
import { useAuthStore } from "../store/auth.store";
import {
  getNotificationPermission,
  getOrCreateDeviceId,
  isNotificationSupported,
  playNotificationChime,
} from "../utils/device.utils";
import { useDeactivateDevice, useRegisterDevice } from "./use-device";

export const usePushNotification = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const registerDeviceMutation = useRegisterDevice();
  const deactivateDeviceMutation = useDeactivateDevice();
  const [permission, setPermission] = useState<
    NotificationPermission | typeof NOTIFICATION_PERMISSIONS.UNSUPPORTED
  >(() => getNotificationPermission());

  const enableNotifications = useCallback(async (): Promise<boolean> => {
    if (!isNotificationSupported()) {
      toast.error(PUSH_NOTIFICATION_MESSAGES.UNSUPPORTED);
      return false;
    }

    try {
      await registerPushNotifications();
      const newPerm = getNotificationPermission();
      setPermission(newPerm);

      if (newPerm === NOTIFICATION_PERMISSIONS.GRANTED) {
        toast.success(PUSH_NOTIFICATION_MESSAGES.ENABLED_SUCCESS);
        return true;
      }

      if (newPerm === NOTIFICATION_PERMISSIONS.DENIED) {
        toast.error(PUSH_NOTIFICATION_MESSAGES.BLOCKED_ERROR);
      }
      return false;
    } catch (error) {
      console.warn("Failed to enable push notifications:", error);
      toast.error(PUSH_NOTIFICATION_MESSAGES.ENABLE_FAILED);
      return false;
    }
  }, []);

  const registerDeviceMutate = registerDeviceMutation.mutate;
  const deactivateDeviceMutate = deactivateDeviceMutation.mutate;

  // Real-time listener for browser permission state changes (e.g. Block / Allow in URL bar)
  useEffect(() => {
    if (typeof navigator === "undefined" || !("permissions" in navigator)) return;

    let permissionStatus: PermissionStatus | null = null;

    const handlePermissionChange = () => {
      if (!permissionStatus) return;
      const state = permissionStatus.state;
      const normalizedPermission: NotificationPermission =
        state === NOTIFICATION_PERMISSIONS.GRANTED
          ? NOTIFICATION_PERMISSIONS.GRANTED
          : state === NOTIFICATION_PERMISSIONS.DENIED
            ? NOTIFICATION_PERMISSIONS.DENIED
            : NOTIFICATION_PERMISSIONS.DEFAULT;
      setPermission(normalizedPermission);

      if (state === NOTIFICATION_PERMISSIONS.GRANTED) {
        registerPushNotifications().catch(() => {});
      } else {
        unregisterPushNotifications().catch(() => {});
      }
    };

    navigator.permissions
      .query({ name: NOTIFICATION_EVENTS.PERMISSION_NAME as PermissionName })
      .then((status) => {
        permissionStatus = status;
        status.addEventListener(NOTIFICATION_EVENTS.CHANGE, handlePermissionChange);
      })
      .catch(() => {});

    return () => {
      if (permissionStatus) {
        permissionStatus.removeEventListener(NOTIFICATION_EVENTS.CHANGE, handlePermissionChange);
      }
    };
  }, []);

  // Main push notification lifecycle
  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubRegistered: (() => void) | null = null;
    let unsubUnregistered: (() => void) | null = null;
    let unsubForeground: (() => void) | null = null;
    let isSubscribed = true;

    // 1. Listen for incoming foreground messages (show in-app toast & chime)
    onForegroundMessage((payload) => {
      const title =
        payload.notification?.title ||
        payload.data?.title ||
        PUSH_NOTIFICATION_MESSAGES.DEFAULT_TITLE;
      const body = payload.notification?.body || payload.data?.body || "";

      playNotificationChime();
      toast.info(title, { description: body });
    }).then((unsub) => {
      if (!isSubscribed) {
        unsub?.();
        return;
      }
      unsubForeground = unsub;
    });

    // 2. The Single Source of Truth for device registration:
    onRegisteredFid((fid) => {
      if (!isSubscribed || !fid) return;
      registerDeviceMutate({ fid });
    }).then((unsub) => {
      if (!isSubscribed) {
        unsub?.();
        return;
      }
      unsubRegistered = unsub;
    });

    // 3. Listen for unregistration events
    onUnregisteredFid(() => {
      if (!isSubscribed) return;
      const deviceId = getOrCreateDeviceId();
      deactivateDeviceMutate(deviceId);
    }).then((unsub) => {
      if (!isSubscribed) {
        unsub?.();
        return;
      }
      unsubUnregistered = unsub;
    });

    // 4. Automatically prompt or sync registration for authenticated customers
    const currentPermission = getNotificationPermission();
    if (
      currentPermission === NOTIFICATION_PERMISSIONS.GRANTED ||
      currentPermission === NOTIFICATION_PERMISSIONS.DEFAULT
    ) {
      registerPushNotifications().catch((err) => {
        console.warn("FCM registration error:", err);
      });
    }

    return () => {
      isSubscribed = false;
      unsubRegistered?.();
      unsubUnregistered?.();
      unsubForeground?.();
    };
  }, [isAuthenticated, registerDeviceMutate, deactivateDeviceMutate]);

  return {
    enableNotifications,
    permission,
    isSupported: isNotificationSupported(),
    isLoading: registerDeviceMutation.isPending,
  };
};

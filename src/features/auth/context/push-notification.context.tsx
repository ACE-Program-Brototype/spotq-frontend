import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PushNotificationToast } from "@/components/notifications/PushNotificationToast";
import {
  NOTIFICATION_EVENTS,
  NOTIFICATION_PERMISSIONS,
  PUSH_NOTIFICATION_MESSAGES,
} from "@/features/auth/constants/auth.constants";
import { useDeactivateDevice, useRegisterDevice } from "@/features/auth/hooks/use-device";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  getNotificationPermission,
  getOrCreateDeviceId,
  isNotificationSupported,
  playNotificationChime,
} from "@/features/auth/utils/device.utils";
import {
  onForegroundMessage,
  onRegisteredFid,
  onUnregisteredFid,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/lib/firebase/firebase";

export interface PushNotificationContextValue {
  permission: NotificationPermission | typeof NOTIFICATION_PERMISSIONS.UNSUPPORTED;
  enableNotifications: () => Promise<boolean>;
  isSupported: boolean;
  isLoading: boolean;
}

const PushNotificationContext = createContext<PushNotificationContextValue | null>(null);

export const usePushNotificationState = (enabled = true): PushNotificationContextValue => {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !("permissions" in navigator)) return;

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
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !isAuthenticated) return;

    let unsubRegistered: (() => void) | null = null;
    let unsubUnregistered: (() => void) | null = null;
    let unsubForeground: (() => void) | null = null;
    let isSubscribed = true;

    onForegroundMessage((payload) => {
      const title =
        payload.notification?.title ||
        payload.data?.title ||
        PUSH_NOTIFICATION_MESSAGES.DEFAULT_TITLE;
      const body = payload.notification?.body || payload.data?.body || "";
      const deepLink = payload.data?.deepLink || payload.data?.click_action;

      playNotificationChime();

      if (typeof toast.custom === "function") {
        toast.custom(
          (id) => (
            <PushNotificationToast
              id={id}
              title={title}
              body={body}
              deepLink={deepLink}
              onNavigate={navigate}
            />
          ),
          { duration: 5000 },
        );
      } else {
        toast.info(title, {
          description: body,
          ...(deepLink
            ? {
                action: {
                  label: "View",
                  onClick: () => {
                    navigate(deepLink);
                  },
                },
              }
            : {}),
        });
      }
    }).then((unsub) => {
      if (!isSubscribed) {
        unsub?.();
        return;
      }
      unsubForeground = unsub;
    });

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
  }, [enabled, isAuthenticated, registerDeviceMutate, deactivateDeviceMutate, navigate]);

  return {
    enableNotifications,
    permission,
    isSupported: isNotificationSupported(),
    isLoading: registerDeviceMutation.isPending,
  };
};

export function PushNotificationProvider({ children }: { children: ReactNode }) {
  const value = usePushNotificationState(true);

  return (
    <PushNotificationContext.Provider value={value}>{children}</PushNotificationContext.Provider>
  );
}

export function usePushNotification(): PushNotificationContextValue {
  const context = useContext(PushNotificationContext);
  const fallback = usePushNotificationState(!context);
  return context || fallback;
}

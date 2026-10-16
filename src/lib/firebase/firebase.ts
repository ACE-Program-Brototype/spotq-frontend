import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  getMessaging,
  isSupported,
  type MessagePayload,
  type Messaging,
  onMessage,
  onRegistered,
  onUnregistered,
  register,
  type Unsubscribe,
  unregister,
} from "firebase/messaging";
import env from "@/config/env";

let firebaseApp: FirebaseApp | null = null;
let messagingInstance: Messaging | null = null;

export const resetFirebaseInstances = (): void => {
  firebaseApp = null;
  messagingInstance = null;
};

/**
 * Returns or initializes the FirebaseApp instance.
 */
export const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === "undefined") return null;
  if (!env.firebase?.apiKey || !env.firebase?.projectId) return null;
  if (firebaseApp) return firebaseApp;

  if (getApps().length > 0) {
    firebaseApp = getApp();
    return firebaseApp;
  }

  firebaseApp = initializeApp({
    apiKey: env.firebase.apiKey,
    authDomain: env.firebase.authDomain,
    projectId: env.firebase.projectId,
    storageBucket: env.firebase.storageBucket,
    messagingSenderId: env.firebase.messagingSenderId,
    appId: env.firebase.appId,
    measurementId: env.firebase.measurementId,
  });

  return firebaseApp;
};

/**
 * Returns the Firebase Messaging instance if supported in current browser.
 */
export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (messagingInstance) return messagingInstance;
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  const app = getFirebaseApp();
  if (!app) return null;

  messagingInstance = getMessaging(app);
  return messagingInstance;
};

/**
 * Ensures the Service Worker is registered, ready, and active.
 */
export const ensureServiceWorkerController =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;

    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      await navigator.serviceWorker.ready;
      return registration;
    } catch (err) {
      console.warn("Service Worker registration failed:", err);
      return null;
    }
  };

/**
 * Registers the device with FCM via native register().
 * The resulting FID is delivered via onRegistered listeners.
 */
export const registerPushNotifications = async (): Promise<void> => {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
  }

  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  const registration = await ensureServiceWorkerController();
  if (!registration) return;

  await register(messaging, {
    vapidKey: env.firebase.vapidKey,
    serviceWorkerRegistration: registration,
  });
};

/**
 * Deregisters the device with FCM via native unregister().
 */
export const unregisterPushNotifications = async (): Promise<void> => {
  try {
    const messaging = await getFirebaseMessaging();
    if (messaging) {
      await unregister(messaging);
    }
  } catch (err) {
    console.warn("Error unregistering from FCM:", err);
  }
};

/**
 * Subscribes to FID registration and rotation events from Firebase.
 */
export const onRegisteredFid = async (
  callback: (fid: string) => void,
): Promise<Unsubscribe | null> => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  return onRegistered(messaging, (fid: string) => {
    if (fid) {
      callback(fid);
    }
  });
};

/**
 * Subscribes to FID unregistration events from Firebase.
 */
export const onUnregisteredFid = async (
  callback: (fid: string) => void,
): Promise<Unsubscribe | null> => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  return onUnregistered(messaging, (fid: string) => {
    callback(fid);
  });
};

/**
 * Subscribes to foreground push notification messages.
 */
export const onForegroundMessage = async (
  callback: (payload: MessagePayload) => void,
): Promise<Unsubscribe | null> => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  return onMessage(messaging, callback);
};

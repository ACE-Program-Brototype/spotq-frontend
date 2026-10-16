/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/13.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging-compat.js");

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const firebaseConfig = {
  apiKey: "%VITE_FIREBASE_API_KEY%",
  authDomain: "%VITE_FIREBASE_AUTH_DOMAIN%",
  projectId: "%VITE_FIREBASE_PROJECT_ID%",
  storageBucket: "%VITE_FIREBASE_STORAGE_BUCKET%",
  messagingSenderId: "%VITE_FIREBASE_MESSAGING_SENDER_ID%",
  appId: "%VITE_FIREBASE_APP_ID%",
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    // When a message includes a 'notification' payload, Firebase Cloud Messaging automatically
    // displays it. Only display manually for data-only messages to prevent duplicate notifications.
    if (!payload.notification) {
      const notificationTitle = payload.data?.title || "SpotQ";
      const notificationOptions = {
        body: payload.data?.body || "You have a new update.",
        icon: "/favicon.svg",
        badge: "/favicon.svg",
        silent: false,
        vibrate: [200, 100, 200],
        data: payload.data || {},
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    }
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const clickAction = event.notification.data?.click_action || event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(clickAction);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(clickAction);
      }
    }),
  );
});

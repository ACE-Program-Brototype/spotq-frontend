const env = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:10000/api/v1",
  locationIqToken: import.meta.env.VITE_LOCATIONIQ_ACCESS_TOKEN || "",
  cdnBaseUrl:
    import.meta.env.VITE_CDN_BASE_URL ||
    import.meta.env.VITE_S3_BASE_URL ||
    "https://spotq-restaurant-files.s3.ap-south-1.amazonaws.com",
  staffInvitationStaleTimeMs:
    Number(import.meta.env.VITE_STAFF_INVITATION_STALE_TIME_MS) || 300_000,
  googleMapsBaseUrl: import.meta.env.VITE_GOOGLE_MAPS_BASE_URL || "https://www.google.com/maps",
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || "",
  },
} as const;

export default env;

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { User } from "@/features/auth/types/auth.types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  savedAt: number | null;

  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
};

const customStorage = {
  getItem: (name: string): string | null => {
    const dataStr = localStorage.getItem(name);
    if (!dataStr) return null;

    try {
      const parsed = JSON.parse(dataStr);
      const savedAt = parsed.state?.savedAt;

      if (savedAt) {
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - savedAt > thirtyDaysMs) {
          localStorage.removeItem(name);
          return null;
        }
      }
    } catch {
      // Allow parse fallback
    }

    return dataStr;
  },
  setItem: (name: string, value: string): void => {
    localStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      savedAt: null,

      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
          savedAt: Date.now(),
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          savedAt: null,
        }),
    }),
    {
      name: "spotq-auth-storage",
      storage: createJSONStorage(() => customStorage),
    },
  ),
);

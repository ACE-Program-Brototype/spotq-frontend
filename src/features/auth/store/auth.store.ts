import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import type { User } from "@/features/auth/types/auth.types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  savedAt: number | null;

  setAuth: (user: User, accessToken: string) => void;
  setUser: (user: User | null) => void;
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
    } catch {}

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
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        savedAt: null,

        setAuth: (user, accessToken) =>
          set(
            {
              user,
              accessToken,
              isAuthenticated: true,
              savedAt: Date.now(),
            },
            false,
            "auth/setAuth",
          ),

        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: !!user,
              savedAt: Date.now(),
            },
            false,
            "auth/setUser",
          ),

        clearAuth: () =>
          set(
            {
              user: null,
              accessToken: null,
              isAuthenticated: false,
              savedAt: null,
            },
            false,
            "auth/clearAuth",
          ),
      }),
      {
        name: "spotq-auth-storage",
        storage: createJSONStorage(() => customStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          savedAt: state.savedAt,
        }),
      },
    ),
    {
      name: "AuthStore",
      enabled:
        typeof globalThis !== "undefined" &&
        (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !==
          "production",
    },
  ),
);

if (typeof window !== "undefined") {
  (window as unknown as { authStore: typeof useAuthStore }).authStore = useAuthStore;
}

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { User } from "@/features/auth/types/auth.types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;

  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  setRememberMe: (rememberMe: boolean) => void;
};

const customStorage = {
  getItem: (name: string): string | null => {
    const local = localStorage.getItem(name);
    if (local) return local;
    return sessionStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    try {
      const parsed = JSON.parse(value);
      const rememberMe = parsed.state?.rememberMe;
      if (rememberMe) {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name);
      } else {
        sessionStorage.setItem(name, value);
        localStorage.removeItem(name);
      }
    } catch {
      sessionStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      rememberMe: false,

      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),

      setRememberMe: (rememberMe) =>
        set({
          rememberMe,
        }),
    }),
    {
      name: "spotq-auth-storage",
      storage: createJSONStorage(() => customStorage),
    },
  ),
);

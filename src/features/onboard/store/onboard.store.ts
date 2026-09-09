import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { OnboardState } from "../types/onboard.types";

export const useOnboardStore = create<OnboardState>()(
  devtools(
    persist(
      (set) => ({
        businessInformation: null,

        setBusinessInformation: (data) =>
          set({ businessInformation: data }, false, "onboard/setBusinessInformation"),

        resetOnboardStore: () =>
          set({ businessInformation: null }, false, "onboard/resetOnboardStore"),
      }),
      {
        name: "spotq-onboard-storage",
        storage: createJSONStorage(() => localStorage),
      },
    ),
    {
      name: "OnboardStore",
      enabled:
        typeof globalThis !== "undefined" &&
        (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !==
          "production",
    },
  ),
);

import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { DocumentsState, OnboardState } from "../types/onboard.types";

const initialDocuments: DocumentsState = {
  fssai: null,
  businessRegistration: null,
  ownerIdentity: null,
  gst: null,
  businessPan: null,
};

export const useOnboardStore = create<OnboardState>()(
  devtools(
    persist(
      (set) => ({
        businessInformation: null,
        documents: initialDocuments,
        restaurantImages: [],

        setBusinessInformation: (data) =>
          set({ businessInformation: data }, false, "onboard/setBusinessInformation"),

        setDocument: (type, doc) =>
          set(
            (state) => ({
              documents: {
                ...state.documents,
                [type]: doc,
              },
            }),
            false,
            `onboard/setDocument/${type}`,
          ),

        setRestaurantImages: (images) =>
          set(
            {
              restaurantImages: images.map((img, index) => ({
                ...img,
                displayOrder: index + 1,
              })),
            },
            false,
            "onboard/setRestaurantImages",
          ),

        addRestaurantImage: (image) =>
          set(
            (state) => {
              const newImages = [
                ...state.restaurantImages,
                {
                  ...image,
                  displayOrder: state.restaurantImages.length + 1,
                },
              ];
              return { restaurantImages: newImages };
            },
            false,
            "onboard/addRestaurantImage",
          ),

        removeRestaurantImage: (index) =>
          set(
            (state) => {
              const filtered = state.restaurantImages.filter((_, i) => i !== index);
              const reordered = filtered.map((img, i) => ({
                ...img,
                displayOrder: i + 1,
              }));
              return { restaurantImages: reordered };
            },
            false,
            "onboard/removeRestaurantImage",
          ),

        resetOnboardStore: () =>
          set(
            {
              businessInformation: null,
              documents: initialDocuments,
              restaurantImages: [],
            },
            false,
            "onboard/resetOnboardStore",
          ),
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

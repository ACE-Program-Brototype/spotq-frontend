import type { DietaryType } from "../constants/menu.constants";
import type { CreateMenuItemFormData } from "../schemas/create-menu-item.schema";
import type { MenuItemDetails } from "../types/menu.types";

export const parseVariantNamePortion = (fullName: string = "") => {
  if (!fullName) return { name: "", portion: "" };
  const match = fullName.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return { name: match[1].trim(), portion: match[2].trim() };
  }
  return { name: fullName.trim(), portion: "" };
};

export function getMenuItemFormDefaultValues(
  initialData?: MenuItemDetails | null,
): CreateMenuItemFormData {
  if (initialData) {
    const parsedVariants =
      initialData.variants && initialData.variants.length > 0
        ? initialData.variants.map((v) => {
            const { name, portion } = parseVariantNamePortion(v.name);
            return {
              id: v.id,
              name,
              portion,
              price: v.price,
              sku: v.sku || "",
              isDefault: v.isDefault,
              isAvailable: v.isAvailable,
            };
          })
        : [
            {
              name: "",
              portion: "",
              price: undefined as never,
              sku: "",
              isDefault: true,
              isAvailable: true,
            },
          ];

    const selectedAddonIds = initialData.addons?.map((a) => a.addonId) ?? [];
    const addonOverrides: Record<string, number | null> = {};
    initialData.addons?.forEach((a) => {
      if (a.priceOverride !== null && a.priceOverride !== undefined) {
        addonOverrides[a.addonId] = a.priceOverride;
      }
    });

    const initialDietaryType: DietaryType =
      initialData.dietaryType || (initialData.isVegetarian ? "VEG" : "NON_VEG");

    return {
      name: initialData.name || "",
      categoryId: initialData.categoryId || "",
      description: initialData.description || "",
      dietaryType: initialDietaryType,
      preparationTime: initialData.preparationTime ?? undefined,
      imageUrl: initialData.images?.[0]?.objectKey || "",
      isAvailable: initialData.isAvailable ?? true,
      variants: parsedVariants,
      selectedAddonIds,
      addonOverrides,
    };
  }

  return {
    name: "",
    categoryId: "",
    description: "",
    dietaryType: "VEG",
    preparationTime: undefined,
    imageUrl: "",
    isAvailable: true,
    variants: [
      {
        name: "",
        portion: "",
        price: undefined as never,
        sku: "",
        isDefault: true,
        isAvailable: true,
      },
    ],
    selectedAddonIds: [],
    addonOverrides: {},
  };
}

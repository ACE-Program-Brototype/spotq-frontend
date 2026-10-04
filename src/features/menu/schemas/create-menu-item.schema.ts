import { z } from "zod";
import { DIETARY_TYPES, MENU_MESSAGES } from "@/features/menu/constants/menu.constants";

export const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, MENU_MESSAGES.VALIDATION_VARIANT_NAME_REQUIRED),
  portion: z.string().trim().min(1, MENU_MESSAGES.VALIDATION_VARIANT_PORTION_REQUIRED),
  price: z
    .number({ message: MENU_MESSAGES.VALIDATION_VARIANT_PRICE_REQUIRED })
    .positive(MENU_MESSAGES.VALIDATION_VARIANT_PRICE_POSITIVE),
  sku: z.string().trim().optional(),
  isDefault: z.boolean(),
  isAvailable: z.boolean(),
});

export const createMenuItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, MENU_MESSAGES.VALIDATION_ITEM_NAME_REQUIRED)
    .max(255, MENU_MESSAGES.VALIDATION_ITEM_NAME_MAX),
  categoryId: z.string().min(1, MENU_MESSAGES.VALIDATION_CATEGORY_REQUIRED),
  description: z
    .string()
    .trim()
    .min(1, MENU_MESSAGES.VALIDATION_DESCRIPTION_REQUIRED)
    .max(1000, MENU_MESSAGES.VALIDATION_DESCRIPTION_MAX),
  dietaryType: z.enum(DIETARY_TYPES),
  preparationTime: z
    .number({ message: MENU_MESSAGES.VALIDATION_PREP_TIME_REQUIRED })
    .int()
    .min(0, MENU_MESSAGES.VALIDATION_PREP_TIME_POSITIVE),
  imageUrl: z.string().trim().min(1, MENU_MESSAGES.VALIDATION_IMAGE_REQUIRED),
  isAvailable: z.boolean(),
  variants: z
    .array(variantSchema)
    .min(1, MENU_MESSAGES.VALIDATION_VARIANTS_MIN)
    .refine((items) => items.filter((v) => v.isDefault).length === 1, {
      message: MENU_MESSAGES.VALIDATION_ONE_DEFAULT_VARIANT,
    }),
  selectedAddonIds: z.array(z.string()),
  addonOverrides: z.record(z.string(), z.number()),
});

export type VariantFormData = z.infer<typeof variantSchema>;
export type CreateMenuItemFormData = z.infer<typeof createMenuItemSchema>;

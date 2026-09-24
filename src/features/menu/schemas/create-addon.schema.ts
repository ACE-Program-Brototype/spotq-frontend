import { z } from "zod";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";

export const createAddonSchema = z.object({
  name: z.string().trim().min(1, MENU_MESSAGES.VALIDATION_ADDON_NAME_REQUIRED).max(255),
  description: z.string().trim().max(1000).optional(),
  price: z.number().min(0, MENU_MESSAGES.VALIDATION_ADDON_PRICE_NON_NEGATIVE),
  isAvailable: z.boolean(),
  imageKey: z.string().optional(),
});

export type CreateAddonFormData = z.infer<typeof createAddonSchema>;

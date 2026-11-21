import { z } from "zod";
import {
  CATEGORY_NAME_MAX_LENGTH,
  MENU_MESSAGES,
} from "@/features/menu/constants/menu.constants";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, MENU_MESSAGES.VALIDATION_CATEGORY_NAME_REQUIRED)
    .max(CATEGORY_NAME_MAX_LENGTH, MENU_MESSAGES.VALIDATION_CATEGORY_NAME_MAX),
  description: z.string().trim().max(1000).optional(),
  displayOrder: z.number().int(MENU_MESSAGES.VALIDATION_CATEGORY_ORDER_INTEGER).nonnegative(),
  isActive: z.boolean(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

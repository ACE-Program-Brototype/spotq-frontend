/**
 * Menu Category Validation Schemas
 * Zod schemas for validating menu category form inputs.
 */

import { z } from "zod";
import { MENU_MESSAGES } from "../constants/menu.constants";

export const menuCategorySchema = z.object({
  name: z
    .string({ message: MENU_MESSAGES.NAME_REQUIRED })
    .trim()
    .min(1, { message: MENU_MESSAGES.NAME_REQUIRED })
    .max(255, { message: MENU_MESSAGES.NAME_MAX_LENGTH }),
  description: z
    .string()
    .trim()
    .max(1000, { message: MENU_MESSAGES.DESCRIPTION_MAX_LENGTH })
    .optional()
    .nullable(),
  displayOrder: z
    .number({
      message: MENU_MESSAGES.DISPLAY_ORDER_INVALID,
    })
    .int({ message: MENU_MESSAGES.DISPLAY_ORDER_INVALID })
    .min(0, { message: MENU_MESSAGES.DISPLAY_ORDER_INVALID }),
  isActive: z.boolean({ message: MENU_MESSAGES.STATUS_INVALID }),
});

export type MenuCategorySchema = z.infer<typeof menuCategorySchema>;

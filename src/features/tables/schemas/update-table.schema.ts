import { z } from "zod";
import {
  TABLE_NAME_MAX_LENGTH,
  TABLE_SHAPE,
  UPDATE_TABLE_VALIDATION_MESSAGES,
} from "@/features/tables/constants/table.constants";

export const updateTableSchema = z.object({
  tableCode: z
    .string()
    .trim()
    .min(1, UPDATE_TABLE_VALIDATION_MESSAGES.TABLE_CODE_REQUIRED)
    .max(TABLE_NAME_MAX_LENGTH, UPDATE_TABLE_VALIDATION_MESSAGES.TABLE_CODE_MAX),
  sectionId: z.string().min(1, UPDATE_TABLE_VALIDATION_MESSAGES.SECTION_REQUIRED),
  capacity: z
    .number({ message: UPDATE_TABLE_VALIDATION_MESSAGES.CAPACITY_NUMBER })
    .int(UPDATE_TABLE_VALIDATION_MESSAGES.CAPACITY_INTEGER)
    .min(1, UPDATE_TABLE_VALIDATION_MESSAGES.CAPACITY_MIN)
    .max(100, UPDATE_TABLE_VALIDATION_MESSAGES.CAPACITY_MAX),
  tableShape: z.enum([TABLE_SHAPE.CIRCLE, TABLE_SHAPE.SQUARE]),
});

export type UpdateTableFormData = z.infer<typeof updateTableSchema>;

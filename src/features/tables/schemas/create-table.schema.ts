import { z } from "zod";
import { CREATE_TABLE_VALIDATION_MESSAGES } from "../constants/table.constants";

export const createTableSchema = z.object({
  tableCode: z.string().trim().min(1, CREATE_TABLE_VALIDATION_MESSAGES.TABLE_CODE_REQUIRED).max(40),
  sectionId: z.string().min(1, CREATE_TABLE_VALIDATION_MESSAGES.SECTION_REQUIRED),
  capacity: z
    .number({ message: CREATE_TABLE_VALIDATION_MESSAGES.CAPACITY_NUMBER })
    .int(CREATE_TABLE_VALIDATION_MESSAGES.CAPACITY_INTEGER)
    .min(1, CREATE_TABLE_VALIDATION_MESSAGES.CAPACITY_MIN)
    .max(100, CREATE_TABLE_VALIDATION_MESSAGES.CAPACITY_MAX),
  tableShape: z.enum(["CIRCLE", "SQUARE"]),
});

export type CreateTableFormData = z.infer<typeof createTableSchema>;

import { z } from "zod";

export const inviteStaffSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
});

export type InviteStaffFormValues = z.infer<typeof inviteStaffSchema>;

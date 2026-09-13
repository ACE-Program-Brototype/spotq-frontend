import { inviteStaffSchema } from "./staff-invitation.schema";

describe("inviteStaffSchema", () => {
  it("validates correct email address", () => {
    const result = inviteStaffSchema.safeParse({ email: "staff@restaurant.com" });
    expect(result.success).toBe(true);
  });

  it("fails on invalid email address", () => {
    const result = inviteStaffSchema.safeParse({ email: "invalid-email" });
    expect(result.success).toBe(false);
  });
});

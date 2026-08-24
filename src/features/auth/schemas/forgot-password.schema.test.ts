import { forgotPasswordSchema } from "./forgot-password.schema";

describe("forgotPasswordSchema", () => {
  it("passes with a valid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "admin@spotq.com",
    });
    expect(result.success).toBe(true);
  });

  it("fails when email is invalid", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "invalid-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/valid email/i);
    }
  });

  it("fails when email is empty", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "",
    });
    expect(result.success).toBe(false);
  });
});

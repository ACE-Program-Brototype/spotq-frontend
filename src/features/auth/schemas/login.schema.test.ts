import { loginSchema } from "./login.schema";

describe("loginSchema validation", () => {
  it("passes with valid email and password (8+ chars)", () => {
    const result = loginSchema.safeParse({
      email: "admin@spotq.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("fails when email is invalid", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/valid email/i);
    }
  });

  it("fails when password is shorter than 8 characters", () => {
    const result = loginSchema.safeParse({
      email: "admin@spotq.com",
      password: "123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/at least 8 characters/i);
    }
  });

  it("fails when fields are empty", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
    }
  });
});
